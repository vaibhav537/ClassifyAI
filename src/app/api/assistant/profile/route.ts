import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const assistantId = searchParams.get("assistantId");
    const campusId = searchParams.get("campusId");

    if (!assistantId && !campusId) {
      return NextResponse.json(
        {
          success: false,
          message: "assistantId or campusId is required.",
        },
        { status: 400 },
      );
    }

    const assistant = await prisma.user.findFirst({
      where: {
        role: Role.ASSISTANT,
        ...(assistantId ? { id: assistantId } : {}),
        ...(campusId ? { campusId } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        avatarUrl: true,
        campusId: true,
        campus: {
          select: {
            id: true,
            name: true,
            hindiName: true,
            slug: true,
            city: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!assistant) {
      return NextResponse.json(
        {
          success: false,
          message: "Assistant profile not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      assistant,
    });
  } catch (error) {
    console.error("Assistant profile fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load assistant profile.",
      },
      { status: 500 },
    );
  }
}