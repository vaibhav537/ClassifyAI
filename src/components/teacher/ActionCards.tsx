"use client";

import { Subject, ClassSession } from "@/lib/types";
import {
  BookOpen,
  Megaphone,
  Upload,
  ClipboardCheck,
  Calendar,
  BarChartBig,
  ArrowUpRight,
  LibraryBig,
  Clock,
  CalendarCheck,
  GraduationCap,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.2, ease: [0.42, 0, 0.58, 1] },
  }),
};

export function QuickActionsCard() {
  const actions = [
    {
      label: "Assignments Analytics",
      icon: <BarChartBig size={22} />,
      color: "from-indigo-500 via-purple-500 to-pink-500",
      href: "/dashboard/teacher/analytics",
    },
    {
      label: "New Announcement",
      icon: <Megaphone size={22} />,
      color: "from-pink-500 via-red-500 to-orange-500",
      href: "/dashboard/teacher/announcements",
    },
    {
      label: "Upload Resources",
      icon: <Upload size={22} />,
      color: "from-green-400 via-emerald-500 to-teal-500",
      href: "/dashboard/teacher/resources",
    },
    {
      label: "Attendance Analytics",
      icon: <ClipboardCheck size={22} />,
      color: "from-yellow-400 via-orange-500 to-red-500",
      href: "/dashboard/teacher/analytics/attendance",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Shortcuts
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Quick Actions
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((a, i) => (
            <Link key={i} href={a.href} className="block">
              <motion.div
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="group relative min-h-[150px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.06]"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.color} opacity-10 transition duration-300 group-hover:opacity-20`}
                />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-violet-100 transition duration-300 group-hover:border-violet-300/30 group-hover:bg-violet-500/15">
                      {a.icon}
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-slate-600 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-violet-200" />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold leading-5 text-white">
                      {a.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Open workspace
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function SubjectsCard({ subjects }: { subjects: Subject[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-violet-500/8" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <LibraryBig className="h-5 w-5 text-violet-200" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Your Subjects
            </h2>
            <p className="text-xs text-slate-500">
              Assigned subjects for your classes
            </p>
          </div>
        </div>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {subjects.map((sub, i) => (
              <motion.div
                key={sub.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -3 }}
                className="group rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-4 transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.06]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] transition group-hover:border-violet-300/25 group-hover:bg-violet-500/10">
                    <BookOpen className="h-4 w-4 text-violet-200" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-white">
                      {sub.name}
                    </p>

                    {sub.code && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                        {sub.code}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[180px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
            <div>
              <BookOpen className="mx-auto h-8 w-8 text-slate-600" />
              <p className="mt-4 text-sm font-bold text-slate-300">
                No subjects assigned
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Assigned subjects will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ScheduleCard({ classes }: { classes: ClassSession[] }) {
  const todayWeekday = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <GraduationCap className="h-5 w-5 text-violet-200" />
            </div>

            <div>
              <p className="text-base font-extrabold text-white">
                Today&apos;s Schedule
              </p>
              <p className="text-xs text-slate-500">
                Classes assigned for {todayWeekday}
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 text-xs font-extrabold text-violet-200 sm:block">
            {classes.length} {classes.length === 1 ? "Class" : "Classes"}
          </div>
        </div>

        <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1 scrollbar-hide">
          {classes.length > 0 ? (
            classes.map((cls, i) => (
              <motion.div
                key={cls.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4 transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.06]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-white">
                        {cls.subject.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {`${cls.section.includes("Section") ? "" : "Section "} ${
                          cls.section
                        }`}{" "}
                        • Sem {cls.semester}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                      <Clock className="h-4 w-4 text-violet-200" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Time Slot
                    </span>

                    <span className="text-xs font-extrabold text-slate-300">
                      {new Date(cls.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(cls.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="grid min-h-[260px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
                  <Calendar className="h-7 w-7 text-violet-200" />
                </div>

                <p className="mt-4 text-sm font-extrabold text-slate-200">
                  No classes today
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Enjoy your free schedule.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AttendanceSession({
  attendanceSessions,
}: {
  attendanceSessions: ClassSession[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
            <CalendarCheck className="h-5 w-5 text-cyan-200" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Attendance Sessions
            </h2>
            <p className="text-xs text-slate-500">
              Sessions available for today&apos;s classes
            </p>
          </div>
        </div>

        {attendanceSessions.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {attendanceSessions.map((as, i) => (
              <motion.div
                key={as.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -3 }}
                className="group rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-4 transition duration-300 hover:border-cyan-300/35 hover:bg-white/[0.06]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                    <ClipboardCheck className="h-4 w-4 text-cyan-200" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-white">
                      {as.subject.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {`${as.section.includes("Section") ? "" : "Section "} ${
                        as.section
                      }`}{" "}
                      • Sem {as.semester}
                    </p>
                  </div>
                </div>

                <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-bold text-slate-400">
                  {new Date(as.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(as.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[180px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
            <div>
              <CalendarCheck className="mx-auto h-8 w-8 text-slate-600" />
              <p className="mt-4 text-sm font-bold text-slate-300">
                No attendance sessions today
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Sessions will appear here when scheduled.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
