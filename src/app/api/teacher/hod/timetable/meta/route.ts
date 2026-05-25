import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHodContext } from "@/lib/hod";

export async function GET() {
  try {
    const hod = await getHodContext();

    if (!hod.success) return hod.response;
    const [teachers, subjects, semesters, sections, dayConfigs] =
      await Promise.all([
        prisma.teacher.findMany({
          where: {
            user: {
              campusId: hod.data.campusId,
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                campusId: true,
              },
            },
          },
        }),
        prisma.subject.findMany({
          where: {
            campusId: hod.data.campusId,
          },
          orderBy: {
            name: "asc",
          },
        }),
        prisma.semester.findMany({
          where: {
            campusId: hod.data.campusId,
          },
          orderBy: [
            {
              number: "asc",
            },
            {
              name: "asc",
            },
          ],
        }),
        prisma.section.findMany({
          where: {
            campusId: hod.data.campusId,
          },
          orderBy: {
            name: "asc",
          },
        }),
        prisma.timetableDayConfig.findMany({
          where: {
            campusId: hod.data.campusId,
          },
        }),
      ]);

    return NextResponse.json({
      success: true,
      teachers,
      subjects,
      semesters,
      sections,
      dayConfigs,
    });
  } catch (error) {
    console.error("[HOD_TIMETABLE_META_GET]", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch timetable meta" },
      { status: 500 },
    );
  }
}
