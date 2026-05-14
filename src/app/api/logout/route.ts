import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session-token")?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: {
          sessionToken,
        },
      });
    }

    cookieStore.delete("session-token");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      { status: 500 },
    );
  }
}