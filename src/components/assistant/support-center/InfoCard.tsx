"use client";
import React from "react";

export const InfoCard = ({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "violet" | "amber" | "red" | "emerald";
}) => {
  const toneClass =
    tone === "violet"
      ? "text-violet-200"
      : tone === "amber"
        ? "text-amber-200"
        : tone === "red"
          ? "text-red-200"
          : tone === "emerald"
            ? "text-emerald-200"
            : "text-slate-200";

  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className={`mt-1 truncate text-sm font-extrabold ${toneClass}`}>
        {value}
      </p>
    </div>
  );
};
