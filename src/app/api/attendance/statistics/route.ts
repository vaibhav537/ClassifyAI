import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { AttendanceStatus } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const studentUserId = searchParams.get("studentId");
    const campusId = searchParams.get("campusId");

    if (!studentUserId || !campusId) {
      return NextResponse.json(
        { error: "Student ID and Campus ID are required" },
        { status: 400 },
      );
    }

    const studentProfile = await prisma.student.findFirst({
      where: {
        userId: studentUserId,
        user: {
          campusId,
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found on this campus" },
        { status: 404 },
      );
    }

    const baseWhere = {
      studentId: studentProfile.id,
      classSession: {
        is: {
          campusId,
        },
      },
    };

    const [presents, absents, late, pending] = await prisma.$transaction([
      prisma.attendance.count({
        where: {
          ...baseWhere,
          status: AttendanceStatus.PRESENT,
        },
      }),

      prisma.attendance.count({
        where: {
          ...baseWhere,
          status: AttendanceStatus.ABSENT,
        },
      }),

      prisma.attendance.count({
        where: {
          ...baseWhere,
          status: AttendanceStatus.LATE,
        },
      }),

      prisma.attendance.count({
        where: {
          ...baseWhere,
          status: AttendanceStatus.PENDING,
        },
      }),
    ]);

    const totalClasses = presents + absents + late;
    const presentAndLate = presents + late;

    const percentage =
      totalClasses > 0
        ? ((presentAndLate / totalClasses) * 100).toFixed(2)
        : "0.00";

    return NextResponse.json({
      totalClasses,
      presents,
      absents,
      late,
      pending,
      presentPercentage: percentage,
    });
  } catch (error) {
    console.error("Error fetching attendance statistics:", error);

    return NextResponse.json(
      { error: "Error fetching attendance statistics" },
      { status: 500 },
    );
  }
}