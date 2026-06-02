import { PrismaClient, RiskRuleType, RiskScopeType, RiskSeverity } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const campuses = await prisma.campus.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  if (campuses.length === 0) {
    console.log("No campus found. Skipping Circle of Care risk rule seed.");
    return;
  }

  for (const campus of campuses) {
    const rule = await prisma.riskRule.upsert({
      where: {
        id: `default-consecutive-absence-${campus.id}`,
      },
      update: {
        name: "3 Consecutive Absences in Subject",
        description:
          "Marks a student as at-risk when they are absent for 3 consecutive sessions in the same subject.",
        type: RiskRuleType.CONSECUTIVE_ABSENCE,
        threshold: 3,
        severity: RiskSeverity.HIGH,
        isActive: true,
      },
      create: {
        id: `default-consecutive-absence-${campus.id}`,
        campusId: campus.id,
        name: "3 Consecutive Absences in Subject",
        description:
          "Marks a student as at-risk when they are absent for 3 consecutive sessions in the same subject.",
        type: RiskRuleType.CONSECUTIVE_ABSENCE,
        threshold: 3,
        severity: RiskSeverity.HIGH,
        isActive: true,
      },
    });

    const existingScope = await prisma.riskRuleScope.findFirst({
      where: {
        ruleId: rule.id,
        scopeType: RiskScopeType.CAMPUS,
        campusId: campus.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingScope) {
      await prisma.riskRuleScope.create({
        data: {
          ruleId: rule.id,
          scopeType: RiskScopeType.CAMPUS,
          campusId: campus.id,
        },
      });
    }

    console.log(`Seeded Circle of Care default risk rule for campus: ${campus.name}`);
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });