"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  UserX,
} from "lucide-react";

export default function AssignmentAnalytics({ analytics }: { analytics: any }) {
  const stats = [
    {
      label: "Submission Rate",
      value: `${analytics.submissionCount} / ${analytics.totalStudents}`,
      icon: <CheckCircle2 className="h-5 w-5 text-cyan-200" />,
      cardClass: "border-cyan-300/20 bg-cyan-500/10",
      valueClass: "text-cyan-200",
    },
    {
      label: "Highest Grade",
      value: analytics.highestGrade ?? "N/A",
      icon: <TrendingUp className="h-5 w-5 text-emerald-300" />,
      cardClass: "border-emerald-300/20 bg-emerald-500/10",
      valueClass: "text-emerald-300",
    },
    {
      label: "Lowest Grade",
      value: analytics.lowestGrade ?? "N/A",
      icon: <TrendingDown className="h-5 w-5 text-red-300" />,
      cardClass: "border-red-300/20 bg-red-500/10",
      valueClass: "text-red-300",
    },
    {
      label: "Not Submitted",
      value: analytics.nonSubmitters.length,
      icon: <UserX className="h-5 w-5 text-amber-300" />,
      cardClass: "border-amber-300/20 bg-amber-500/10",
      valueClass: "text-amber-300",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <BarChart3 className="h-5 w-5 text-violet-200" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Submission progress and grading summary
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-[1.5rem] border p-4 shadow-xl shadow-black/10 backdrop-blur-xl ${stat.cardClass}`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  {stat.label}
                </p>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#08080C]/35">
                  {stat.icon}
                </div>
              </div>

              <p className={`text-3xl font-extrabold ${stat.valueClass}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {analytics.nonSubmitters.length > 0 && (
          <div className="mt-5 rounded-[1.5rem] border border-red-300/20 bg-red-500/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              <p className="text-sm font-extrabold text-red-200">
                Missing Submissions
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {analytics.nonSubmitters.map((s: any) => (
                <span
                  key={s.id}
                  className="rounded-full border border-red-300/20 bg-[#08080C]/35 px-3 py-1.5 text-xs font-bold text-red-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
