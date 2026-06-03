import {
  ChannelType,
  CircleOfCareStatus,
  ConversationType,
  SupportCaseActivityType,
  Role,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

async function getLatestPublicKeyForUser(userId: string) {
  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      userId,
      publicKey: {
        not: "",
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
    select: {
      publicKey: true,
    },
  });

  return participant?.publicKey ?? "PENDING_PUBLIC_KEY";
}

async function getSupportCenterUser(campusId: string) {
  return prisma.user.findFirst({
    where: {
      campusId,
      role: Role.ASSISTANT,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function createCircleOfCareForSupportCase(input: {
  supportCaseId: string;
  actorId?: string | null;
}) {
  const { supportCaseId, actorId } = input;

  const supportCase = await prisma.supportCase.findUnique({
    where: {
      id: supportCaseId,
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
          semester: {
            select: {
              id: true,
              name: true,
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
      riskEvent: {
        select: {
          id: true,
          title: true,
          description: true,
          severity: true,
          currentValue: true,
          threshold: true,
        },
      },
      circleOfCareGroup: {
        select: {
          id: true,
          conversationId: true,
        },
      },
    },
  });

  if (!supportCase) {
    return {
      created: false,
      reason: "Support case not found.",
      circleOfCareGroupId: null,
      conversationId: null,
    };
  }

  if (supportCase.circleOfCareGroup) {
    return {
      created: false,
      reason: "Circle of Care group already exists for this support case.",
      circleOfCareGroupId: supportCase.circleOfCareGroup.id,
      conversationId: supportCase.circleOfCareGroup.conversationId,
    };
  }

  const supportCenterUser = await getSupportCenterUser(supportCase.campusId);

  const participantUserIds = new Set<string>();

  participantUserIds.add(supportCase.student.user.id);

  if (supportCase.assignedTeacher?.user?.id) {
    participantUserIds.add(supportCase.assignedTeacher.user.id);
  }

  if (supportCenterUser?.id) {
    participantUserIds.add(supportCenterUser.id);
  }

  if (actorId) {
    participantUserIds.add(actorId);
  }

  const participants = await Promise.all(
    Array.from(participantUserIds).map(async (userId) => ({
      userId,
      publicKey: await getLatestPublicKeyForUser(userId),
    })),
  );

  const subjectName = supportCase.subject?.code
    ? `${supportCase.subject.name} (${supportCase.subject.code})`
    : (supportCase.subject?.name ?? "Attendance Risk");

  const studentName = supportCase.student.user.name ?? "Student";

  const groupName = `Circle of Care - ${studentName} - ${subjectName}`;

  const result = await prisma.$transaction(async (tx) => {
    const conversation = await tx.conversation.create({
      data: {
        type: ConversationType.GROUP,
        name: groupName,
        campusId: supportCase.campusId,
        isSystemGenerated: true,
        systemType: ChannelType.CIRCLE_OF_CARE,
        subjectId: supportCase.subjectId,
        semesterId: supportCase.student.semesterId,
        sectionId: supportCase.student.sectionId,
        teacherId: supportCase.assignedTeacherId,
      },
      select: {
        id: true,
      },
    });

    await tx.conversationParticipant.createMany({
      data: participants.map((participant) => ({
        conversationId: conversation.id,
        userId: participant.userId,
        publicKey: participant.publicKey,
      })),
      skipDuplicates: true,
    });

    const circleOfCareGroup = await tx.circleOfCareGroup.create({
      data: {
        campusId: supportCase.campusId,
        studentId: supportCase.studentId,
        supportCaseId: supportCase.id,
        conversationId: conversation.id,
        reason:
          supportCase.riskEvent.description ??
          `Student crossed attendance risk threshold in ${subjectName}.`,
        status: CircleOfCareStatus.ACTIVE,
        createdById: actorId ?? null,
      },
      select: {
        id: true,
        conversationId: true,
      },
    });

    await tx.supportCaseActivityLog.create({
      data: {
        supportCaseId: supportCase.id,
        actorId: actorId ?? null,
        type: SupportCaseActivityType.CONVERSATION_CREATED,
        title: "Circle of Care conversation created",
        description: `Created group conversation: ${groupName}`,
        metadata: {
          conversationId: conversation.id,
          participantUserIds: Array.from(participantUserIds),
        },
      },
    });

    await tx.supportCaseActivityLog.create({
      data: {
        supportCaseId: supportCase.id,
        actorId: actorId ?? null,
        type: SupportCaseActivityType.CIRCLE_CREATED,
        title: "Circle of Care group created",
        description:
          "A Circle of Care group was automatically created for this support case.",
        metadata: {
          circleOfCareGroupId: circleOfCareGroup.id,
          conversationId: conversation.id,
          studentId: supportCase.studentId,
          subjectId: supportCase.subjectId,
        },
      },
    });

    return circleOfCareGroup;
  });

  return {
    created: true,
    reason: "Circle of Care group created.",
    circleOfCareGroupId: result.id,
    conversationId: result.conversationId,
  };
}
