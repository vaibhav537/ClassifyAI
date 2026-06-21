import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getCurrentWeekday, logActivity } from "@/lib/helper";
import { sendAttendanceQrEmail } from "@/lib/mail";

const SESSION_COOLDOWN_MINUTES = 60;
const TOKEN_EXPIRY_MINUTES = 5;

function getStartOfDay(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export async function POST(request: NextRequest) {
  try {
    const { subjectId, teacherUserId, studentIds, sectionId, location, mode } =
      await request.json();

    if (
      !subjectId ||
      !teacherUserId ||
      !studentIds ||
      !Array.isArray(studentIds) ||
      studentIds.length === 0 ||
      !sectionId ||
      !mode
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const teacherRecord = await prisma.teacher.findUnique({
      where: { userId: teacherUserId },
      include: { user: { select: { name: true, campusId: true } } },
    });

    if (!teacherRecord || !teacherRecord.user || !teacherRecord.user.campusId) {
      return NextResponse.json(
        { message: "Teacher or associated campus not found" },
        { status: 404 },
      );
    }
    const campusId = teacherRecord.user.campusId;

    const [subjectRecord, students] = await Promise.all([
      prisma.subject.findFirst({
        where: { id: subjectId, campusId: campusId },
      }),
      prisma.student.findMany({
        where: {
          id: { in: studentIds },
          sectionId: sectionId,
          user: { campusId: campusId },
        },
        include: {
          user: { select: { email: true, semester: true } },
          section: { select: { name: true } },
          semester: { select: { id: true } },
        },
      }),
    ]);

    if (!subjectRecord) {
      return NextResponse.json(
        { message: "Subject not found on this campus" },
        { status: 404 },
      );
    }
    if (students.length !== studentIds.length) {
      return NextResponse.json(
        {
          message:
            "One or more students were not found on this campus/section.",
        },
        { status: 404 },
      );
    }

    const now = new Date();
    const today = getStartOfDay(now);
    const expiresAt = addMinutes(now, TOKEN_EXPIRY_MINUTES);
    const sessionEndTime = addMinutes(now, SESSION_COOLDOWN_MINUTES);
    const cooldownStart = new Date(
      now.getTime() - SESSION_COOLDOWN_MINUTES * 60 * 1000,
    );

    // Teacher-side cooldown:
    // same teacher + same subject + same section cannot create another attendance session within 60 minutes.
    const recentClassSession = await prisma.classSession.findFirst({
      where: {
        teacherId: teacherRecord.id,
        subjectId,
        sectionId,
        date: today,
        startTime: {
          gte: cooldownStart,
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (recentClassSession) {
      const nextAllowedAt = addMinutes(
        recentClassSession.startTime,
        SESSION_COOLDOWN_MINUTES,
      );

      const remainingMs = Math.max(0, nextAllowedAt.getTime() - now.getTime());
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

      return NextResponse.json(
        {
          message: `Attendance session already created for this subject. Try again after ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}.`,
          nextAllowedAt,
          classSessionId: recentClassSession.id,
        },
        { status: 409 },
      );
    }

    const firstStudent = students[0];

    const classSession = await prisma.classSession.create({
      data: {
        date: today,
        teacherId: teacherRecord.id,
        subjectId,
        subject: subjectRecord.name,
        campusId,
        sectionId,
        semesterId: firstStudent.semesterId,
        semester: firstStudent.user.semester ?? 0,
        section: firstStudent.section?.name || "N/A",
        weekday: getCurrentWeekday(now),
        startTime: now,
        endTime: sessionEndTime,
        status: "LIVE",
        attendanceWindowEndsAt: expiresAt,
        attendanceMarked: false,
      },
    });

    const emailPromises = students.map(async (student) => {
      if (!student.user.email) return;

      const token = uuidv4();
      const payload = JSON.stringify({ token });
      const qrCodeDataUrl = await QRCode.toDataURL(payload);

      await prisma.attendanceToken.create({
        data: {
          token,
          expiresAt,
          subjectId,
          professorId: teacherRecord.id,
          studentId: student.id,
          classSessionId: classSession.id,
          mode: mode === "ONLINE" ? "ONLINE" : "OFFLINE",
          latitude: mode === "OFFLINE" ? location?.latitude : null,
          longitude: mode === "OFFLINE" ? location?.longitude : null,
        },
      });

      await sendAttendanceQrEmail(
        student.user.email,
        subjectRecord.name,
        teacherRecord.user.name,
        qrCodeDataUrl,
      );
    });

    await Promise.all(emailPromises);

    await logActivity(
      teacherUserId,
      teacherRecord.user.name,
      `Created attendance session for ${subjectRecord.name} and sent tokens to ${studentIds.length} students.`,
    );

    return NextResponse.json(
      {
        message: `QR codes sent successfully to ${studentIds.length} students.`,
        classSessionId: classSession.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error generating unique attendance tokens:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
