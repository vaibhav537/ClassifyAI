import { TimetableEntryType, Weekday } from "@/generated/prisma";

export const CLASS_TIMETABLE_TYPES: TimetableEntryType[] = [
  "LECTURE",
  "LAB",
  "TUTORIAL",
  "EXTRA_CLASS",
  "EXAM",
];

export const NON_CLASS_TIMETABLE_TYPES: TimetableEntryType[] = [
  "LUNCH",
  "BREAK",
  "FREE",
  "EVENT",
];

export function isClassTimetableType(type: TimetableEntryType) {
  return CLASS_TIMETABLE_TYPES.includes(type);
}

export function parseTimeToDate(time: string): Date {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(time)) {
    throw new Error("Invalid time format. Expected HH:mm");
  }

  return new Date(`1970-01-01T${time}:00.000Z`);
}

export function formatDateToTime(date: Date): string {
  return date.toISOString().slice(11, 16);
}

export function isValidWeekday(value: string): value is Weekday {
  return [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ].includes(value);
}

export function isValidTimetableType(
  value: string,
): value is TimetableEntryType {
  return [
    "LECTURE",
    "LAB",
    "TUTORIAL",
    "EXTRA_CLASS",
    "LUNCH",
    "BREAK",
    "FREE",
    "EXAM",
    "EVENT",
  ].includes(value);
}

export function hasValidTimeRange(startTime: Date, endTime: Date) {
  return endTime > startTime;
}

export function isTimeInsideRange({
  startTime,
  endTime,
  rangeStart,
  rangeEnd,
}: {
  startTime: Date;
  endTime: Date;
  rangeStart: Date;
  rangeEnd: Date;
}) {
  return startTime >= rangeStart && endTime <= rangeEnd;
}
