import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SupportCaseStatus } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const campusId = searchParams.get("campusId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const studentId = searchParams.get("studentId");
    const subjectId = searchParams.get("subjectId");

    if (!campusId) {
      return NextResponse.json(
        {
          success: false,
          message: "Campus ID is required.",
        },
        { status: 400 },
      );
    }

    const supportCases = await prisma.supportCase.findMany({
      where: {
        campusId,
        ...(status ? { status: status as SupportCaseStatus } : {}),
        ...(priority ? { priority: priority as any } : {}),
        ...(studentId ? { studentId } : {}),
        ...(subjectId ? { subjectId } : {}),
      },
      orderBy: [
        {
          priority: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
            semester: {
              select: {
                id: true,
                name: true,
                number: true,
              },
            },
            section: {
              select: {
                id: true,
                name: true,
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
        assignedTeacher: {
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
        assignedAssistant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        riskEvent: {
          select: {
            id: true,
            type: true,
            severity: true,
            title: true,
            description: true,
            currentValue: true,
            threshold: true,
            status: true,
            detectedAt: true,
          },
        },
        circleOfCareGroup: {
          select: {
            id: true,
            status: true,
            conversationId: true,
            reason: true,
            createdAt: true,
          },
        },
        notes: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            note: true,
            isInternal: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
        activityLogs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            createdAt: true,
            actor: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    const stats = await prisma.supportCase.groupBy({
      by: ["status"],
      where: {
        campusId,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        cases: supportCases,
        stats: stats.map((item) => ({
          status: item.status,
          count: item._count.id,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching support cases:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch support cases.",
      },
      { status: 500 },
    );
  }
}
