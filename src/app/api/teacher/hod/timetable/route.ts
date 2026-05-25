import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHodContext } from "@/lib/hod";
import {
  hasValidTimeRange,
  isClassTimetableType,
  isTimeInsideRange,
  isValidTimetableType,
  isValidWeekday,
  parseTimeToDate,
} from "@/lib/timetable";

function getEntryId(request: NextRequest, body?: any) {
  const { searchParams } = new URL(request.url);
  return searchParams.get("id") || body?.id || null;
}

export async function GET(request: NextRequest) {
  try {
    const hod = await getHodContext();

    if (!hod.success) return hod.response;

    const { searchParams } = new URL(request.url);

    const weekday = searchParams.get("weekday");
    const semesterId = searchParams.get("semesterId");
    const sectionId = searchParams.get("sectionId");
    const teacherId = searchParams.get("teacherId");

    const entries = await prisma.timetableEntry.findMany({
      where: {
        campusId: hod.data.campusId,
        isActive: true,
        ...(weekday && isValidWeekday(weekday) ? { weekday } : {}),
        ...(semesterId ? { semesterId } : {}),
        ...(sectionId ? { sectionId } : {}),
        ...(teacherId ? { teacherId } : {}),
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subject: true,
        semester: true,
        section: true,
      },
      orderBy: [
        {
          weekday: "asc",
        },
        {
          startTime: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error("[HOD_TIMETABLE_GET]", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch timetable entries" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const hod = await getHodContext();

    if (!hod.success) return hod.response;

    const body = await request.json();

    const {
      type,
      title,
      weekday,
      startTime,
      endTime,
      room,
      teacherId,
      subjectId,
      semesterId,
      sectionId,
      notes,
    } = body;

    if (!type || !isValidTimetableType(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid timetable type" },
        { status: 400 },
      );
    }

    if (!weekday || !isValidWeekday(weekday)) {
      return NextResponse.json(
        { success: false, message: "Invalid weekday" },
        { status: 400 },
      );
    }

    if (!startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "Start time and end time are required" },
        { status: 400 },
      );
    }

    const parsedStartTime = parseTimeToDate(startTime);
    const parsedEndTime = parseTimeToDate(endTime);

    if (!hasValidTimeRange(parsedStartTime, parsedEndTime)) {
      return NextResponse.json(
        { success: false, message: "End time must be after start time" },
        { status: 400 },
      );
    }

    const dayConfig = await prisma.timetableDayConfig.findUnique({
      where: {
        campusId_weekday: {
          campusId: hod.data.campusId,
          weekday,
        },
      },
    });

    if (!dayConfig || !dayConfig.isWorking) {
      return NextResponse.json(
        { success: false, message: "Selected day is not a working day" },
        { status: 400 },
      );
    }

    const insideCollegeTime = isTimeInsideRange({
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      rangeStart: dayConfig.startTime,
      rangeEnd: dayConfig.endTime,
    });

    if (!insideCollegeTime) {
      return NextResponse.json(
        {
          success: false,
          message: "Slot timing must be inside configured college timing",
        },
        { status: 400 },
      );
    }

    const isClassType = isClassTimetableType(type);

    if (isClassType && (!teacherId || !subjectId || !semesterId || !sectionId)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Teacher, subject, semester and section are required for class entries",
        },
        { status: 400 },
      );
    }

    if (!isClassType && (!title || String(title).trim().length === 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required for non-class entries",
        },
        { status: 400 },
      );
    }

    if (teacherId) {
      const teacher = await prisma.teacher.findFirst({
        where: {
          id: teacherId,
          user: {
            campusId: hod.data.campusId,
          },
        },
      });

      if (!teacher) {
        return NextResponse.json(
          { success: false, message: "Invalid teacher selected" },
          { status: 400 },
        );
      }
    }

    if (subjectId) {
      const subject = await prisma.subject.findFirst({
        where: {
          id: subjectId,
          campusId: hod.data.campusId,
        },
      });

      if (!subject) {
        return NextResponse.json(
          { success: false, message: "Invalid subject selected" },
          { status: 400 },
        );
      }
    }

    if (semesterId) {
      const semester = await prisma.semester.findFirst({
        where: {
          id: semesterId,
          campusId: hod.data.campusId,
        },
      });

      if (!semester) {
        return NextResponse.json(
          { success: false, message: "Invalid semester selected" },
          { status: 400 },
        );
      }
    }

    if (sectionId) {
      const section = await prisma.section.findFirst({
        where: {
          id: sectionId,
          campusId: hod.data.campusId,
        },
      });

      if (!section) {
        return NextResponse.json(
          { success: false, message: "Invalid section selected" },
          { status: 400 },
        );
      }
    }

    if (isClassType) {
      const assignment = await prisma.teacherSubject.findFirst({
        where: {
          teacherId,
          subjectId,
          semesterId,
          sectionId,
        },
      });

      if (!assignment) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected teacher is not assigned to this subject, semester and section",
          },
          { status: 400 },
        );
      }
    }

    if (teacherId) {
      const teacherConflict = await prisma.timetableEntry.findFirst({
        where: {
          campusId: hod.data.campusId,
          weekday,
          teacherId,
          isActive: true,
          startTime: {
            lt: parsedEndTime,
          },
          endTime: {
            gt: parsedStartTime,
          },
        },
        include: {
          subject: true,
          semester: true,
          section: true,
          teacher: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (teacherConflict) {
        return NextResponse.json(
          {
            success: false,
            message: "Teacher already has an entry at this time",
            conflict: teacherConflict,
          },
          { status: 409 },
        );
      }
    }

    if (semesterId && sectionId) {
      const sectionConflict = await prisma.timetableEntry.findFirst({
        where: {
          campusId: hod.data.campusId,
          weekday,
          semesterId,
          sectionId,
          isActive: true,
          startTime: {
            lt: parsedEndTime,
          },
          endTime: {
            gt: parsedStartTime,
          },
        },
        include: {
          subject: true,
          semester: true,
          section: true,
          teacher: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (sectionConflict) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected semester and section already have an entry at this time",
            conflict: sectionConflict,
          },
          { status: 409 },
        );
      }
    }

    if (room && String(room).trim().length > 0) {
      const roomConflict = await prisma.timetableEntry.findFirst({
        where: {
          campusId: hod.data.campusId,
          weekday,
          room: String(room).trim(),
          isActive: true,
          startTime: {
            lt: parsedEndTime,
          },
          endTime: {
            gt: parsedStartTime,
          },
        },
        include: {
          subject: true,
          semester: true,
          section: true,
          teacher: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (roomConflict) {
        return NextResponse.json(
          {
            success: false,
            message: "Selected room is already occupied at this time",
            conflict: roomConflict,
          },
          { status: 409 },
        );
      }
    }

    const entry = await prisma.timetableEntry.create({
      data: {
        type,
        title: title?.trim() || null,
        weekday,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        room: room?.trim() || null,
        campusId: hod.data.campusId,
        teacherId: teacherId || null,
        subjectId: subjectId || null,
        semesterId: semesterId || null,
        sectionId: sectionId || null,
        notes: notes?.trim() || null,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subject: true,
        semester: true,
        section: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Timetable entry created successfully",
        entry,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[HOD_TIMETABLE_POST]", error);

    return NextResponse.json(
      { success: false, message: "Failed to create timetable entry" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const hod = await getHodContext();

    if (!hod.success) return hod.response;

    const body = await request.json();
    const id = getEntryId(request, body);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Timetable entry id is required" },
        { status: 400 },
      );
    }

    const existingEntry = await prisma.timetableEntry.findFirst({
      where: {
        id,
        campusId: hod.data.campusId,
        isActive: true,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { success: false, message: "Timetable entry not found" },
        { status: 404 },
      );
    }

    const {
      type,
      title,
      weekday,
      startTime,
      endTime,
      room,
      teacherId,
      subjectId,
      semesterId,
      sectionId,
      notes,
    } = body;

    if (!type || !isValidTimetableType(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid timetable type" },
        { status: 400 },
      );
    }

    if (!weekday || !isValidWeekday(weekday)) {
      return NextResponse.json(
        { success: false, message: "Invalid weekday" },
        { status: 400 },
      );
    }

    if (!startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "Start time and end time are required" },
        { status: 400 },
      );
    }

    const parsedStartTime = parseTimeToDate(startTime);
    const parsedEndTime = parseTimeToDate(endTime);

    if (!hasValidTimeRange(parsedStartTime, parsedEndTime)) {
      return NextResponse.json(
        { success: false, message: "End time must be after start time" },
        { status: 400 },
      );
    }

    const dayConfig = await prisma.timetableDayConfig.findUnique({
      where: {
        campusId_weekday: {
          campusId: hod.data.campusId,
          weekday,
        },
      },
    });

    if (!dayConfig || !dayConfig.isWorking) {
      return NextResponse.json(
        { success: false, message: "Selected day is not a working day" },
        { status: 400 },
      );
    }

    const insideCollegeTime = isTimeInsideRange({
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      rangeStart: dayConfig.startTime,
      rangeEnd: dayConfig.endTime,
    });

    if (!insideCollegeTime) {
      return NextResponse.json(
        {
          success: false,
          message: "Slot timing must be inside configured college timing",
        },
        { status: 400 },
      );
    }

    const isClassType = isClassTimetableType(type);

    if (isClassType && (!teacherId || !subjectId || !semesterId || !sectionId)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Teacher, subject, semester and section are required for class entries",
        },
        { status: 400 },
      );
    }

    if (!isClassType && (!title || String(title).trim().length === 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required for non-class entries",
        },
        { status: 400 },
      );
    }

    if (teacherId) {
      const teacher = await prisma.teacher.findFirst({
        where: {
          id: teacherId,
          user: {
            campusId: hod.data.campusId,
          },
        },
      });

      if (!teacher) {
        return NextResponse.json(
          { success: false, message: "Invalid teacher selected" },
          { status: 400 },
        );
      }
    }

    if (subjectId) {
      const subject = await prisma.subject.findFirst({
        where: {
          id: subjectId,
          campusId: hod.data.campusId,
        },
      });

      if (!subject) {
        return NextResponse.json(
          { success: false, message: "Invalid subject selected" },
          { status: 400 },
        );
      }
    }

    if (semesterId) {
      const semester = await prisma.semester.findFirst({
        where: {
          id: semesterId,
          campusId: hod.data.campusId,
        },
      });

      if (!semester) {
        return NextResponse.json(
          { success: false, message: "Invalid semester selected" },
          { status: 400 },
        );
      }
    }

    if (sectionId) {
      const section = await prisma.section.findFirst({
        where: {
          id: sectionId,
          campusId: hod.data.campusId,
        },
      });

      if (!section) {
        return NextResponse.json(
          { success: false, message: "Invalid section selected" },
          { status: 400 },
        );
      }
    }

    if (isClassType) {
      const assignment = await prisma.teacherSubject.findFirst({
        where: {
          teacherId,
          subjectId,
          semesterId,
          sectionId,
        },
      });

      if (!assignment) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected teacher is not assigned to this subject, semester and section",
          },
          { status: 400 },
        );
      }
    }

    if (teacherId) {
      const teacherConflict = await prisma.timetableEntry.findFirst({
        where: {
          id: {
            not: id,
          },
          campusId: hod.data.campusId,
          weekday,
          teacherId,
          isActive: true,
          startTime: {
            lt: parsedEndTime,
          },
          endTime: {
            gt: parsedStartTime,
          },
        },
        include: {
          subject: true,
          semester: true,
          section: true,
          teacher: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (teacherConflict) {
        return NextResponse.json(
          {
            success: false,
            message: "Teacher already has an entry at this time",
            conflict: teacherConflict,
          },
          { status: 409 },
        );
      }
    }

    if (semesterId && sectionId) {
      const sectionConflict = await prisma.timetableEntry.findFirst({
        where: {
          id: {
            not: id,
          },
          campusId: hod.data.campusId,
          weekday,
          semesterId,
          sectionId,
          isActive: true,
          startTime: {
            lt: parsedEndTime,
          },
          endTime: {
            gt: parsedStartTime,
          },
        },
        include: {
          subject: true,
          semester: true,
          section: true,
          teacher: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (sectionConflict) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected semester and section already have an entry at this time",
            conflict: sectionConflict,
          },
          { status: 409 },
        );
      }
    }

    if (room && String(room).trim().length > 0) {
      const roomConflict = await prisma.timetableEntry.findFirst({
        where: {
          id: {
            not: id,
          },
          campusId: hod.data.campusId,
          weekday,
          room: String(room).trim(),
          isActive: true,
          startTime: {
            lt: parsedEndTime,
          },
          endTime: {
            gt: parsedStartTime,
          },
        },
        include: {
          subject: true,
          semester: true,
          section: true,
          teacher: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (roomConflict) {
        return NextResponse.json(
          {
            success: false,
            message: "Selected room is already occupied at this time",
            conflict: roomConflict,
          },
          { status: 409 },
        );
      }
    }

    const updatedEntry = await prisma.timetableEntry.update({
      where: {
        id,
      },
      data: {
        type,
        title: title?.trim() || null,
        weekday,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        room: room?.trim() || null,
        teacherId: teacherId || null,
        subjectId: subjectId || null,
        semesterId: semesterId || null,
        sectionId: sectionId || null,
        notes: notes?.trim() || null,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subject: true,
        semester: true,
        section: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Timetable entry updated successfully",
      entry: updatedEntry,
    });
  } catch (error) {
    console.error("[HOD_TIMETABLE_PATCH]", error);

    return NextResponse.json(
      { success: false, message: "Failed to update timetable entry" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const hod = await getHodContext();

    if (!hod.success) return hod.response;

    const id = getEntryId(request);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Timetable entry id is required" },
        { status: 400 },
      );
    }

    const existingEntry = await prisma.timetableEntry.findFirst({
      where: {
        id,
        campusId: hod.data.campusId,
        isActive: true,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { success: false, message: "Timetable entry not found" },
        { status: 404 },
      );
    }

    await prisma.timetableEntry.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Timetable entry deleted successfully",
    });
  } catch (error) {
    console.error("[HOD_TIMETABLE_DELETE]", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete timetable entry" },
      { status: 500 },
    );
  }
}