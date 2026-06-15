import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get("session-token")?.value;
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    const sessionToken = cookieToken || bearerToken;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized: No session token" },
        { status: 401 },
      );
    }

    // 2. Look up the session in the database.
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      select: {
        id: true,
        sessionToken: true,
        expiresAt: true,
        faceVerified: true,
        faceVerifieAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true,
            campusId: true,
            avatarUrl: true,
          },
        },
      },
    });

    // 3. Check if the session is valid and not expired.
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid session" },
        { status: 401 },
      );
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { sessionToken } });
      return NextResponse.json(
        { error: "Unauthorized: Session expired" },
        { status: 401 },
      );
    }

    // 4. Return the user if the session is valid.
    return NextResponse.json({
      user: session.user,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
        faceVerified: session.faceVerified,
        faceVerifiedAt: session.faceVerifieAt,
      },
    });
  } catch (error) {
    console.error("Session API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
