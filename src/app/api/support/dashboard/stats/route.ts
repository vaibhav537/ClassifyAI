import { SupportCasePriority, SupportCaseStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campusId = searchParams.get("campusId");
    const supportCaseWhereClause = [
      SupportCaseStatus.OPEN,
      SupportCaseStatus.IN_REVIEW,
      SupportCaseStatus.CONTACTED_STUDENT,
      SupportCaseStatus.WAITING_FOR_RESPONSE,
      SupportCaseStatus.ESCALATED,
    ];

    if (!campusId) {
      return NextResponse.json(
        {
          success: false,
          error: "Campus Id not found.",
        },
        { status: 400 },
      );
    }

    const timeNow = new Date();
    const startOfWeek = new Date(timeNow);
    const day = timeNow.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(timeNow.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      openCases,
      highPriorityCases,
      escalatedCases,
      resolvedThisWeek,
      atRiskStudents,
      recentRiskEvents,
      recentSupportActivity,
    ] = await Promise.all([
      prisma.supportCase.count({
        where: {
          status: {
            in: supportCaseWhereClause,
          },
          campusId: campusId,
        },
      }),
      prisma.supportCase.count({
        where: {
          status: {
            in: supportCaseWhereClause,
          },
          campusId: campusId,
          OR: [
            { priority: SupportCasePriority.HIGH },
            { priority: SupportCasePriority.URGENT },
          ],
        },
      }),
      prisma.supportCase.count({
        where: {
          status: SupportCaseStatus.ESCALATED,
          campusId: campusId,
        },
      }),
      prisma.supportCase.count({
        where: {
          status: SupportCaseStatus.RESOLVED,
          resolvedAt: {
            gte: startOfWeek,
          },
          campusId: campusId,
        },
      }),
      prisma.studentRiskProfile.count({
        where: {
          campusId,
          isAtRisk: true,
        },
      }),
      prisma.riskEvent.findMany({
        where: {
          campusId,
        },
        include: {
          student: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
              rollNumber: true,
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: {
          detectedAt: "desc",
        },
        take: 10,
      }),
      prisma.supportCaseActivityLog.findMany({
        where: {
          supportCase: {
            campusId: campusId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },

        include: {
          actor: {
            select:{
              id: true,
              name: true,
              username: true,
              role: true
            }
          },
          supportCase: {
            select: {
              title: true,
            },
          },
        },
        take: 10,
      }),
    ]);

    const result = {
      success: true,
      data: {
        summary: {
          openCases,
          highPriorityCases,
          escalatedCases,
          resolvedThisWeek,
          atRiskStudents,
        },
        recentRiskEvents,
        recentSupportActivity,
      },
    };
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
