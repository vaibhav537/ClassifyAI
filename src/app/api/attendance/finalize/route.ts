import { prisma } from "@/lib/prisma";
import { evaluateAttendanceRiskAfterMarking } from "@/lib/risk";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const { classSessionId } = await request.json();

    if (!classSessionId) {
      return NextResponse.json(
        { message: "Class session ID is required" },
        { status: 400 },
      );
    }

    const classSession = await prisma.classSession.findUnique({
      where: {
        id: classSessionId,
      },
    });
    if (!classSession) {
      return NextResponse.json(
        { message: "Invalid token. Token record not found." },
        { status: 404 },
      );
    }

    if (!classSession.sectionId) {
      return NextResponse.json(
        { message: "Section ID missing in class session." },
        { status: 404 },
      );
    }

    const allStudentIdsInSection = (
      await prisma.student.findMany({
        where: {
          sectionId: classSession.sectionId,
        },
        select: {
          id: true,
        },
      })
    ).map((student) => student.id);

    const alreadyMarkedStudentIds = (
      await prisma.attendance.findMany({
        where: {
          classSessionId: classSession.id,
          studentId: {
            not: null,
          },
        },
        select: {
          studentId: true,
        },
      })
    )
      .map((attendance) => attendance.studentId)
      .filter((id): id is string => Boolean(id));

    const markedSet = new Set(alreadyMarkedStudentIds);

    const absentStudentIds = allStudentIdsInSection.filter(
      (studentId) => !markedSet.has(studentId),
    );
    if (absentStudentIds.length === 0) {
      await prisma.classSession.update({
        where: { id: classSession.id },
        data: {
          status: "COMPLETED",
          attendanceMarked: true,
        },
      });

      return NextResponse.json({
        message: "All students already have attendance records.",
      });
    }

    await prisma.attendance.createMany({
      data: absentStudentIds.map((studentId) => ({
        studentId,
        classSessionId: classSession.id,
        status: "ABSENT" as const,
        markedBy: "SYSTEM",
        markedAt: new Date(),
        remarks: "Automatically marked absent after session expired.",
      })),
      skipDuplicates: true,
    });

    const absentAttendanceRecords = await prisma.attendance.findMany({
      where: {
        classSessionId: classSession.id,
        studentId: {
          in: absentStudentIds,
        },
      },
      select: {
        id: true,
      },
    });
    
    for (const attendance of absentAttendanceRecords) {
      await runRiskEvaluationSafely({
        attendanceId: attendance.id,
      });
    }

    await prisma.classSession.update({
      where: { id: classSession.id },
      data: {
        status: "COMPLETED",
        attendanceMarked: true,
      },
    });

    return NextResponse.json({
      message: `Successfully marked ${absentStudentIds.length} students as absent.`,
    });
  } catch (error) {
    console.error("Error finalizing attendance:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
