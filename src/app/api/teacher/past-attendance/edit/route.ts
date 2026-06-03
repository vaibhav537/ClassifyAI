import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { evaluateAttendanceRiskAfterMarking } from "@/lib/risk";

const editAttendanceSchema = z.object({
  attendanceId: z.string().cuid(),
  teacherId: z.string().cuid(), // teacher userId
  newStatus: z.enum(["PRESENT", "ABSENT", "LATE", "PENDING"]),
});

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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = editAttendanceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { attendanceId, teacherId, newStatus } = validation.data;

    const teacherProfile = await prisma.teacher.findUnique({
      where: { userId: teacherId },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!teacherProfile) {
      return NextResponse.json(
        { error: "Teacher profile not found." },
        { status: 404 },
      );
    }

    const attendanceRecord = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      select: {
        id: true,
        status: true,
        student: {
          select: {
            rollNumber: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        classSession: {
          select: {
            teacherId: true,
            subject: true,
            subjectRel: {
              select: {
                name: true,
                code: true,
              },
            },
            semesterRel: {
              select: {
                name: true,
              },
            },
            sectionRel: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (
      !attendanceRecord ||
      attendanceRecord.classSession?.teacherId !== teacherProfile.id
    ) {
      return NextResponse.json(
        { error: "You are not authorized to edit this record." },
        { status: 403 },
      );
    }

    const oldStatus = attendanceRecord.status;

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: { status: newStatus },
    });

    await runRiskEvaluationSafely({
      attendanceId: updatedAttendance.id,
      triggeredByUserId: teacherId,
    });

    try {
      const studentName =
        attendanceRecord.student?.user?.name || "Unknown Student";

      const rollNumber = attendanceRecord.student?.rollNumber
        ? `, Roll No: ${attendanceRecord.student.rollNumber}`
        : "";

      const subjectName = attendanceRecord.classSession?.subjectRel?.code
        ? `${attendanceRecord.classSession.subjectRel.name} (${attendanceRecord.classSession.subjectRel.code})`
        : attendanceRecord.classSession?.subjectRel?.name ||
          attendanceRecord.classSession?.subject ||
          "Unknown Subject";

      const semesterName =
        attendanceRecord.classSession?.semesterRel?.name || "Unknown Semester";

      const sectionName =
        attendanceRecord.classSession?.sectionRel?.name || "Unknown Section";

      await logActivity(
        teacherProfile.user.id,
        teacherProfile.user.name,
        `${teacherProfile.user.name} updated attendance of ${studentName}${rollNumber} from ${oldStatus} to ${newStatus} for ${subjectName}, ${semesterName}, Section ${sectionName}.`,
      );
    } catch (activityError) {
      console.error("Failed to log attendance update activity:", activityError);
    }

    return NextResponse.json({
      success: true,
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);

    return NextResponse.json(
      { error: "Failed to update attendance." },
      { status: 500 },
    );
  }
}
