"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Crown,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";

const StatsCard = ({
  title,
  value,
  color,
  index = 0,
}: {
  title: string;
  value: number;
  color?: string;
  index?: number;
}) => {
  const isExpired =
    color === "red" ||
    color === "border-red-500" ||
    title.toLowerCase().includes("expired");

  const isTotal =
    title.toLowerCase().includes("total") ||
    title.toLowerCase().includes("event");

  const isPremium =
    title.toLowerCase().includes("premium") ||
    title.toLowerCase().includes("exam");

  const isPro =
    title.toLowerCase().includes("pro") ||
    title.toLowerCase().includes("holiday");

  const icon = isExpired ? (
    <TriangleAlert className="h-5 w-5" />
  ) : isPremium ? (
    <Crown className="h-5 w-5" />
  ) : isPro ? (
    <Sparkles className="h-5 w-5" />
  ) : isTotal ? (
    <CalendarDays className="h-5 w-5" />
  ) : (
    <Users className="h-5 w-5" />
  );

  const toneClass = isExpired
    ? "border-red-300/20 bg-red-500/10 text-red-300"
    : isPremium
      ? "border-violet-300/20 bg-violet-500/10 text-violet-200"
      : isPro
        ? "border-cyan-300/20 bg-cyan-500/10 text-cyan-200"
        : isTotal
          ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
          : "border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-200";

  const glowClass = isExpired
    ? "from-red-500/10 via-transparent to-violet-500/5"
    : isPremium
      ? "from-violet-500/10 via-transparent to-fuchsia-500/5"
      : isPro
        ? "from-cyan-500/10 via-transparent to-violet-500/5"
        : isTotal
          ? "from-emerald-500/10 via-transparent to-violet-500/5"
          : "from-fuchsia-500/10 via-transparent to-violet-500/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        delay: index * 0.05,
      }}
      whileHover={{ y: -4 }}
      className="group relative min-h-[140px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-violet-300/30 hover:bg-white/[0.055]"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glowClass} opacity-80 transition duration-300 group-hover:opacity-100`}
      />
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl transition duration-300 group-hover:bg-violet-500/15" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
              {title}
            </p>

            <p className="mt-3 text-4xl font-extrabold tracking-tight text-white">
              {value}
            </p>
          </div>

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${toneClass}`}
          >
            {icon}
          </div>
        </div>

        <div
          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${toneClass}`}
        >
          {isExpired ? "Needs Review" : "Live Metric"}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;