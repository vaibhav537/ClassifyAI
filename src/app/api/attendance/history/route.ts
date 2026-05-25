import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const studentUserId = searchParams.get("studentId");
    const campusId = searchParams.get("campusId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

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
        { success: false, error: "Student profile not found on this campus" },
        { status: 404 },
      );
    }

    const whereClause = {
      studentId: studentProfile.id,
      classSession: {
        is: {
          campusId,
        },
      },
    };

    const [history, totalRecords] = await prisma.$transaction([
      prisma.attendance.findMany({
        where: whereClause,
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
        skip,
        take: limit,
      }),

      prisma.attendance.count({
        where: whereClause,
      }),
    ]);

    const formattedHistory = history.map((item) => ({
      id: item.id,
      status: item.status,
      markedAt: item.markedAt,
      subject:
        item.classSession?.subjectRel?.name ||
        item.classSession?.subject ||
        "Unknown Subject",
      subjectCode: item.classSession?.subjectRel?.code || null,
      markedBy: item.classSession?.teacher?.user?.name || "Unknown Teacher",
      classSessionId: item.classSession?.id || null,
      classDate: item.classSession?.date || null,
    }));

    return NextResponse.json({
      success: true,
      history: formattedHistory,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance history:", error);

    return NextResponse.json(
      { success: false, error: "Error fetching attendance history" },
      { status: 500 },
    );
  }
}