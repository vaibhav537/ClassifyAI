CREATE TYPE "EduReelStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');
CREATE TYPE "EduReelReportStatus" AS ENUM ('OPEN', 'RESOLVED');

CREATE TABLE "EduReel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "learningOutcome" TEXT NOT NULL,
    "videoPublicId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "durationSeconds" DOUBLE PRECISION NOT NULL,
    "status" "EduReelStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewReason" TEXT,
    "authorId" TEXT NOT NULL,
    "reviewedById" TEXT,
    "campusId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    CONSTRAINT "EduReel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EduReelSave" (
    "id" TEXT NOT NULL,
    "reelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EduReelSave_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EduReelReport" (
    "id" TEXT NOT NULL,
    "reelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "EduReelReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EduReelReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EduReel_videoPublicId_key" ON "EduReel"("videoPublicId");
CREATE INDEX "EduReel_campusId_status_publishedAt_idx" ON "EduReel"("campusId", "status", "publishedAt");
CREATE INDEX "EduReel_campusId_status_subjectId_idx" ON "EduReel"("campusId", "status", "subjectId");
CREATE INDEX "EduReel_authorId_createdAt_idx" ON "EduReel"("authorId", "createdAt");
CREATE UNIQUE INDEX "EduReelSave_reelId_userId_key" ON "EduReelSave"("reelId", "userId");
CREATE INDEX "EduReelSave_userId_createdAt_idx" ON "EduReelSave"("userId", "createdAt");
CREATE UNIQUE INDEX "EduReelReport_reelId_userId_key" ON "EduReelReport"("reelId", "userId");
CREATE INDEX "EduReelReport_status_createdAt_idx" ON "EduReelReport"("status", "createdAt");

ALTER TABLE "EduReel" ADD CONSTRAINT "EduReel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EduReel" ADD CONSTRAINT "EduReel_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EduReel" ADD CONSTRAINT "EduReel_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EduReel" ADD CONSTRAINT "EduReel_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EduReel" ADD CONSTRAINT "EduReel_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EduReel" ADD CONSTRAINT "EduReel_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EduReelSave" ADD CONSTRAINT "EduReelSave_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "EduReel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EduReelSave" ADD CONSTRAINT "EduReelSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EduReelReport" ADD CONSTRAINT "EduReelReport_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "EduReel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EduReelReport" ADD CONSTRAINT "EduReelReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
