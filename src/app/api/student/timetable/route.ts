import { getCurrentSessionUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const WEEKDAY_ORDER = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
} as const;

function getTodayWeekday() {
  const day = new Date().getDay();

  const map = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ] as const;

  return map[day];
}

export async function GET() {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can access this timetable" },
        { status: 403 },
      );
    }

    if (!user.campusId) {
      return NextResponse.json(
        { error: "Student is not linked with any campus" },
        { status: 400 },
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        semesterId: true,
        sectionId: true,
        semester: {
          select: {
            id: true,
            name: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 },
      );
    }

    if (!student.semesterId || !student.sectionId) {
      return NextResponse.json({
        success: true,
        todayWeekday: getTodayWeekday(),
        student,
        todayEntries: [],
        weeklyEntries: [],
        message: "Student semester or section is not assigned yet.",
      });
    }

    const entries = await prisma.timetableEntry.findMany({
      where: {
        campusId: user.campusId,
        semesterId: student.semesterId,
        sectionId: student.sectionId,
        isActive: true,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        semester: {
          select: {
            id: true,
            name: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const sortedEntries = entries.sort((a, b) => {
      const weekdayDiff =
        WEEKDAY_ORDER[a.weekday as keyof typeof WEEKDAY_ORDER] -
        WEEKDAY_ORDER[b.weekday as keyof typeof WEEKDAY_ORDER];

      if (weekdayDiff !== 0) return weekdayDiff;

      return a.startTime.getTime() - b.startTime.getTime();
    });

    const todayWeekday = getTodayWeekday();

    const todayEntries = sortedEntries.filter(
      (entry) => entry.weekday === todayWeekday,
    );

    return NextResponse.json({
      success: true,
      todayWeekday,
      student,
      todayEntries,
      weeklyEntries: sortedEntries,
    });
  } catch (error) {
    console.error("[STUDENT_TIMETABLE_GET]", error);

    return NextResponse.json(
      { error: "Failed to fetch student timetable" },
      { status: 500 },
    );
  }
}
