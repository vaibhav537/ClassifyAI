import {
  RiskEventStatus,
  SupportCaseActivityType,
  SupportCasePriority,
  SupportCaseStatus,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

function mapRiskSeverityToCasePriority(severity: string): SupportCasePriority {
  switch (severity) {
    case "CRITICAL":
      return SupportCasePriority.URGENT;
    case "HIGH":
      return SupportCasePriority.HIGH;
    case "MEDIUM":
      return SupportCasePriority.MEDIUM;
    case "LOW":
    default:
      return SupportCasePriority.LOW;
  }
}

export async function createSupportCaseForRiskEvent(input: {
  riskEventId: string;
  actorId?: string | null;
}) {
  const { riskEventId, actorId } = input;

  const riskEvent = await prisma.riskEvent.findUnique({
    where: {
      id: riskEventId,
    },
    include: {
      student: {
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
      classSession: {
        select: {
          id: true,
          teacherId: true,
          teacher: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!riskEvent) {
    return {
      created: false,
      reason: "Risk event not found.",
      supportCaseId: null,
    };
  }

  if (riskEvent.status !== RiskEventStatus.ACTIVE) {
    return {
      created: false,
      reason: "Risk event is not active.",
      supportCaseId: null,
    };
  }

  const existingSupportCase = await prisma.supportCase.findUnique({
    where: {
      riskEventId: riskEvent.id,
    },
    select: {
      id: true,
    },
  });

  if (existingSupportCase) {
    return {
      created: false,
      reason: "Support case already exists for this risk event.",
      supportCaseId: existingSupportCase.id,
    };
  }

  const subjectName = riskEvent.subject?.code
    ? `${riskEvent.subject.name} (${riskEvent.subject.code})`
    : riskEvent.subject?.name ?? "Unknown Subject";

  const studentName = riskEvent.student.user.name ?? "Student";

  const supportCase = await prisma.supportCase.create({
    data: {
      campusId: riskEvent.campusId,
      studentId: riskEvent.studentId,
      riskEventId: riskEvent.id,
      subjectId: riskEvent.subjectId,
      assignedTeacherId: riskEvent.classSession?.teacherId ?? null,
      title: `Attendance risk support case - ${studentName}`,
      description:
        riskEvent.description ??
        `Support case opened because ${studentName} crossed an attendance risk threshold in ${subjectName}.`,
      status: SupportCaseStatus.OPEN,
      priority: mapRiskSeverityToCasePriority(riskEvent.severity),
      createdById: actorId ?? null,
    },
  });

  await prisma.supportCaseActivityLog.create({
    data: {
      supportCaseId: supportCase.id,
      actorId: actorId ?? null,
      type: SupportCaseActivityType.CASE_CREATED,
      title: "Support case created",
      description: `A support case was automatically created from risk event: ${riskEvent.title}`,
      metadata: {
        riskEventId: riskEvent.id,
        studentId: riskEvent.studentId,
        subjectId: riskEvent.subjectId,
        severity: riskEvent.severity,
      },
    },
  });

  await prisma.supportCaseActivityLog.create({
    data: {
      supportCaseId: supportCase.id,
      actorId: actorId ?? null,
      type: SupportCaseActivityType.RISK_EVENT_LINKED,
      title: "Risk event linked",
      description: `Linked risk event ${riskEvent.title} to this support case.`,
      metadata: {
        riskEventId: riskEvent.id,
        riskType: riskEvent.type,
        currentValue: riskEvent.currentValue,
        threshold: riskEvent.threshold,
      },
    },
  });

  return {
    created: true,
    reason: "Support case created.",
    supportCaseId: supportCase.id,
  };
}