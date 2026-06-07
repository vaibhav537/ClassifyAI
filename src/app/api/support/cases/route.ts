import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  SupportCaseStatus,
  RiskEventStatus,
  SupportCaseActivityType,
} from "@/generated/prisma";
import { logActivity } from "@/lib/helper";
import z from "zod";
import { refreshStudentRiskProfile } from "@/lib/risk";

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

const editStatusSchema = z.object({
  caseId: z.string().cuid(),
  status: z.nativeEnum(SupportCaseStatus),
  actorId: z.string().cuid().optional().nullable(),
  note: z.string().trim().optional().nullable(),
  isInternalNote: z.boolean().default(true),
});

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = editStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors, success: false },
        { status: 400 },
      );
    }
    const { caseId, status, actorId, isInternalNote, note } = validation.data;
    let actorName = "SYSTEM";
    if (actorId) {
      const user = await prisma.user.findUnique({
        where: {
          id: actorId,
        },
        select: {
          username: true,
          name: true,
        },
      });
      actorName = user?.name || user?.username || "SYSTEM";
    }
    const supportCase = await prisma.supportCase.findUnique({
      where: {
        id: caseId,
      },
      select: {
        id: true,
        status: true,
        riskEventId: true,
        studentId: true,
        campusId: true,
        title: true,
        resolvedAt: true,
        resolvedById: true,
      },
    });

    if (!supportCase) {
      return NextResponse.json(
        { error: "Support case not found.", success: false },
        { status: 404 },
      );
    }

    if (status === supportCase.status) {
      return NextResponse.json(
        { message: "Support case already has this status", success: true },
        { status: 200 },
      );
    }

    const activeStatuses: SupportCaseStatus[] = [
      SupportCaseStatus.OPEN,
      SupportCaseStatus.IN_REVIEW,
      SupportCaseStatus.ESCALATED,
      SupportCaseStatus.WAITING_FOR_RESPONSE,
      SupportCaseStatus.CONTACTED_STUDENT,
    ];

    const isExistingFinal =
      supportCase.status === SupportCaseStatus.RESOLVED ||
      supportCase.status === SupportCaseStatus.CLOSED;
    const isTryingToReopen = isExistingFinal && activeStatuses.includes(status);
    if (isTryingToReopen) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Resolved or closed support cases cannot be reopened in current workflow.",
        },
        { status: 409 },
      );
    }

    const timeNow: Date = new Date();

    let updateData: {
      status: SupportCaseStatus;
      lastFollowUpAt: Date;
      closedAt: Date | null;
      resolvedById: string | null;
      resolvedAt: Date | null;
    } = {
      status,
      lastFollowUpAt: timeNow,
      closedAt: null,
      resolvedById: null,
      resolvedAt: null,
    };

    let action = `Support case ${supportCase.title} status changed from ${supportCase.status} to ${status} by ${actorName}.`;
    await prisma.$transaction(async (tx) => {
      await tx.supportCaseActivityLog.create({
        data: {
          supportCaseId: supportCase.id,
          actorId: actorId ?? null,
          type: SupportCaseActivityType.CASE_STATUS_CHANGED,
          title: "Support case status updated",
          description: `Status changed from ${supportCase.status} to ${status} by ${actorName}`,
          metadata: {
            oldStatus: supportCase.status,
            newStatus: status,
            actorName,
          },
        },
      });
      if (status === SupportCaseStatus.RESOLVED) {
        updateData = {
          ...updateData,
          resolvedById: actorId ?? null,
          resolvedAt: timeNow,
        };

        action = `Support case ${supportCase.title} resolved by ${actorName}.`;
        
        await tx.supportCaseActivityLog.create({
          data: {
            supportCaseId: supportCase.id,
            actorId: actorId ?? null,
            type: "CASE_RESOLVED",
            title: "Support case resolved.",
            description: `Support case was resolved by ${actorName}.`,
            metadata: {
              resolvedAt: timeNow.toISOString(),
              riskEventId: supportCase.riskEventId,
            },
          },
        });
        await tx.riskEvent.update({
          where: {
            id: supportCase.riskEventId,
          },
          data: {
            status: RiskEventStatus.RESOLVED,
            resolvedAt: timeNow,
            resolvedById: actorId ?? null,
          },
        });
      }
      if (updateData.status === SupportCaseStatus.CLOSED) {
        updateData = {
          ...updateData,
          closedAt: timeNow,
          resolvedById: supportCase.resolvedById ?? null,
          resolvedAt: supportCase.resolvedAt,
        };
        action = `Support case ${supportCase.title} closed by ${actorName}.`;

        await tx.supportCaseActivityLog.create({
          data: {
            supportCaseId: supportCase.id,
            actorId: actorId ?? null,
            type: "CASE_CLOSED",
            title: "Support case closed.",
            description: `Support case was closed by ${actorName}.`,
            metadata: {
              closedAt: timeNow.toISOString(),
            },
          },
        });
      }

      await tx.supportCase.update({
        where: {
          id: caseId,
        },
        data: updateData,
      });

      if (note) {
        await tx.supportCaseNote.create({
          data: {
            note,
            supportCaseId: supportCase.id,
            authorId: actorId ?? null,
            createdAt: timeNow,
            isInternal: isInternalNote ?? true,
          },
        });
        await tx.supportCaseActivityLog.create({
          data: {
            supportCaseId: supportCase.id,
            actorId: actorId ?? null,
            type: "NOTE_ADDED",
            title: "Support note added",
            description: `${actorName} added a support note.`,
            metadata: {
              isInternal: isInternalNote ?? true,
              hasNote: true,
            },
          },
        });
      }
    });

    const campusId = supportCase.campusId;
    const studentId = supportCase.studentId;
    await refreshStudentRiskProfile({ campusId, studentId });

    if (actorId) {
      await logActivity(actorId, actorName, action);
    }
    return NextResponse.json(
      { success: true, message: "Successfully updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
