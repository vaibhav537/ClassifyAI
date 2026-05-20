/*
  Warnings:

  - Added the required column `updatedAt` to the `TimetableEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TimetableEntryType" AS ENUM ('LECTURE', 'LAB', 'TUTORIAL', 'EXTRA_CLASS', 'LUNCH', 'BREAK', 'FREE', 'EXAM', 'EVENT');

-- DropForeignKey
ALTER TABLE "public"."TimetableEntry" DROP CONSTRAINT "TimetableEntry_campusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimetableEntry" DROP CONSTRAINT "TimetableEntry_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimetableEntry" DROP CONSTRAINT "TimetableEntry_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimetableEntry" DROP CONSTRAINT "TimetableEntry_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimetableEntry" DROP CONSTRAINT "TimetableEntry_teacherId_fkey";

-- DropIndex
DROP INDEX "public"."TimetableEntry_teacherId_weekday_startTime_key";

-- AlterTable
ALTER TABLE "public"."TimetableEntry" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "public"."TimetableEntryType" NOT NULL DEFAULT 'LECTURE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "teacherId" DROP NOT NULL,
ALTER COLUMN "subjectId" DROP NOT NULL,
ALTER COLUMN "semesterId" DROP NOT NULL,
ALTER COLUMN "sectionId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."TimetableDayConfig" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "weekday" "public"."Weekday" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isWorking" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimetableDayConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimetableDayConfig_campusId_weekday_key" ON "public"."TimetableDayConfig"("campusId", "weekday");

-- CreateIndex
CREATE INDEX "TimetableEntry_campusId_weekday_idx" ON "public"."TimetableEntry"("campusId", "weekday");

-- CreateIndex
CREATE INDEX "TimetableEntry_teacherId_weekday_idx" ON "public"."TimetableEntry"("teacherId", "weekday");

-- CreateIndex
CREATE INDEX "TimetableEntry_semesterId_sectionId_weekday_idx" ON "public"."TimetableEntry"("semesterId", "sectionId", "weekday");

-- CreateIndex
CREATE INDEX "TimetableEntry_subjectId_idx" ON "public"."TimetableEntry"("subjectId");

-- AddForeignKey
ALTER TABLE "public"."TimetableEntry" ADD CONSTRAINT "TimetableEntry_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimetableEntry" ADD CONSTRAINT "TimetableEntry_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimetableEntry" ADD CONSTRAINT "TimetableEntry_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimetableEntry" ADD CONSTRAINT "TimetableEntry_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimetableEntry" ADD CONSTRAINT "TimetableEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimetableDayConfig" ADD CONSTRAINT "TimetableDayConfig_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "public"."Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
