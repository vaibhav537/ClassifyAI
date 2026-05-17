"use client";

import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { Send, Trophy, BookOpen } from "lucide-react";
import { useState } from "react";
import StatusBadge from "./StatusBadge";
import LeaderboardSkeleton from "./LeaderboardSkeleton";
import ErrorState from "./ErrorState";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TeacherLeaderboard({
  campusId,
  teacherId,
}: {
  campusId: string;
  teacherId: string;
}) {
  const [sending, setSending] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    campusId
      ? `/api/teacher/hod/teacher-leaderboard?campusId=${campusId}`
      : null,
    fetcher,
  );

  async function handleNotify() {
    try {
      setSending(true);

      await fetch("/api/hod/teacher-accountability", {
        method: "POST",
        body: JSON.stringify({
          campusId,
          sentBy: teacherId,
        }),
      });

      mutate();
    } finally {
      setSending(false);
    }
  }

  if (isLoading) return <LeaderboardSkeleton />;
  if (error || !data)
    return <ErrorState message="Failed to load leaderboard" />;

  const chartData = data.leaderboard.map((t: any) => ({
    name: t.name,
    resources: t.totalResources,
  }));

  return (
    <div className="relative space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-300">
            <Trophy className="h-3.5 w-3.5" />
            Faculty Performance
          </span>

          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
            Teacher Leaderboard
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Resource coverage and accountability overview for faculty members.
          </p>
        </div>

        <button
          onClick={handleNotify}
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-500/10 px-5 py-3 text-sm font-extrabold text-amber-300 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {sending ? "Sending..." : "Remind Pending"}
        </button>
      </div>

      <div className="relative h-72 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-violet-500/8" />

        <div className="relative z-10 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.10)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.10)" }}
                tickLine={false}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "#14141B",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  color: "#fff",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
                }}
                labelStyle={{ color: "#fcd34d", fontWeight: 800 }}
                itemStyle={{ color: "#e2e8f0", fontWeight: 700 }}
              />
              <Bar dataKey="resources" radius={[10, 10, 0, 0]} fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {data.leaderboard.length > 0 ? (
        <div className="space-y-3">
          {data.leaderboard.map((t: any, index: number) => (
            <motion.div
              key={t.teacherId}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: index * 0.04,
              }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-amber-300/30 hover:bg-white/[0.055]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-violet-500/8 opacity-70 transition duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/10 text-sm font-extrabold text-amber-200">
                    #{index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-white">
                      {t.name}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {t.subjectsWithResources}/{t.assignedSubjects} subjects
                      covered
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 text-xs font-extrabold text-violet-200">
                    <BookOpen className="h-3.5 w-3.5" />
                    {t.totalResources}
                  </span>

                  <StatusBadge status={t.status} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-[220px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-amber-300/20 bg-amber-500/10">
              <Trophy className="h-7 w-7 text-amber-300" />
            </div>

            <p className="mt-4 text-sm font-extrabold text-slate-200">
              No leaderboard data yet
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Faculty resource activity will appear here once data is available.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
