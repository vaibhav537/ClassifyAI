-- CreateEnum
CREATE TYPE "public"."RiskRuleType" AS ENUM ('CONSECUTIVE_ABSENCE', 'TOTAL_ABSENCE_IN_SUBJECT', 'LOW_ATTENDANCE_PERCENTAGE', 'GPA_RISK', 'VISA_RISK', 'MANUAL');

-- CreateEnum
CREATE TYPE "public"."RiskScopeType" AS ENUM ('CAMPUS', 'SUBJECT', 'SEMESTER', 'SECTION', 'DEPARTMENT', 'STUDENT', 'INTERNATIONAL_STUDENT');

-- CreateEnum
CREATE TYPE "public"."RiskSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."RiskEventStatus" AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "public"."SupportCaseStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'CONTACTED_STUDENT', 'WAITING_FOR_RESPONSE', 'ESCALATED', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."SupportCasePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."SupportCaseActivityType" AS ENUM ('CASE_CREATED', 'CASE_STATUS_CHANGED', 'CASE_PRIORITY_CHANGED', 'NOTE_ADDED', 'RISK_EVENT_LINKED', 'CIRCLE_CREATED', 'CONVERSATION_CREATED', 'PARTICIPANT_ADDED', 'NOTICE_SENT', 'CASE_RESOLVED', 'CASE_CLOSED');

-- CreateEnum
CREATE TYPE "public"."CircleOfCareStatus" AS ENUM ('ACTIVE', 'PAUSED', 'RESOLVED', 'CLOSED');

-- AlterEnum
ALTER TYPE "public"."ChannelType" ADD VALUE 'CIRCLE_OF_CARE';

-- CreateTable
CREATE TABLE "public"."RiskRule" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."RiskRuleType" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "severity" "public"."RiskSeverity" NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RiskRuleScope" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "scopeType" "public"."RiskScopeType" NOT NULL,
    "campusId" TEXT,
    "subjectId" TEXT,
    "semesterId" TEXT,
    "sectionId" TEXT,
    "studentId" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRuleScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RiskEvent" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "ruleId" TEXT,
    "subjectId" TEXT,
    "classSessionId" TEXT,
    "type" "public"."RiskRuleType" NOT NULL,
    "severity" "public"."RiskSeverity" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "currentValue" INTEGER,
    "threshold" INTEGER,
    "status" "public"."RiskEventStatus" NOT NULL DEFAULT 'ACTIVE',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "acknowledgedById" TEXT,
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentRiskProfile" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "currentSeverity" "public"."RiskSeverity" NOT NULL DEFAULT 'LOW',
    "totalRiskEvents" INTEGER NOT NULL DEFAULT 0,
    "activeRiskEvents" INTEGER NOT NULL DEFAULT 0,
    "resolvedRiskEvents" INTEGER NOT NULL DEFAULT 0,
    "isAtRisk" BOOLEAN NOT NULL DEFAULT false,
    "lastRiskDetectedAt" TIMESTAMP(3),
    "lastResolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentRiskProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportCase" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "riskEventId" TEXT NOT NULL,
    "subjectId" TEXT,
    "assignedAssistantId" TEXT,
    "assignedTeacherId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."SupportCaseStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "public"."SupportCasePriority" NOT NULL DEFAULT 'MEDIUM',
    "firstNoticeSentAt" TIMESTAMP(3),
    "lastFollowUpAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "internalNote" TEXT,
    "createdById" TEXT,
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportCaseNote" (
    "id" TEXT NOT NULL,
    "supportCaseId" TEXT NOT NULL,
    "authorId" TEXT,
    "note" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportCaseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportCaseActivityLog" (
    "id" TEXT NOT NULL,
    "supportCaseId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" "public"."SupportCaseActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportCaseActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CircleOfCareGroup" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "supportCaseId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "reason" TEXT,
    "status" "public"."CircleOfCareStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CircleOfCareGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RiskRule_campusId_idx" ON "public"."RiskRule"("campusId");

-- CreateIndex
CREATE INDEX "RiskRule_type_idx" ON "public"."RiskRule"("type");

-- CreateIndex
CREATE INDEX "RiskRule_isActive_idx" ON "public"."RiskRule"("isActive");

-- CreateIndex
CREATE INDEX "RiskRuleScope_ruleId_idx" ON "public"."RiskRuleScope"("ruleId");

-- CreateIndex
CREATE INDEX "RiskRuleScope_scopeType_idx" ON "public"."RiskRuleScope"("scopeType");

-- CreateIndex
CREATE INDEX "RiskRuleScope_campusId_idx" ON "public"."RiskRuleScope"("campusId");

-- CreateIndex
CREATE INDEX "RiskRuleScope_subjectId_idx" ON "public"."RiskRuleScope"("subjectId");

