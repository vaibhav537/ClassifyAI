"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import React from "react";

const SubjectChart = ({ subject }: { subject: any }) => {
  const avg =
    subject.trend.reduce((acc: number, d: any) => acc + d.percentage, 0) /
    subject.trend.length;

  const trendDirection =
    subject.trend[subject.trend.length - 1].percentage -
    subject.trend[0].percentage;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 transition duration-300 hover:border-violet-300/30 hover:bg-white/[0.055]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8 opacity-80 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold tracking-tight text-white">
              {subject.subjectName}
            </h3>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Subject attendance movement
            </p>
          </div>

          <div
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-extrabold ${
              avg < 50
                ? "border-red-300/20 bg-red-500/10 text-red-300"
                : avg < 75
                  ? "border-amber-300/20 bg-amber-500/10 text-amber-300"
                  : "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            Avg: {Math.round(avg)}%
          </div>
        </div>

        <div className="h-44 rounded-[1.25rem] border border-white/10 bg-[#14141B]/70 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={subject.trend}>
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.10)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.10)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#14141B",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  color: "#fff",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
                }}
                labelStyle={{ color: "#c4b5fd", fontWeight: 800 }}
                itemStyle={{ color: "#e2e8f0", fontWeight: 700 }}
              />

              <Line
                type="monotone"
                dataKey="percentage"
                stroke={avg < 50 ? "#f87171" : avg < 75 ? "#fbbf24" : "#34d399"}
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span
            className={`rounded-full border px-3 py-1.5 font-extrabold ${
              avg < 50
                ? "border-red-300/20 bg-red-500/10 text-red-300"
                : avg < 75
                  ? "border-amber-300/20 bg-amber-500/10 text-amber-300"
                  : "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {avg < 50
              ? "Critical Attendance"
              : avg < 75
                ? "Needs Attention"
                : "Healthy"}
          </span>

          <span
            className={`rounded-full border px-3 py-1.5 font-extrabold ${
              trendDirection < 0
                ? "border-red-300/20 bg-red-500/10 text-red-300"
                : "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {trendDirection < 0 ? "↓ Dropping" : "↑ Improving"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectChart;
