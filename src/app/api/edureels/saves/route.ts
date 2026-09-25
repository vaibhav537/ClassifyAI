import { getEduReelUser } from "@/lib/edureels";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ reelId: z.string().min(1) });

async function toggle(req: NextRequest, save: boolean) {
  const user = await getEduReelUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid reel" }, { status: 400 });
  const reel = await prisma.eduReel.findFirst({
    where: { id: parsed.data.reelId, campusId: user.campusId!, status: "APPROVED" },
    select: { id: true },
  });
  if (!reel) return NextResponse.json({ error: "Reel not found" }, { status: 404 });

  const where = { reelId_userId: { reelId: reel.id, userId: user.id } };
  if (save) {
    await prisma.eduReelSave.upsert({ where, update: {}, create: { reelId: reel.id, userId: user.id } });
  } else {
    await prisma.eduReelSave.deleteMany({ where: { reelId: reel.id, userId: user.id } });
  }
  return NextResponse.json({ saved: save });
}

export async function POST(req: NextRequest) { return toggle(req, true); }
export async function DELETE(req: NextRequest) { return toggle(req, false); }
