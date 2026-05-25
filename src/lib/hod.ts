import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { HodContext } from "@/lib/types";

export async function getCurrentSessionUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token")?.value;
  if (!sessionToken) return null;
  const session = await prisma.session.findFirst({
    where: {
      sessionToken,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      },
    },
  });
  if (!session?.user) return null;
  return session.user;
}

export async function getHodContext(): Promise<
  | { success: true; data: HodContext }
  | { success: false; response: NextResponse }
> {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 },
        ),
      };
    }

    if (!user.campusId) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, message: "User is not linked with any campus" },
          { status: 403 },
        ),
      };
    }

    if (user.role !== "TEACHER" || user.teacherProfile?.designation !== "HOD") {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, message: "Only HOD can access this route" },
          { status: 403 },
        ),
      };
    }

    return {
      success: true,
      data: {
        userId: user.id,
        campusId: user.campusId,
        teacherId: user.teacherProfile.id,
        department: user.teacherProfile.department ?? null,
      },
    };
  } catch (error) {
    console.error("[HOD_CONTEXT_ERROR]", error);

    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: "Failed to verify HOD access" },
        { status: 500 },
      ),
    };
  }
}
