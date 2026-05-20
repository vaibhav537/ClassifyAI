import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHodContext } from "@/lib/hod";
import {
  hasValidTimeRange,
  isValidWeekday,
  parseTimeToDate,
} from "@/lib/timetable";

export async function GET() {
  try {
    const hod = await getHodContext();

    if (!hod.success) return hod.response;

    const configs = await prisma.timetableDayConfig.findMany({
      where: {
        campusId: hod.data.campusId,
      },
      orderBy: {
        weekday: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      configs,
    });
  } catch (error) {
    console.error("[HOD_TIMETABLE_DAY_CONFIG_GET]", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch timetable day config" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const hod = await getHodContext();
    if (!hod.success) return hod.response;
    const body = await req.json();
    const configs = body.configs;
    if (!Array.isArray(configs) || configs.length === 0) {
      return NextResponse.json(
        { success: false, message: "Configs are required" },
        { status: 400 },
      );
    }
    const results = [];
    for (const config of configs) {
      const { weekday, startTime, endTime, isWorking } = config;
      if (!weekday || !isValidWeekday(weekday)) {
        return NextResponse.json(
          { success: false, message: "Invalid weekday" },
          { status: 400 },
        );
      }
      const working = Boolean(isWorking);
      let parsedStartTime = parseTimeToDate("00:00");
      let parsedEndTime = parseTimeToDate("00:00");
      if (working) {
        if (!startTime || !endTime) {
          return NextResponse.json(
            {
              success: false,
              message: `Start time and end time are required for ${weekday}`,
            },
            { status: 400 },
          );
        }

        parsedStartTime = parseTimeToDate(startTime);
        parsedEndTime = parseTimeToDate(endTime);
        if (!hasValidTimeRange(parsedStartTime, parsedEndTime)) {
          return NextResponse.json(
            {
              success: false,
              message: `End time must be after start time for ${weekday}`,
            },
            { status: 400 },
          );
        }
      }
      const saved = await prisma.timetableDayConfig.upsert({
        where: {
          campusId_weekday: {
            campusId: hod.data.campusId,
            weekday,
          },
        },
        update: {
          startTime: parsedStartTime,
          endTime: parsedEndTime,
          isWorking: working,
        },
        create: {
          campusId: hod.data.campusId,
          weekday,
          startTime: parsedStartTime,
          endTime: parsedEndTime,
          isWorking: working,
        },
      });

      results.push(saved);
    }
    return NextResponse.json({
      success: true,
      message: "Timetable day config saved successfully",
      configs: results,
    });
  } catch (err) {
    console.error("[HOD_TIMETABLE_DAY_CONFIG_POST]", err);

    return NextResponse.json(
      { success: false, message: "Failed to save timetable day config" },
      { status: 500 },
    );
  }
}
