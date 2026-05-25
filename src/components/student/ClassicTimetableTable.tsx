"use client";

import React, { useMemo } from "react";
import { BookOpen, CalendarClock, MapPin, UserRound } from "lucide-react";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type ClassicTimetableEntry = {
  id: string;
  type: string;
  title?: string | null;
  weekday: string;
  startTime: string;
  endTime: string;
  room?: string | null;
  teacher?: {
    user: {
      name: string;
      email?: string;
    };
  } | null;
  subject?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
  semester?: {
    id: string;
    name: string;
  } | null;
  section?: {
    id: string;
    name: string;
  } | null;
};

type TimeSlot = {
  key: string;
  startTime: string;
  endTime: string;
  label: string;
};

type ClassicTimetableTableProps = {
  entries: ClassicTimetableEntry[];
  title?: string;
  subtitle?: string;
  semesterName?: string | null;
  sectionName?: string | null;
  instituteName?: string;
  departmentName?: string;
  logoSrc?: string;
  showLegend?: boolean;
  className?: string;
};

const WEEKDAYS: Weekday[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const CLASS_TYPES = ["LECTURE", "LAB", "TUTORIAL", "EXTRA_CLASS", "EXAM"];

function isClassType(type: string) {
  return CLASS_TYPES.includes(type);
}

function formatWeekday(day: string) {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

function formatTime(value: string | Date) {
  const time = new Date(value).toISOString().slice(11, 16);
  const [hourRaw, minute] = time.split(":");
  const hour = Number(hourRaw);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;

  return `${normalizedHour}:${minute} ${suffix}`;
}

function getTimeValue(value: string | Date) {
  return new Date(value).getTime();
}

function getEntryTitle(entry: ClassicTimetableEntry) {
  if (isClassType(entry.type)) {
    return entry.subject?.code || entry.subject?.name || "Class";
  }

  return entry.title || entry.type.replace("_", " ");
}

function getFullSubjectName(entry: ClassicTimetableEntry) {
  if (!entry.subject) return "Subject N/A";

  return entry.subject.code
    ? `${entry.subject.name} (${entry.subject.code})`
    : entry.subject.name;
}

function formatSectionName(sectionName?: string | null) {
  if (!sectionName) return null;

  return sectionName.toLowerCase().includes("section")
    ? sectionName
    : `Section ${sectionName}`;
}

export default function ClassicTimetableTable({
  entries,
  title = "Weekly Timetable",
  subtitle = "Official timetable view",
  semesterName,
  sectionName,
  instituteName = "Classify AI Academic Scheduler",
  departmentName = "Department Timetable",
  logoSrc,
  showLegend = true,
  className = "",
}: ClassicTimetableTableProps) {
  const slots = useMemo<TimeSlot[]>(() => {
    const map = new Map<string, TimeSlot>();

    entries.forEach((entry) => {
      const key = `${entry.startTime}-${entry.endTime}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          startTime: entry.startTime,
          endTime: entry.endTime,
          label: `${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}`,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => getTimeValue(a.startTime) - getTimeValue(b.startTime),
    );
  }, [entries]);

  const entriesByDayAndSlot = useMemo(() => {
    const map = new Map<string, ClassicTimetableEntry[]>();

    entries.forEach((entry) => {
      const key = `${entry.weekday}-${entry.startTime}-${entry.endTime}`;
      const previous = map.get(key) || [];
      map.set(key, [...previous, entry]);
    });

    return map;
  }, [entries]);

  const legendItems = useMemo(() => {
    const map = new Map<
      string,
      {
        subject: string;
        code: string;
        teacher: string;
      }
    >();

    entries.forEach((entry) => {
      if (!isClassType(entry.type) || !entry.subject) return;

      const key = entry.subject.id;

      if (!map.has(key)) {
        map.set(key, {
          subject: entry.subject.name,
          code: entry.subject.code || "-",
          teacher: entry.teacher?.user.name || "Teacher N/A",
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.subject.localeCompare(b.subject),
    );
  }, [entries]);

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/30 backdrop-blur-2xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8" />

      <div className="relative z-10 p-4 sm:p-5">
        <div className="mb-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt="Institute logo"
                  className="h-16 w-16 rounded-2xl border border-white/10 bg-white object-contain p-2"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                  <CalendarClock className="h-8 w-8 text-cyan-200" />
                </div>
              )}

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">
                  {subtitle}
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-white">
                  {title}
                </h2>

                <p className="mt-1 text-sm font-semibold text-slate-400">
                  {instituteName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-100">
                {departmentName}
              </span>

              {semesterName && (
                <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">
                  {semesterName}
                </span>
              )}

              {sectionName && (
                <span className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-100">
                  {formatSectionName(sectionName)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[1.5rem] border border-white/10">
          <table className="min-w-[980px] w-full border-collapse bg-[#0B0B11]/70 text-left">
            <thead>
              <tr className="bg-cyan-500/15">
                <th className="w-[150px] border border-white/10 px-4 py-4 text-center text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-100">
                  Days / Time
                </th>

                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <th
                      key={slot.key}
                      className="border border-white/10 px-4 py-4 text-center text-xs font-extrabold uppercase tracking-[0.12em] text-cyan-100"
                    >
                      {slot.label}
                    </th>
                  ))
                ) : (
                  <th className="border border-white/10 px-4 py-4 text-center text-xs font-extrabold uppercase tracking-[0.12em] text-cyan-100">
                    No slots
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {WEEKDAYS.map((day) => (
                <tr key={day} className="transition hover:bg-white/[0.025]">
                  <td className="border border-white/10 bg-cyan-500/10 px-4 py-5 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-cyan-100">
                    {formatWeekday(day)}
                  </td>

                  {slots.length > 0 ? (
                    slots.map((slot) => {
                      const cellEntries =
                        entriesByDayAndSlot.get(
                          `${day}-${slot.startTime}-${slot.endTime}`,
                        ) || [];

                      return (
                        <td
                          key={`${day}-${slot.key}`}
                          className="min-h-[110px] border border-white/10 px-3 py-4 align-top"
                        >
                          {cellEntries.length > 0 ? (
                            <div className="space-y-3">
                              {cellEntries.map((entry) => {
                                const classEntry = isClassType(entry.type);

                                return (
                                  <div
                                    key={entry.id}
                                    className={`rounded-2xl border p-3 text-center ${
                                      classEntry
                                        ? "border-violet-300/20 bg-violet-500/10"
                                        : "border-amber-300/20 bg-amber-500/10"
                                    }`}
                                  >
                                    <p className="text-sm font-extrabold uppercase tracking-wide text-white">
                                      {getEntryTitle(entry)}
                                    </p>

                                    {classEntry ? (
                                      <div className="mt-2 space-y-1 text-[11px] font-semibold text-slate-300">
                                        <p className="flex items-center justify-center gap-1">
                                          <UserRound className="h-3 w-3 text-violet-300" />
                                          {entry.teacher?.user.name ||
                                            "Teacher N/A"}
                                        </p>

                                        <p className="flex items-center justify-center gap-1">
                                          <MapPin className="h-3 w-3 text-emerald-300" />
                                          {entry.room || "Room N/A"}
                                        </p>
                                      </div>
                                    ) : (
                                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-100">
                                        {entry.type.replace("_", " ")}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="grid min-h-[88px] place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-xs font-semibold text-slate-600">
                              Free
                            </div>
                          )}
                        </td>
                      );
                    })
                  ) : (
                    <td className="border border-white/10 px-4 py-8 text-center text-sm font-semibold text-slate-500">
                      No timetable entries available.
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showLegend && legendItems.length > 0 && (
          <div className="mt-5 overflow-x-auto rounded-[1.5rem] border border-white/10">
            <table className="min-w-[760px] w-full border-collapse bg-[#0B0B11]/70">
              <thead>
                <tr className="bg-violet-500/15">
                  <th className="border border-white/10 px-4 py-3 text-left text-xs font-extrabold uppercase tracking-[0.14em] text-violet-100">
                    Subject
                  </th>
                  <th className="border border-white/10 px-4 py-3 text-left text-xs font-extrabold uppercase tracking-[0.14em] text-violet-100">
                    Code
                  </th>
                  <th className="border border-white/10 px-4 py-3 text-left text-xs font-extrabold uppercase tracking-[0.14em] text-violet-100">
                    Faculty
                  </th>
                </tr>
              </thead>

              <tbody>
                {legendItems.map((item) => (
                  <tr key={`${item.subject}-${item.teacher}`}>
                    <td className="border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200">
                      <span className="inline-flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-cyan-300" />
                        {item.subject}
                      </span>
                    </td>

                    <td className="border border-white/10 px-4 py-3 text-sm font-bold text-cyan-100">
                      {item.code}
                    </td>

                    <td className="border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300">
                      {item.teacher}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}