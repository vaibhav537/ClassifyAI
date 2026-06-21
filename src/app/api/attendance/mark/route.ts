import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCityfromIp, haversineDistance, logActivity } from "@/lib/helper";
import { evaluateAttendanceRiskAfterMarking } from "@/lib/risk";

async function runRiskEvaluationSafely(input: {
  attendanceId: string;
  triggeredByUserId?: string | null;
}) {
  try {
    const result = await evaluateAttendanceRiskAfterMarking({
      attendanceId: input.attendanceId,
      triggeredByUserId: input.triggeredByUserId ?? null,
    });

    console.log("[CircleOfCareRisk] Evaluation result:", result);
  } catch (error) {
    console.error("[CircleOfCareRisk] Evaluation failed:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token, studentId, location, wifiBssid } = await req.json();

    if (!token || !studentId) {
      return NextResponse.json(
        { message: "Missing token or student ID" },
        { status: 400 },
      );
    }

    // --- Find the token and the student profile in parallel for efficiency ---
    const [tokenRecord, studentUser] = await Promise.all([
      prisma.attendanceToken.findUnique({
        where: { token },
        include: {
          subject: { select: { name: true, id: true } },
          classSession: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: studentId },
        include: { studentProfile: true, campus: true },
      }),
    ]);

    // --- MANDATORY CHECKS (for both ONLINE and OFFLINE) ---
    if (!tokenRecord) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 404 },
      );
    }
    if (!studentUser || !studentUser.studentProfile) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 },
      );
    }

    const now = new Date();
    if (new Date(tokenRecord.expiresAt).getTime() <= now.getTime()) {
      return NextResponse.json(
        { message: "Token has expired" },
        { status: 410 },
      );
    }
    if (tokenRecord.used) {
      return NextResponse.json(
        { message: "This QR code has already been used" },
        { status: 410 },
      );
    }

    // Critical Identity Check: This runs for ALL modes.
    if (tokenRecord.studentId !== studentUser.studentProfile.id) {
      return NextResponse.json(
        { message: "This QR code is not valid for you." },
        { status: 403 },
      );
    }

    if (!tokenRecord.classSessionId || !tokenRecord.classSession) {
      return NextResponse.json(
        { message: "This QR code is not linked to an active class session." },
        { status: 404 },
      );
    }

    const classSession = tokenRecord.classSession;

    // =================================================================
    // --- "SMART CHECK" SECURITY BLOCK with ONLINE/OFFLINE mode ---
    // =================================================================
    if (tokenRecord.mode === "OFFLINE") {
      if (!studentUser.campus) {
        return NextResponse.json(
          { message: "Campus details not found for offline verification." },
          { status: 404 },
        );
      }

      const campus = studentUser.campus;

      // Layer 1: Geofence Check
      if (!location?.latitude || !location?.longitude) {
        return NextResponse.json(
          { message: "Location data is required for offline attendance." },
          { status: 400 },
        );
      }

      const distance = haversineDistance(
        tokenRecord.latitude!,
        tokenRecord.longitude!,
        location.latitude,
        location.longitude,
      );
      if (distance > 50) {
        return NextResponse.json(
          {
            message: `Geofence check failed. You are ~${Math.round(distance)}m away.`,
          },
          { status: 403 },
        );
      }

      // Layer 2 & 3: Network Verification
      if (wifiBssid) {
        if (!campus.wifiBssids.includes(wifiBssid)) {
          return NextResponse.json(
            {
              message:
                "Wi-Fi check failed. Connect to an official campus network.",
            },
            { status: 403 },
          );
        }
      } else {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const ipCity = await getCityfromIp(ip);
        if (ipCity !== campus.city) {
          return NextResponse.json(
            {
              message: `IP check failed. Connection appears to be from ${ipCity}.`,
            },
            { status: 403 },
          );
        }
      }
    }
    // --- END OF SECURITY BLOCK ---

    const teacherProfile = await prisma.teacher.findUnique({
      where: { id: tokenRecord.professorId },
    });

    if (!teacherProfile) {
      return NextResponse.json(
        { message: "Could not identify the teacher for this session" },
        { status: 404 },
      );
    }

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId: studentUser.studentProfile.id,
        classSessionId: classSession.id,
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        {
          message: `Attendance already recorded for this session as ${existingAttendance.status}.`,
        },
        { status: 409 },
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: studentUser.studentProfile.id,
        userId: studentId,
        classSessionId: classSession.id,
        status: "PRESENT",
        markedBy: teacherProfile.id,
        markedAt: now,
        remarks: "Marked via QR code.",
      },
    });

    await runRiskEvaluationSafely({
      attendanceId: attendance.id,
      triggeredByUserId: studentId,
    });

    await prisma.attendanceToken.update({
      where: { token },
      data: { used: true },
    });

    await logActivity(
      studentId,
      studentUser.name,
      `Marked attendance for ${tokenRecord.subject?.name}`,
    );

    return NextResponse.json(
      {
        message: "Attendance marked successfully!",
        data: {
          subject: tokenRecord.subject?.name,
          status: attendance.status,
          markedAt: attendance.markedAt,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error marking attendance:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}
