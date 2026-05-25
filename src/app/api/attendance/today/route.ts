import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
        user: {
          select: {
            id: true,
            name: true,
            campusId: true,
          },
        },
      },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found on this campus" },
        { status: 404 },
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendances = await prisma.attendance.findMany({
      where: {
        studentId: studentProfile.id,
        markedAt: {
          gte: today,
          lt: tomorrow,
        },
        classSession: {
          is: {
            campusId,
          },
        },
      },
      include: {
        classSession: {
          select: {
            id: true,
            date: true,
            subject: true,
            subjectRel: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            teacher: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        markedAt: "desc",
      },
    });

    const formattedAttendances = attendances.map((att) => ({
      id: att.id,
      subject:
        att.classSession?.subjectRel?.name ||
        att.classSession?.subject ||
        "Unknown Subject",
      subjectCode: att.classSession?.subjectRel?.code || null,
      status: att.status,
      markedAt: att.markedAt,
      date: att.markedAt,
      markedBy: att.classSession?.teacher?.user?.name || "Unknown Teacher",
      classSessionId: att.classSession?.id || null,
      classDate: att.classSession?.date || null,
    }));

    return NextResponse.json(formattedAttendances);
  } catch (error) {
    console.error("Error fetching today's attendance:", error);

    return NextResponse.json(
      { error: "Failed to fetch today's attendance" },
      { status: 500 },
    );
  }
}