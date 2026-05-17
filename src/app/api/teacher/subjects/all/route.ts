import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campusId = searchParams.get("campusId");
    const teacherUserId = searchParams.get("teacherId");

    if (!campusId) {
      return NextResponse.json(
        { success: false, error: "Campus ID is required" },
        { status: 400 },
      );
    }

    if (teacherUserId) {
      const teacher = await prisma.teacher.findFirst({
        where: {
          userId: teacherUserId,
          user: {
            campusId,
          },
        },
        select: {
          id: true,
        },
      });

      if (!teacher) {
        return NextResponse.json(
          { success: false, error: "Teacher not found on this campus" },
          { status: 404 },
        );
      }
      const assignedSubjects = await prisma.teacherSubject.findMany({
        where: {
          teacherId: teacher.id,
        },
        select: {
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true,
              campusId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          subject: {
            name: "asc",
          },
        },
      });
      const uniqueSubjects = [
        ...new Map(
          assignedSubjects.map((item) => [item.subject.id, item.subject]),
        ).values(),
      ];

      return NextResponse.json(uniqueSubjects);
    }

    const subjects = await prisma.subject.findMany({
      where: {
        campusId: campusId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subjects" },
      { status: 500 },
    );
  }
}
