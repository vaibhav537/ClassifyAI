import {
  PrismaClient,
  Role,
  RiskRuleType,
  RiskScopeType,
  RiskSeverity,
} from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const TEST_PASSWORD = "ClassifyAI@123";

async function main() {
  console.log("Starting Classify AI production test seed...");

  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  // 1. Campus
  const campus = await prisma.campus.upsert({
    where: {
      slug: "classify-ai-test-campus",
    },
    update: {
      name: "Classify AI Test Campus",
      hindiName: "AI Smart Attendance & Analytics System",
      city: "Udaipur",
      latitude: 24.5854,
      longitude: 73.7125,
      geofenceRadius: 100000,
      wifiBssids: [],
      logoUrl: "/only-logo.png",
    },
    create: {
      name: "Classify AI Test Campus",
      hindiName: "AI Smart Attendance & Analytics System",
      slug: "classify-ai-test-campus",
      city: "Udaipur",
      latitude: 24.5854,
      longitude: 73.7125,
      geofenceRadius: 100000,
      wifiBssids: [],
      logoUrl: "/only-logo.png",
    },
  });

  console.log("Campus ready:", campus.name);

  // 2. Admin
  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@classifyai.test",
    },
    update: {
      name: "Classify AI Admin",
      username: "classify_test_admin",
      role: Role.ADMIN,
      passwordHash,
      campusId: campus.id,
    },
    create: {
      name: "Classify AI Admin",
      email: "admin@classifyai.test",
      username: "classify_test_admin",
      role: Role.ADMIN,
      passwordHash,
      campusId: campus.id,
    },
  });

  console.log("Admin ready:", adminUser.email);

  // 3. Assistant / Campus admin
  const assistantUser = await prisma.user.upsert({
    where: {
      email: "assistant@classifyai.test",
    },
    update: {
      name: "Classify AI Assistant",
      username: "classify_test_assistant",
      role: Role.ASSISTANT,
      passwordHash,
      campusId: campus.id,
    },
    create: {
      name: "Classify AI Assistant",
      email: "assistant@classifyai.test",
      username: "classify_test_assistant",
      role: Role.ASSISTANT,
      passwordHash,
      campusId: campus.id,
    },
  });

  console.log("Assistant ready:", assistantUser.email);

  // 4. Semester
  const semester = await prisma.semester.upsert({
    where: {
      name_campusId: {
        name: "VI SEM",
        campusId: campus.id,
      },
    },
    update: {
      number: 6,
    },
    create: {
      name: "VI SEM",
      number: 6,
      campusId: campus.id,
    },
  });

  console.log("Semester ready:", semester.name);

  // 5. Section
  const section = await prisma.section.upsert({
    where: {
      name_campusId: {
        name: "A",
        campusId: campus.id,
      },
    },
    update: {},
    create: {
      name: "A",
      campusId: campus.id,
    },
  });

  console.log("Section ready:", section.name);

  // 6. Subject
  const subject = await prisma.subject.upsert({
    where: {
      code: "CAI-TEST-101",
    },
    update: {
      name: "Information System Security",
      description: "Production testing subject for Classify AI attendance flow.",
      campusId: campus.id,
    },
    create: {
      name: "Information System Security",
      code: "CAI-TEST-101",
      description: "Production testing subject for Classify AI attendance flow.",
      campusId: campus.id,
    },
  });

  console.log("Subject ready:", subject.name);

  // 7. Teacher user
  const teacherUser = await prisma.user.upsert({
    where: {
      email: "teacher@classifyai.test",
    },
    update: {
      name: "Test Teacher",
      username: "classify_test_teacher",
      role: Role.TEACHER,
      passwordHash,
      campusId: campus.id,
      branch: "Computer Science",
      semester: 6,
      year: 3,
    },
    create: {
      name: "Test Teacher",
      email: "teacher@classifyai.test",
      username: "classify_test_teacher",
      role: Role.TEACHER,
      passwordHash,
      campusId: campus.id,
      branch: "Computer Science",
      semester: 6,
      year: 3,
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: {
      userId: teacherUser.id,
    },
    update: {
      department: "Computer Science",
      designation: "Professor",
    },
    create: {
      userId: teacherUser.id,
      department: "Computer Science",
      designation: "Professor",
    },
  });

  console.log("Teacher ready:", teacherUser.email);

  // 8. Student user
  const studentUser = await prisma.user.upsert({
    where: {
      email: "student@classifyai.test",
    },
    update: {
      name: "Test Student",
      username: "classify_test_student",
      role: Role.STUDENT,
      passwordHash,
      campusId: campus.id,
      branch: "Computer Science",
      semester: 6,
      year: 3,
    },
    create: {
      name: "Test Student",
      email: "student@classifyai.test",
      username: "classify_test_student",
      role: Role.STUDENT,
      passwordHash,
      campusId: campus.id,
      branch: "Computer Science",
      semester: 6,
      year: 3,
    },
  });

  const student = await prisma.student.upsert({
    where: {
      userId: studentUser.id,
    },
    update: {
      rollNumber: "CAI-STU-001",
      semesterId: semester.id,
      sectionId: section.id,
    },
    create: {
      userId: studentUser.id,
      rollNumber: "CAI-STU-001",
      semesterId: semester.id,
      sectionId: section.id,
    },
  });

  console.log("Student ready:", studentUser.email);

  // 9. Teacher-subject mapping
  const teacherSubject = await prisma.teacherSubject.upsert({
    where: {
      teacherId_subjectId_semesterId_sectionId: {
        teacherId: teacher.id,
        subjectId: subject.id,
        semesterId: semester.id,
        sectionId: section.id,
      },
    },
    update: {},
    create: {
      teacherId: teacher.id,
      subjectId: subject.id,
      semesterId: semester.id,
      sectionId: section.id,
    },
  });

  console.log("TeacherSubject mapping ready:", teacherSubject.id);

  // 10. Student risk profile
  await prisma.studentRiskProfile.upsert({
    where: {
      studentId: student.id,
    },
    update: {
      campusId: campus.id,
      isAtRisk: false,
      totalRiskEvents: 0,
      activeRiskEvents: 0,
      resolvedRiskEvents: 0,
      currentSeverity: RiskSeverity.LOW,
    },
    create: {
      campusId: campus.id,
      studentId: student.id,
      isAtRisk: false,
      totalRiskEvents: 0,
      activeRiskEvents: 0,
      resolvedRiskEvents: 0,
      currentSeverity: RiskSeverity.LOW,
    },
  });

  console.log("Student risk profile ready");

  // 11. Circle of Care default risk rule
  const riskRule = await prisma.riskRule.upsert({
    where: {
      id: `default-consecutive-absence-${campus.id}`,
    },
    update: {
      name: "3 Consecutive Absences in Subject",
      description:
        "Marks a student as at-risk when absent for 3 consecutive sessions in the same subject.",
      type: RiskRuleType.CONSECUTIVE_ABSENCE,
      threshold: 3,
      severity: RiskSeverity.HIGH,
      isActive: true,
      createdById: assistantUser.id,
    },
    create: {
      id: `default-consecutive-absence-${campus.id}`,
      campusId: campus.id,
      name: "3 Consecutive Absences in Subject",
      description:
        "Marks a student as at-risk when absent for 3 consecutive sessions in the same subject.",
      type: RiskRuleType.CONSECUTIVE_ABSENCE,
      threshold: 3,
      severity: RiskSeverity.HIGH,
      isActive: true,
      createdById: assistantUser.id,
    },
  });

  const existingScope = await prisma.riskRuleScope.findFirst({
    where: {
      ruleId: riskRule.id,
      scopeType: RiskScopeType.CAMPUS,
      campusId: campus.id,
    },
  });

  if (!existingScope) {
    await prisma.riskRuleScope.create({
      data: {
        ruleId: riskRule.id,
        scopeType: RiskScopeType.CAMPUS,
        campusId: campus.id,
      },
    });
  }

  console.log("Circle of Care risk rule ready");

  console.log("\nProduction test seed completed successfully.");
  console.log("\nTest login credentials:");
  console.log("Admin     : admin@classifyai.test / ClassifyAI@123");
  console.log("Assistant : assistant@classifyai.test / ClassifyAI@123");
  console.log("Teacher   : teacher@classifyai.test / ClassifyAI@123");
  console.log("Student   : student@classifyai.test / ClassifyAI@123");
}

main()
  .catch((error) => {
    console.error("Production test seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });