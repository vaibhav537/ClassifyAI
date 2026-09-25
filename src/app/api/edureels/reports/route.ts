import { EduReelStatus } from "@/generated/prisma";
import { getEduReelUser, reelForClient, reelInclude } from "@/lib/edureels";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const user = await getEduReelUser();
  if (!user || user.role !== "ASSISTANT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const reports = await prisma.eduReelReport.findMany({
    where: { status: "OPEN", reel: { campusId: user.campusId! } },
    include: { reel: { include: reelInclude }, user: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
  return NextResponse.json({ reports: reports.map((report) => ({
    id: report.id,
    reason: report.reason,
    reporter: report.user.name,
    reel: reelForClient(report.reel),
  })) });
}

const reportSchema = z.object({ reelId: z.string().min(1), reason: z.string().trim().min(10).max(300) });

export async function POST(req: NextRequest) {
  const user = await getEduReelUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = reportSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Please give a reason (10–300 characters)" }, { status: 400 });
  const reel = await prisma.eduReel.findFirst({
    where: { id: parsed.data.reelId, campusId: user.campusId!, status: EduReelStatus.APPROVED },
    select: { id: true, authorId: true },
  });
  if (!reel || reel.authorId === user.id) return NextResponse.json({ error: "Cannot report this reel" }, { status: 403 });
  const existing = await prisma.eduReelReport.findUnique({
    where: { reelId_userId: { reelId: reel.id, userId: user.id } },
  });
  if (existing) return NextResponse.json({ error: "You've already reported this reel" }, { status: 409 });

  await prisma.eduReelReport.create({ data: { reelId: reel.id, userId: user.id, reason: parsed.data.reason } });
  try {
    const assistants = await prisma.user.findMany({
      where: { role: "ASSISTANT", campusId: user.campusId! }, select: { id: true },
    });
    if (assistants.length) await prisma.notification.createMany({ data: assistants.map((assistant) => ({
      userId: assistant.id,
      title: "EduReel reported",
      body: "A campus reel needs review",
      meta: { link: "/edureels?tab=reports", reelId: reel.id },
    })) });
  } catch (notificationError) {
    console.error("[EDUREELS_REPORT_NOTIFICATION]", notificationError);
  }
  return NextResponse.json({ reported: true }, { status: 201 });
}

const actionSchema = z.object({ reportId: z.string().min(1), action: z.enum(["HIDE", "DISMISS"]) });

export async function PATCH(req: NextRequest) {
  const user = await getEduReelUser();
  if (!user || user.role !== "ASSISTANT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = actionSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid report action" }, { status: 400 });
  const { reportId, action } = parsed.data;
  const report = await prisma.eduReelReport.findFirst({
    where: { id: reportId, status: "OPEN", reel: { campusId: user.campusId! } },
    select: { reelId: true, reel: { select: { authorId: true } } },
  });
  if (!report) return NextResponse.json({ error: "Report already handled" }, { status: 409 });

  const handled = await prisma.$transaction(async (tx) => {
    const updated = await tx.eduReelReport.updateMany({ where: { id: reportId, status: "OPEN" }, data: { status: "RESOLVED" } });
    if (!updated.count) return false;
    if (action === "HIDE") {
      const hidden = await tx.eduReel.updateMany({
        where: { id: report.reelId, campusId: user.campusId!, status: EduReelStatus.APPROVED },
        data: { status: EduReelStatus.HIDDEN, reviewedById: user.id, reviewedAt: new Date(), reviewReason: "Removed after a campus report" },
      });
      await tx.eduReelReport.updateMany({ where: { reelId: report.reelId, status: "OPEN" }, data: { status: "RESOLVED" } });
      if (hidden.count) {
        await tx.notification.create({ data: {
          userId: report.reel.authorId,
          title: "EduReel removed from feed",
          body: "Your reel was removed after a campus review",
          meta: { link: "/edureels?tab=mine", reelId: report.reelId },
        } });
      }
    }
    return true;
  });
  if (!handled) return NextResponse.json({ error: "Report already handled" }, { status: 409 });
  return NextResponse.json({ handled: true });
}
