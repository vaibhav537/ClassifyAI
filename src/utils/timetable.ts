import {
  TimetableEntry,
  TimetableEntryType,
  TimetableFormState,
  Weekday,
} from "./types";

export const WEEKDAYS: Weekday[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const CLASS_TYPES: TimetableEntryType[] = [
  "LECTURE",
  "LAB",
  "TUTORIAL",
  "EXTRA_CLASS",
  "EXAM",
];

export const ENTRY_TYPES: TimetableEntryType[] = [
  "LECTURE",
  "LAB",
  "TUTORIAL",
  "EXTRA_CLASS",
  "LUNCH",
  "BREAK",
  "FREE",
  "EXAM",
  "EVENT",
];

export const DEFAULT_FORM: TimetableFormState = {
  type: "LECTURE",
  title: "",
  weekday: "MONDAY",
  startTime: "08:00",
  endTime: "09:00",
  room: "",
  teacherId: "",
  subjectId: "",
  semesterId: "",
  sectionId: "",
  notes: "",
};

export function isClassType(type: TimetableEntryType) {
  return CLASS_TYPES.includes(type);
}

export function dateToTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(11, 16);
}

export function formatTime(value?: string | null) {
  const time = dateToTime(value);
  if (!time) return "--:--";

  const [hourRaw, minute] = time.split(":");
  const hour = Number(hourRaw);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 || 12;

  return `${normalized}:${minute} ${suffix}`;
}

export function formatWeekday(day: Weekday) {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

export function buildEditForm(entry: TimetableEntry): TimetableFormState {
  return {
    id: entry.id,
    type: entry.type,
    title: entry.title ?? "",
    weekday: entry.weekday,
    startTime: dateToTime(entry.startTime) || "08:00",
    endTime: dateToTime(entry.endTime) || "09:00",
    room: entry.room ?? "",
    teacherId: entry.teacherId ?? "",
    subjectId: entry.subjectId ?? "",
    semesterId: entry.semesterId ?? "",
    sectionId: entry.sectionId ?? "",
    notes: entry.notes ?? "",
  };
}

export function groupEntriesByWeekday(entries: TimetableEntry[]) {
  return WEEKDAYS.reduce<Record<Weekday, TimetableEntry[]>>(
    (acc, day) => {
      acc[day] = entries
        .filter((entry) => entry.weekday === day)
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );

      return acc;
    },
    {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    },
  );
}