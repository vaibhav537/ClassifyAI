"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { BarChart, TrendingUp, Trophy, UserCheck, UserX } from "lucide-react";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const StatCard = ({
  title,
  value,
  icon,
  subtext,
  colorGradient,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
  colorGradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.055]"
  >
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
    <div
      className={`pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-gradient-to-br ${colorGradient} opacity-20 blur-3xl transition duration-300 group-hover:opacity-30`}
    />

    <div className="relative z-10 flex items-start gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${colorGradient} shadow-xl shadow-black/20`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>

        <p className="mt-2 truncate text-2xl font-extrabold tracking-tight text-white">
          {value}
        </p>

        {subtext && (
          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
            {subtext}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

export default function AttendanceAnalyticsPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);

  useEffect(() => {
    setTeacherId(localStorage.getItem("teacherId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const { data, error, isLoading } = useSWR(
    teacherId && campusId
      ? `/api/teacher/analytics/attendance?teacherId=${teacherId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const analytics = data?.analytics;

  if (isLoading) {
    return (
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10 animate-pulse">
              <div className="h-6 w-40 rounded-full bg-white/10" />
              <div className="mt-5 h-10 w-80 max-w-full rounded-2xl bg-white/10" />
              <div className="mt-3 h-4 w-[34rem] max-w-full rounded-full bg-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                <div className="relative z-10 flex animate-pulse items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10" />
                  <div className="flex-1">
                    <div className="h-3 w-32 rounded-full bg-white/10" />
                    <div className="mt-3 h-7 w-20 rounded-xl bg-white/10" />
                    <div className="mt-2 h-3 w-24 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                <div className="relative z-10 animate-pulse">
                  <div className="h-6 w-48 rounded-2xl bg-white/10" />
                  <div className="mt-5 space-y-3">
                    {[1, 2, 3, 4, 5].map((row) => (
                      <div
                        key={row}
                        className="h-12 w-full rounded-2xl bg-white/10"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !data?.success || !analytics) {
    return (
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-red-300/20 bg-red-500/10 p-5 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <p className="text-sm font-bold text-red-300">
              {data?.message || "Failed to load analytics."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
              Mentor Desk
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Attendance Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Monitor attendance performance across classes, subjects, and the
              last 30 days from your Mentor Desk.
            </p>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <StatCard
            title="Overall Attendance"
            value={`${analytics.overallAttendancePercentage}%`}
            icon={<BarChart className="text-white" />}
            colorGradient="from-violet-600 via-fuchsia-500 to-violet-500"
          />

          <StatCard
            title="Highest Attending Student"
            value={`${analytics.highestAttendingStudents[0]?.percentage}%`}
            icon={<UserCheck className="text-white" />}
            subtext={analytics.highestAttendingStudents[0]?.name}
            colorGradient="from-emerald-400 via-emerald-500 to-green-600"
          />

          <StatCard
            title="Lowest Attending Student"
            value={`${
              analytics.lowestAttendingStudents[0]?.percentage === undefined
                ? "N/A"
                : `${analytics.lowestAttendingStudents[0]?.percentage}%`
            }`}
            icon={<UserX className="text-white" />}
            subtext={analytics.lowestAttendingStudents[0]?.name}
            colorGradient="from-red-500 via-rose-500 to-pink-500"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
                    Subject Breakdown
                  </span>

                  <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
                    Performance by Subject
                  </h2>
                </div>

                <Trophy className="hidden h-5 w-5 text-violet-200 sm:block" />
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45">
                <ul className="divide-y divide-white/10">
                  {analytics.performanceBySubject.length > 0 ? (
                    analytics.performanceBySubject.map((item: any) => (
                      <li
                        key={item.subject}
                        className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.045]"
                      >
                        <span className="min-w-0 truncate text-sm font-extrabold text-white">
                          {item.subject}
                        </span>

                        <span className="shrink-0 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 text-xs font-extrabold text-violet-200">
                          {item.percentage}%
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="grid min-h-[180px] place-items-center p-6 text-center">
                      <div>
                        <BarChart className="mx-auto h-8 w-8 text-slate-600" />
                        <p className="mt-4 text-sm font-bold text-slate-300">
                          No attendance records yet.
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Subject-wise performance will appear after sessions
                          are marked.
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-violet-400/5" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                    30 Day Trend
                  </span>

                  <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
                    Attendance Trend
                  </h2>
                </div>

                <TrendingUp className="hidden h-5 w-5 text-violet-200 sm:block" />
              </div>

              <div className="max-h-[360px] overflow-y-auto pr-1 scrollbar-hide">
                {analytics.dailyTrend.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.dailyTrend.map((day: any) => (
                      <div
                        key={day.date}
                        className="group rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-4 transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.06]"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-semibold text-slate-400">
                            {new Date(day.date).toLocaleDateString()}
                          </span>

                          <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-extrabold text-cyan-200">
                            {day.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid min-h-[180px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
                    <div>
                      <TrendingUp className="mx-auto h-8 w-8 text-slate-600" />
                      <p className="mt-4 text-sm font-bold text-slate-300">
                        No attendance data in the last 30 days.
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Daily trends will appear once attendance sessions are
                        recorded.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
