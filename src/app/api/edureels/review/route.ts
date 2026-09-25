import { EduReelStatus } from "@/generated/prisma";
import { canReviewReel, getCourseOptions, getEduReelUser, reelForClient, reelInclude, reviewScope } from "@/lib/edureels";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const user = await getEduReelUser();
  if (!user || !["ASSISTANT", "TEACHER"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const courses = user.role === "TEACHER" ? await getCourseOptions(user) : [];
  const reels = await prisma.eduReel.findMany({
    where: {
      campusId: user.campusId!,
      status: EduReelStatus.PENDING,
      author: { role: "STUDENT" },
      authorId: { not: user.id },
      ...reviewScope(user, courses),
    },
    include: reelInclude,
    orderBy: { createdAt: "asc" },
    take: 100,
  });
  return NextResponse.json({ reels: reels.map((reel) => reelForClient(reel)) });
}

const decisionSchema = z.object({
  reelId: z.string().min(1),
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().trim().min(5).max(300).optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await getEduReelUser();
  if (!user || !["ASSISTANT", "TEACHER"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = decisionSchema.safeParse(await req.json());
  if (!parsed.success || (parsed.data.action === "REJECT" && !parsed.data.reason)) {
    return NextResponse.json({ error: "A rejection needs a reason" }, { status: 400 });
  }
  const { reelId, action, reason } = parsed.data;
  const reel = await prisma.eduReel.findFirst({
    where: { id: reelId, campusId: user.campusId! },
    select: { id: true, status: true, authorId: true, campusId: true, subjectId: true, semesterId: true, sectionId: true },
  });
  const courses = user.role === "TEACHER" ? await getCourseOptions(user) : [];
  if (!reel || !canReviewReel(user, reel, courses)) {
    return NextResponse.json({ error: "This reel is outside your review scope" }, { status: 403 });
  }
  if (reel.status !== EduReelStatus.PENDING) {
    return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
  }
  const approved = action === "APPROVE";
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.eduReel.updateMany({
      where: { id: reel.id, campusId: user.campusId!, status: EduReelStatus.PENDING },
      data: {
        status: approved ? EduReelStatus.APPROVED : EduReelStatus.REJECTED,
        publishedAt: approved ? new Date() : null,
        reviewedAt: new Date(),
        reviewedById: user.id,
        reviewReason: approved ? null : reason,
      },
    });
    if (!result.count) return false;
    await tx.notification.create({ data: {
      userId: reel.authorId,
      title: approved ? "EduReel approved" : "EduReel needs changes",
      body: approved ? "Your reel is now on the campus feed" : reason!,
      meta: { link: "/edureels?tab=mine", reelId },
    } });
    return true;
  });
  if (!updated) return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
  return NextResponse.json({ status: approved ? "APPROVED" : "REJECTED" });
}