-- CreateIndex
CREATE INDEX "RiskRuleScope_semesterId_idx" ON "public"."RiskRuleScope"("semesterId");

-- CreateIndex
CREATE INDEX "RiskRuleScope_sectionId_idx" ON "public"."RiskRuleScope"("sectionId");

-- CreateIndex
CREATE INDEX "RiskRuleScope_studentId_idx" ON "public"."RiskRuleScope"("studentId");

-- CreateIndex
CREATE INDEX "RiskEvent_campusId_idx" ON "public"."RiskEvent"("campusId");

-- CreateIndex
CREATE INDEX "RiskEvent_studentId_idx" ON "public"."RiskEvent"("studentId");

-- CreateIndex
CREATE INDEX "RiskEvent_subjectId_idx" ON "public"."RiskEvent"("subjectId");

-- CreateIndex
CREATE INDEX "RiskEvent_ruleId_idx" ON "public"."RiskEvent"("ruleId");

-- CreateIndex
CREATE INDEX "RiskEvent_status_idx" ON "public"."RiskEvent"("status");

-- CreateIndex
CREATE INDEX "RiskEvent_detectedAt_idx" ON "public"."RiskEvent"("detectedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudentRiskProfile_studentId_key" ON "public"."StudentRiskProfile"("studentId");

-- CreateIndex
CREATE INDEX "StudentRiskProfile_campusId_idx" ON "public"."StudentRiskProfile"("campusId");

-- CreateIndex
CREATE INDEX "StudentRiskProfile_isAtRisk_idx" ON "public"."StudentRiskProfile"("isAtRisk");

-- CreateIndex
CREATE INDEX "StudentRiskProfile_currentSeverity_idx" ON "public"."StudentRiskProfile"("currentSeverity");

-- CreateIndex
CREATE UNIQUE INDEX "SupportCase_riskEventId_key" ON "public"."SupportCase"("riskEventId");

-- CreateIndex
CREATE INDEX "SupportCase_campusId_idx" ON "public"."SupportCase"("campusId");

-- CreateIndex
CREATE INDEX "SupportCase_studentId_idx" ON "public"."SupportCase"("studentId");

-- CreateIndex
CREATE INDEX "SupportCase_subjectId_idx" ON "public"."SupportCase"("subjectId");

-- CreateIndex
CREATE INDEX "SupportCase_status_idx" ON "public"."SupportCase"("status");

-- CreateIndex
CREATE INDEX "SupportCase_priority_idx" ON "public"."SupportCase"("priority");

-- CreateIndex
CREATE INDEX "SupportCase_assignedAssistantId_idx" ON "public"."SupportCase"("assignedAssistantId");

-- CreateIndex
CREATE INDEX "SupportCase_assignedTeacherId_idx" ON "public"."SupportCase"("assignedTeacherId");

-- CreateIndex
CREATE INDEX "SupportCaseNote_supportCaseId_idx" ON "public"."SupportCaseNote"("supportCaseId");

-- CreateIndex
CREATE INDEX "SupportCaseNote_authorId_idx" ON "public"."SupportCaseNote"("authorId");

-- CreateIndex
CREATE INDEX "SupportCaseNote_createdAt_idx" ON "public"."SupportCaseNote"("createdAt");

-- CreateIndex
CREATE INDEX "SupportCaseActivityLog_supportCaseId_idx" ON "public"."SupportCaseActivityLog"("supportCaseId");

-- CreateIndex
CREATE INDEX "SupportCaseActivityLog_actorId_idx" ON "public"."SupportCaseActivityLog"("actorId");

-- CreateIndex
CREATE INDEX "SupportCaseActivityLog_type_idx" ON "public"."SupportCaseActivityLog"("type");

-- CreateIndex
CREATE INDEX "SupportCaseActivityLog_createdAt_idx" ON "public"."SupportCaseActivityLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CircleOfCareGroup_supportCaseId_key" ON "public"."CircleOfCareGroup"("supportCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "CircleOfCareGroup_conversationId_key" ON "public"."CircleOfCareGroup"("conversationId");

-- CreateIndex
CREATE INDEX "CircleOfCareGroup_campusId_idx" ON "public"."CircleOfCareGroup"("campusId");

-- CreateIndex
CREATE INDEX "CircleOfCareGroup_studentId_idx" ON "public"."CircleOfCareGroup"("studentId");

-- CreateIndex
CREATE INDEX "CircleOfCareGroup_status_idx" ON "public"."CircleOfCareGroup"("status");

-- CreateIndex
CREATE INDEX "CircleOfCareGroup_createdById_idx" ON "public"."CircleOfCareGroup"("createdById");

-- CreateIndex
CREATE INDEX "idx_attendance_student" ON "public"."Attendance"("studentId");

-- CreateIndex
CREATE INDEX "idx_attendance_status" ON "public"."Attendance"("status");

-- CreateIndex
CREATE INDEX "idx_attendance_student_status" ON "public"."Attendance"("studentId", "status");

-- CreateIndex
CREATE INDEX "idx_classsession_subject" ON "public"."ClassSession"("subjectId");

-- CreateIndex
CREATE INDEX "idx_classsession_campus" ON "public"."ClassSession"("campusId");

-- CreateIndex
CREATE INDEX "idx_classsession_date" ON "public"."ClassSession"("date");

-- CreateIndex
CREATE INDEX "idx_classsession_subject_date" ON "public"."ClassSession"("subjectId", "date");

-- CreateIndex
CREATE INDEX "idx_classsession_semester_section" ON "public"."ClassSession"("semesterId", "sectionId");

-- CreateIndex
CREATE INDEX "Conversation_campusId_idx" ON "public"."Conversation"("campusId");

-- CreateIndex
CREATE INDEX "Conversation_systemType_idx" ON "public"."Conversation"("systemType");

-- CreateIndex
CREATE INDEX "Conversation_subjectId_idx" ON "public"."Conversation"("subjectId");

-- CreateIndex
CREATE INDEX "Conversation_semesterId_idx" ON "public"."Conversation"("semesterId");

-- CreateIndex
CREATE INDEX "Conversation_sectionId_idx" ON "public"."Conversation"("sectionId");

-- CreateIndex
CREATE INDEX "Conversation_teacherId_idx" ON "public"."Conversation"("teacherId");

-- AddForeignKey
ALTER TABLE "public"."RiskRule" ADD CONSTRAINT "RiskRule_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskRule" ADD CONSTRAINT "RiskRule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskRuleScope" ADD CONSTRAINT "RiskRuleScope_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "public"."RiskRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskRuleScope" ADD CONSTRAINT "RiskRuleScope_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskRuleScope" ADD CONSTRAINT "RiskRuleScope_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskRuleScope" ADD CONSTRAINT "RiskRuleScope_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskRuleScope" ADD CONSTRAINT "RiskRuleScope_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskRuleScope" ADD CONSTRAINT "RiskRuleScope_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskEvent" ADD CONSTRAINT "RiskEvent_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskEvent" ADD CONSTRAINT "RiskEvent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskEvent" ADD CONSTRAINT "RiskEvent_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "public"."RiskRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskEvent" ADD CONSTRAINT "RiskEvent_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskEvent" ADD CONSTRAINT "RiskEvent_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "public"."ClassSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskEvent" ADD CONSTRAINT "RiskEvent_acknowledgedById_fkey" FOREIGN KEY ("acknowledgedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RiskEvent" ADD CONSTRAINT "RiskEvent_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentRiskProfile" ADD CONSTRAINT "StudentRiskProfile_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentRiskProfile" ADD CONSTRAINT "StudentRiskProfile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCase" ADD CONSTRAINT "SupportCase_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCase" ADD CONSTRAINT "SupportCase_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCase" ADD CONSTRAINT "SupportCase_riskEventId_fkey" FOREIGN KEY ("riskEventId") REFERENCES "public"."RiskEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCase" ADD CONSTRAINT "SupportCase_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCase" ADD CONSTRAINT "SupportCase_assignedAssistantId_fkey" FOREIGN KEY ("assignedAssistantId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCase" ADD CONSTRAINT "SupportCase_assignedTeacherId_fkey" FOREIGN KEY ("assignedTeacherId") REFERENCES "public"."Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCase" ADD CONSTRAINT "SupportCase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCase" ADD CONSTRAINT "SupportCase_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCaseNote" ADD CONSTRAINT "SupportCaseNote_supportCaseId_fkey" FOREIGN KEY ("supportCaseId") REFERENCES "public"."SupportCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCaseNote" ADD CONSTRAINT "SupportCaseNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCaseActivityLog" ADD CONSTRAINT "SupportCaseActivityLog_supportCaseId_fkey" FOREIGN KEY ("supportCaseId") REFERENCES "public"."SupportCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportCaseActivityLog" ADD CONSTRAINT "SupportCaseActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CircleOfCareGroup" ADD CONSTRAINT "CircleOfCareGroup_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CircleOfCareGroup" ADD CONSTRAINT "CircleOfCareGroup_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CircleOfCareGroup" ADD CONSTRAINT "CircleOfCareGroup_supportCaseId_fkey" FOREIGN KEY ("supportCaseId") REFERENCES "public"."SupportCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CircleOfCareGroup" ADD CONSTRAINT "CircleOfCareGroup_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CircleOfCareGroup" ADD CONSTRAINT "CircleOfCareGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
