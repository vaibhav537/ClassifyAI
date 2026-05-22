// src/app/api/chat/keys/init/route.ts

import { getCurrentSessionUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicKey } = await req.json();

    if (!publicKey || typeof publicKey !== "string") {
      return NextResponse.json(
        { error: "publicKey is required" },
        { status: 400 },
      );
    }

    await prisma.conversationParticipant.updateMany({
      where: {
        userId: user.id,
        publicKey:""
      },
      data: {
        publicKey,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Chat encryption key initialized successfully",
    });
  } catch (err) {
    console.error("Key init error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}