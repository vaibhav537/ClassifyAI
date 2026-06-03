import { RiskSeverity, RiskEventStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const severityRank: Record<RiskSeverity, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

function getHighestSeverity(severities: RiskSeverity[]): RiskSeverity {
  if (severities.length === 0) return RiskSeverity.LOW;

  return severities.reduce((highest, current) => {
    return severityRank[current] > severityRank[highest] ? current : highest;
  }, RiskSeverity.LOW);
}

export async function refreshStudentRiskProfile(input: {
  campusId: string;
  studentId: string;
}) {
  const { campusId, studentId } = input;

  const [totalRiskEvents, activeEvents, resolvedRiskEvents] = await Promise.all([
    prisma.riskEvent.count({
      where: {
        campusId,
        studentId,
      },
    }),
    prisma.riskEvent.findMany({
      where: {
        campusId,
        studentId,
        status: RiskEventStatus.ACTIVE,
      },
      select: {
        severity: true,
        detectedAt: true,
      },
      orderBy: {
        detectedAt: "desc",
      },
    }),
    prisma.riskEvent.count({
      where: {
        campusId,
        studentId,
        status: RiskEventStatus.RESOLVED,
      },
    }),
  ]);

  const currentSeverity = getHighestSeverity(
    activeEvents.map((event) => event.severity)
  );

  const activeRiskEvents = activeEvents.length;
  const isAtRisk = activeRiskEvents > 0;

  return prisma.studentRiskProfile.upsert({
    where: {
      studentId,
    },
    update: {
      currentSeverity,
      totalRiskEvents,
      activeRiskEvents,
      resolvedRiskEvents,
      isAtRisk,
      lastRiskDetectedAt: activeEvents[0]?.detectedAt ?? undefined,
      lastResolvedAt: isAtRisk ? undefined : new Date(),
    },
    create: {
      campusId,
      studentId,
      currentSeverity,
      totalRiskEvents,
      activeRiskEvents,
      resolvedRiskEvents,
      isAtRisk,
      lastRiskDetectedAt: activeEvents[0]?.detectedAt ?? null,
      lastResolvedAt: null,
    },
  });
}