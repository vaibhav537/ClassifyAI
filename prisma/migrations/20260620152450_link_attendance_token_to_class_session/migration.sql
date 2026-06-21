/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,subjectId,sectionId,date,startTime]` on the table `ClassSession` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ClassSession_teacherId_subjectId_sectionId_date_key";

-- AlterTable
ALTER TABLE "public"."AttendanceToken" ADD COLUMN     "classSessionId" TEXT;

-- CreateIndex
CREATE INDEX "idx_attendancetoken_classsession" ON "public"."AttendanceToken"("classSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSession_teacherId_subjectId_sectionId_date_startTime_key" ON "public"."ClassSession"("teacherId", "subjectId", "sectionId", "date", "startTime");

-- AddForeignKey
ALTER TABLE "public"."AttendanceToken" ADD CONSTRAINT "AttendanceToken_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "public"."ClassSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
