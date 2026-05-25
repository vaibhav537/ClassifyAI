import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

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

    const attendances = await prisma.attendance.findMany({
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
    });

    if (attendances.length === 0) {
      return NextResponse.json([]);
    }

    const subjectMap: Record<
      string,
      {
        present: number;
        total: number;
        subjectCode?: string | null;
      }
    > = {};

    for (const att of attendances) {
      const subject =
        att.classSession?.subjectRel?.name ||
        att.classSession?.subject ||
        "Unknown Subject";

      const subjectCode = att.classSession?.subjectRel?.code || null;

      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          present: 0,
          total: 0,
          subjectCode,
        };
      }

      subjectMap[subject].total++;

      if (att.status === "PRESENT" || att.status === "LATE") {
        subjectMap[subject].present++;
      }
    }

    const result = Object.entries(subjectMap).map(([subject, stats]) => {
      const percentage = Number(
        ((stats.present / stats.total) * 100).toFixed(1),
      );

      return {
        subject,
        subjectCode: stats.subjectCode || null,
        present: stats.present,
        total: stats.total,
        percentage,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching attendance percentage by subject:", error);

    return NextResponse.json(
      { error: "Failed to fetch attendance percentage by subject" },
      { status: 500 },
    );
  }
}