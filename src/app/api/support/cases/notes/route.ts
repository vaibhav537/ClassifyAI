import { SupportCaseActivityType, SupportCaseStatus } from "@/generated/prisma";
import { logActivity } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addNoteSchema = z.object({
  caseId: z.string().cuid(),
  actorId: z.string().cuid().optional().nullable(),
  note: z.string().trim().min(1),
  isInternalNote: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = addNoteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors, success: false },
        { status: 400 },
      );
    }
    const { caseId, actorId, note, isInternalNote } = validation.data;
    const supportCase = await prisma.supportCase.findUnique({
      where: { id: caseId },
      select: {
        id: true,
        status: true,
        riskEventId: true,
        studentId: true,
        campusId: true,
        title: true,
        resolvedAt: true,
        resolvedById: true,
      },
    });
    if (!supportCase) {
      return NextResponse.json(
        { error: "Support case not found.", success: false },
        { status: 404 },
      );
    }
    if (supportCase.status === SupportCaseStatus.CLOSED) {
      return NextResponse.json(
        {
          success: false,
          message: "Notes cannot be added to a closed support case.",
        },
        { status: 409 },
      );
    }
    let actorName = "SYSTEM";
    const timeNow = new Date();
    if (actorId) {
      const userProfile = await prisma.user.findUnique({
        where: {
          id: actorId,
        },
        select: {
          username: true,
          name: true,
        },
      });
      actorName = userProfile?.name || userProfile?.username || "SYSTEM";
    }
    await prisma.$transaction(async (tx) => {
      await tx.supportCaseNote.create({
        data: {
          note,
          authorId: actorId ?? null,
          supportCaseId: supportCase.id,
          isInternal: isInternalNote ?? true,
          createdAt: timeNow,
        },
      });
      await tx.supportCaseActivityLog.create({
        data: {
          actorId: actorId ?? null,
          supportCaseId: supportCase.id,
          title: "Support note added",
          type: SupportCaseActivityType.NOTE_ADDED,
          description: `${actorName} added a support note`,
          metadata: {
            isInternal: isInternalNote ?? true,
            hasNote: true,
          },
          createdAt: timeNow,
        },
      });
      await tx.supportCase.update({
        where: {
          id: supportCase.id,
        },
        data: {
          lastFollowUpAt: timeNow,
        },
      });
    });
    if (actorId) {
      await logActivity(
        actorId,
        actorName,
        `${actorName} added a support note`,
      );
    }
    return NextResponse.json(
      { success: true, message: "Support note successfully created" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Can't create support note", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
