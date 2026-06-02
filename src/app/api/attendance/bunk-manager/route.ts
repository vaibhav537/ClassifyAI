import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MIN_PERCENTAGE = 75;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const studentUserId = searchParams.get("studentId");
    const campusId = searchParams.get("campusId");

    if (!studentUserId || !campusId) {
      return NextResponse.json(
        { success: false, error: "Student ID and Campus ID are required" },
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
        { success: false, error: "Student profile not found on this campus" },
        { status: 404 },
      );
    }

    const allAttendance = await prisma.attendance.findMany({
      where: {
        studentId: studentProfile.id,
        classSession: {
          is: {
            campusId,
          },
        },
      },
      include: {
        classSession: {
          select: {
            subject: true,
            subjectRel: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: {
        markedAt: "desc",
      },
    });

    const subjectStats = allAttendance.reduce(
      (acc, record) => {
        const subject =
          record.classSession?.subjectRel?.name ||
          record.classSession?.subject ||
          "Unknown Subject";

        const subjectCode = record.classSession?.subjectRel?.code || null;

        if (!acc[subject]) {
          acc[subject] = {
            total: 0,
            present: 0,
            absent: 0,
            late: 0,
            pending: 0,
            subjectCode,
          };
        }

        if (record.status === "PENDING") {
          acc[subject].pending += 1;
          return acc;
        }

        acc[subject].total += 1;

        if (record.status === "PRESENT") {
          acc[subject].present += 1;
        }

        if (record.status === "LATE") {
          acc[subject].present += 1;
          acc[subject].late += 1;
        }

        if (record.status === "ABSENT") {
          acc[subject].absent += 1;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          total: number;
          present: number;
          absent: number;
          late: number;
          pending: number;
          subjectCode: string | null;
        }
      >,
    );

    const result = Object.entries(subjectStats).map(([subject, stats]) => {
      const percentage =
        stats.total > 0 ? (stats.present / stats.total) * 100 : 0;

      const safeBunks = Math.floor(
        (stats.present * 100) / MIN_PERCENTAGE - stats.total,
      );

      const classesNeededToReach75 =
        percentage >= MIN_PERCENTAGE
          ? 0
          : Math.ceil(
              (MIN_PERCENTAGE * stats.total - 100 * stats.present) /
                (100 - MIN_PERCENTAGE),
            );

      return {
        subject,
        subjectCode: stats.subjectCode,
        total: stats.total,
        present: stats.present,
        absent: stats.absent,
        late: stats.late,
        pending: stats.pending,
        percentage: Number(percentage.toFixed(2)),
        safeBunks: Math.max(safeBunks, 0),
        classesNeededToReach75: Math.max(classesNeededToReach75, 0),
        risk:
          percentage >= 85
            ? "SAFE"
            : percentage >= MIN_PERCENTAGE
              ? "WARNING"
              : "RISK",
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching bunk manager data:", error);

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}