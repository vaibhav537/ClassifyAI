import {
  AttendanceStatus,
  RiskEventStatus,
  RiskRuleType,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { checkConsecutiveAbsenceRisk } from "./consecutive-absence";
import { refreshStudentRiskProfile } from "./risk-profile";

type EvaluateAttendanceRiskAfterMarkingInput = {
  attendanceId: string;
  triggeredByUserId?: string | null;
};

type EvaluateAttendanceRiskResult = {
  skipped: boolean;
  reason?: string;
  riskEventCreated: boolean;
  riskEventId?: string;
};

export async function evaluateAttendanceRiskAfterMarking(
  input: EvaluateAttendanceRiskAfterMarkingInput
): Promise<EvaluateAttendanceRiskResult> {
  const { attendanceId, triggeredByUserId } = input;

  const attendance = await prisma.attendance.findUnique({
    where: {
      id: attendanceId,
    },
    select: {
      id: true,
      status: true,
      studentId: true,
      classSessionId: true,
      classSession: {
        select: {
          id: true,
          campusId: true,
          subjectId: true,
          teacherId: true,
          date: true,
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

  if (!attendance) {
    return {
      skipped: true,
      reason: "Attendance record not found.",
      riskEventCreated: false,
    };
  }

  if (!attendance.studentId) {
    return {
      skipped: true,
      reason: "Attendance record is not linked to a student.",
      riskEventCreated: false,
    };
  }

  if (!attendance.classSessionId || !attendance.classSession) {
    return {
      skipped: true,
      reason: "Attendance record is not linked to a class session.",
      riskEventCreated: false,
    };
  }

  if (!attendance.classSession.campusId) {
    return {
      skipped: true,
      reason: "Class session is not linked to a campus.",
      riskEventCreated: false,
    };
  }

  if (!attendance.classSession.subjectId) {
    return {
      skipped: true,
      reason: "Class session is not linked to a subject.",
      riskEventCreated: false,
    };
  }

  /**
   * For now, PoC only evaluates absence-based risk.
   * PRESENT / LATE / PENDING can still refresh profile later,
   * but they should not create a new consecutive absence risk event.
   */
  if (attendance.status !== AttendanceStatus.ABSENT) {
    await refreshStudentRiskProfile({
      campusId: attendance.classSession.campusId,
      studentId: attendance.studentId,
    });

    return {
      skipped: true,
      reason: "Attendance status is not ABSENT, no absence risk created.",
      riskEventCreated: false,
    };
  }

  const activeRules = await prisma.riskRule.findMany({
    where: {
      campusId: attendance.classSession.campusId,
      type: RiskRuleType.CONSECUTIVE_ABSENCE,
      isActive: true,
      scopes: {
        some: {
          OR: [
            {
              campusId: attendance.classSession.campusId,
            },
            {
              subjectId: attendance.classSession.subjectId,
            },
            {
              studentId: attendance.studentId,
            },
          ],
        },
      },
    },
    orderBy: {
      threshold: "asc",
    },
  });

  if (activeRules.length === 0) {
    await refreshStudentRiskProfile({
      campusId: attendance.classSession.campusId,
      studentId: attendance.studentId,
    });

    return {
      skipped: true,
      reason: "No active consecutive absence risk rule found.",
      riskEventCreated: false,
    };
  }

  for (const rule of activeRules) {
    const result = await checkConsecutiveAbsenceRisk({
      campusId: attendance.classSession.campusId,
      studentId: attendance.studentId,
      subjectId: attendance.classSession.subjectId,
      classSessionId: attendance.classSessionId,
      rule,
    });

    if (!result.isRiskDetected) {
      continue;
    }

    /**
     * Duplicate guard:
     * If same student + same rule + same subject already has active event,
     * do not create another one.
     */
    const existingActiveRiskEvent = await prisma.riskEvent.findFirst({
      where: {
        campusId: attendance.classSession.campusId,
        studentId: attendance.studentId,
        ruleId: rule.id,
        subjectId: attendance.classSession.subjectId,
        status: RiskEventStatus.ACTIVE,
      },
      select: {
        id: true,
      },
    });

    if (existingActiveRiskEvent) {
      await refreshStudentRiskProfile({
        campusId: attendance.classSession.campusId,
        studentId: attendance.studentId,
      });

      return {
        skipped: true,
        reason: "Active risk event already exists for this rule and subject.",
        riskEventCreated: false,
        riskEventId: existingActiveRiskEvent.id,
      };
    }

    const subjectName =
      attendance.classSession.subjectRel?.name ?? "selected subject";

    const riskEvent = await prisma.riskEvent.create({
      data: {
        campusId: attendance.classSession.campusId,
        studentId: attendance.studentId,
        ruleId: rule.id,
        subjectId: attendance.classSession.subjectId,
        classSessionId: attendance.classSessionId,
        type: rule.type,
        severity: rule.severity,
        title: result.title,
        description:
          result.description ||
          `Student crossed attendance risk threshold in ${subjectName}.`,
        currentValue: result.consecutiveAbsences,
        threshold: result.threshold,
        status: RiskEventStatus.ACTIVE,
        acknowledgedById: triggeredByUserId ?? null,
      },
    });

    await refreshStudentRiskProfile({
      campusId: attendance.classSession.campusId,
      studentId: attendance.studentId,
    });

    return {
      skipped: false,
      riskEventCreated: true,
      riskEventId: riskEvent.id,
    };
  }

  await refreshStudentRiskProfile({
    campusId: attendance.classSession.campusId,
    studentId: attendance.studentId,
  });

  return {
    skipped: true,
    reason: "No risk threshold matched.",
    riskEventCreated: false,
  };
}