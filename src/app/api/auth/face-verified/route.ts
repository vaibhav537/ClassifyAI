import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get("session-token")?.value;

    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    const sessionToken = cookieToken || bearerToken;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No session token" },
        { status: 401 },
      );
    }

    const session = await prisma.session.findUnique({
      where: {
        sessionToken,
      },
      select: {
        id: true,
        expiresAt: true,
        faceVerified: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid session" },
        { status: 401 },
      );
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: {
          sessionToken,
        },
      });

      return NextResponse.json(
        { success: false, message: "Unauthorized: Session expired" },
        { status: 401 },
      );
    }

    await prisma.session.update({
      where: {
        sessionToken,
      },
      data: {
        faceVerified: true,
        faceVerifieAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Face verification saved successfully",
    });
  } catch (error) {
    console.error("Face verified API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
