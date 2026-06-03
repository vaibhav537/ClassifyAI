import { AttendanceStatus, RiskRuleType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import type {
  ConsecutiveAbsenceCheckInput,
  ConsecutiveAbsenceCheckResult,
} from "./types";

export async function checkConsecutiveAbsenceRisk(
  input: ConsecutiveAbsenceCheckInput
): Promise<ConsecutiveAbsenceCheckResult> {
  const { studentId, subjectId, rule } = input;

  if (rule.type !== RiskRuleType.CONSECUTIVE_ABSENCE) {
    return {
      isRiskDetected: false,
      consecutiveAbsences: 0,
      threshold: rule.threshold,
      severity: rule.severity,
      type: rule.type,
      title: rule.name,
      description: "Rule type is not consecutive absence.",
    };
  }

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      studentId,
      classSession: {
        subjectId,
      },
    },
    orderBy: {
      classSession: {
        date: "desc",
      },
    },
    take: rule.threshold,
    select: {
      id: true,
      status: true,
      markedAt: true,
      classSession: {
        select: {
          id: true,
          date: true,
          subjectId: true,
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

  let consecutiveAbsences = 0;

  for (const record of attendanceRecords) {
    if (record.status === AttendanceStatus.ABSENT) {
      consecutiveAbsences++;
    } else {
      break;
    }
  }

  const subjectName =
    attendanceRecords[0]?.classSession?.subjectRel?.name ?? "this subject";

  const isRiskDetected = consecutiveAbsences >= rule.threshold;

  return {
    isRiskDetected,
    consecutiveAbsences,
    threshold: rule.threshold,
    severity: rule.severity,
    type: rule.type,
    title: `${rule.threshold} consecutive absences detected`,
    description: `Student has been absent ${consecutiveAbsences} consecutive times in ${subjectName}.`,
  };
}