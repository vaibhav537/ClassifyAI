"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Clock3,
  Loader2,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type StudentTimetableEntry = {
  id: string;
  type: string;
  title?: string | null;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  room?: string | null;
  teacher?: {
    user: {
      name: string;
      email: string;
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

type StudentTimetableResponse = {
  success: boolean;
  todayWeekday: Weekday;
  student?: {
    id: string;
    semesterId?: string | null;
    sectionId?: string | null;
    semester?: {
      id: string;
      name: string;
    } | null;
    section?: {
      id: string;
      name: string;
    } | null;
  };
  todayEntries: StudentTimetableEntry[];
  weeklyEntries: StudentTimetableEntry[];
  message?: string;
  error?: string;
};

const WEEKDAYS: Weekday[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function formatTimetableTime(value: string | Date) {
  const time = new Date(value).toISOString().slice(11, 16);
  const [hourRaw, minute] = time.split(":");
  const hour = Number(hourRaw);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;

  return `${normalizedHour}:${minute} ${suffix}`;
}

function formatWeekday(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function isClassEntry(type: string) {
  return ["LECTURE", "LAB", "TUTORIAL", "EXTRA_CLASS", "EXAM"].includes(type);
}

function groupEntriesByDay(entries: StudentTimetableEntry[]) {
  return WEEKDAYS.reduce<Record<Weekday, StudentTimetableEntry[]>>(
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

function TimetableCard({ entry }: { entry: StudentTimetableEntry }) {
  const classEntry = isClassEntry(entry.type);

  return (
    <article className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.065]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-cyan-100">
                {entry.type.replace("_", " ")}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold text-slate-300">
                {formatWeekday(entry.weekday)}
              </span>
            </div>

            <h3 className="truncate text-lg font-extrabold text-white">
              {classEntry
                ? entry.subject?.name || "Class"
                : entry.title || entry.type}
            </h3>

            <p className="mt-1 flex items-center gap-2 text-sm font-bold text-cyan-100">
              <Clock3 className="h-4 w-4" />
              {formatTimetableTime(entry.startTime)} -{" "}
              {formatTimetableTime(entry.endTime)}
            </p>
          </div>
        </div>

        {classEntry ? (
          <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-400 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-violet-300" />
              <span className="truncate">
                {entry.teacher?.user.name || "Teacher N/A"}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-300" />
              <span className="truncate">
                {entry.subject?.code
                  ? `${entry.subject.name} (${entry.subject.code})`
                  : entry.subject?.name || "Subject N/A"}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-300" />
              <span className="truncate">{entry.room || "Room not assigned"}</span>
            </p>

            <p className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-amber-300" />
              <span className="truncate">
                {entry.semester?.name || "Semester"}{" "}
                {entry.section?.name ? `- Section ${entry.section.name}` : ""}
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-400">
            {entry.title || "Non-class timetable block"}
          </p>
        )}
      </div>
    </article>
  );
}

export default function StudentTimetablePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [todayWeekday, setTodayWeekday] = useState<Weekday | "">("");
  const [todayEntries, setTodayEntries] = useState<StudentTimetableEntry[]>([]);
  const [weeklyEntries, setWeeklyEntries] = useState<StudentTimetableEntry[]>(
    [],
  );
  const [studentInfo, setStudentInfo] =
    useState<StudentTimetableResponse["student"]>(null);

  const fetchTimetable = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch("/api/student/timetable", {
        cache: "no-store",
      });

      const data: StudentTimetableResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch timetable");
      }

      setTodayWeekday(data.todayWeekday);
      setTodayEntries(data.todayEntries || []);
      setWeeklyEntries(data.weeklyEntries || []);
      setStudentInfo(data.student || null);
      setMessage(data.message || "");
    } catch (err: any) {
      setError(err.message || "Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const groupedEntries = useMemo(
    () => groupEntriesByDay(weeklyEntries),
    [weeklyEntries],
  );

  if (loading) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] p-4 text-white">
        <div className="pointer-events-none absolute inset-0 app-shell-bg" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10 rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-8 text-center shadow-2xl shadow-black/45 backdrop-blur-2xl">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-300" />
          <h1 className="mt-4 text-xl font-extrabold text-white">
            Loading Timetable...
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Fetching your semester-section schedule.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-3 py-4 text-slate-100 sm:px-5 lg:px-6">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute left-10 top-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col gap-5">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-extrabold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-100">
                <CalendarClock className="h-3.5 w-3.5" />
                Student Timetable
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                My Weekly Timetable
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                View your today&apos;s classes and full weekly schedule based on
                your assigned semester and section.
              </p>

              {studentInfo && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-100">
                    {studentInfo.semester?.name || "Semester not assigned"}
                  </span>

                  <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">
                    {studentInfo.section?.name
                      ? `Section ${studentInfo.section.name}`
                      : "Section not assigned"}
                  </span>
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
                  Read Only
                </p>
                <p className="text-sm font-extrabold text-emerald-100">
                  Student View
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-[1.5rem] border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-100">
            {message}
          </div>
        )}

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8" />

          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  {todayWeekday ? formatWeekday(todayWeekday) : "Today"}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-white">
                  Today&apos;s Classes
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                <Clock3 className="h-5 w-5 text-cyan-300" />
              </div>
            </div>

            {todayEntries.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {todayEntries.map((entry) => (
                  <TimetableCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  No classes scheduled today.
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Your HOD-created timetable will appear here when classes are
                  assigned.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {WEEKDAYS.map((day) => {
            const dayEntries = groupedEntries[day];

            return (
              <div
                key={day}
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-cyan-500/[0.04]" />

                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-extrabold text-white">
                      {formatWeekday(day)}
                    </h2>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold text-slate-300">
                      {dayEntries.length} Slots
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {dayEntries.length > 0 ? (
                      dayEntries.map((entry) => (
                        <TimetableCard key={entry.id} entry={entry} />
                      ))
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-5 text-center text-sm font-semibold text-slate-500">
                        No timetable slots for this day.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}