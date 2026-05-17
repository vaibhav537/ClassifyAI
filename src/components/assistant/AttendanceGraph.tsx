"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Activity, TrendingUp } from "lucide-react";

const dummyData = [
  { date: "Mon", attendance: 75 },
  { date: "Tue", attendance: 80 },
  { date: "Wed", attendance: 78 },
  { date: "Thu", attendance: 82 },
  { date: "Fri", attendance: 79 },
  { date: "Sat", attendance: 85 },
];

const AttendanceGraph = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex h-full min-h-[22rem] flex-col"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
            <Activity className="h-3.5 w-3.5" />
            Attendance Flow
          </span>

          <h3
            className="mt-3 text-xl font-extrabold tracking-tight text-white"
          >
            Weekly Attendance
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Day-wise attendance movement across the current week.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-xs font-extrabold text-emerald-300">
          <TrendingUp className="h-4 w-4" />
          Stable Trend
        </div>
      </div>

      <div className="min-h-0 flex-1 rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-3 shadow-xl shadow-black/20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dummyData}
            margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: "rgba(255,255,255,0.10)" }}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />

            <Tooltip
              cursor={{ stroke: "rgba(167,139,250,0.35)", strokeWidth: 1 }}
              contentStyle={{
                background: "#14141B",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "16px",
                color: "#fff",
                boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
              }}
              labelStyle={{ color: "#c4b5fd", fontWeight: 800 }}
              itemStyle={{ color: "#e2e8f0", fontWeight: 700 }}
              formatter={(value) => [`${value}%`, "Attendance"]}
            />

            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#a78bfa"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                stroke: "#c4b5fd",
                fill: "#14141B",
              }}
              activeDot={{
                r: 6,
                strokeWidth: 3,
                stroke: "#ffffff",
                fill: "#a78bfa",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AttendanceGraph;
