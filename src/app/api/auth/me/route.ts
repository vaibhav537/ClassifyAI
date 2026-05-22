import { getCurrentSessionUser } from "@/lib/auth-user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
        avatarUrl: user.avatarUrl,
        teacherProfile: user.teacherProfile,
        studentProfile: user.studentProfile,
      },
    });
  } catch (error) {
    console.error("[AUTH_ME_GET]", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch current user" },
      { status: 500 },
    );
  }
}
