"use client";
import React from "react";

export const SectionCard = ({
  icon,
  title,
  subtitle,
  children,
  glow = "violet",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  glow?: "violet" | "red" | "emerald" | "amber";
}) => {
  const iconTone =
    glow === "red"
      ? "border-red-300/20 bg-red-500/10"
      : glow === "emerald"
        ? "border-emerald-300/20 bg-emerald-500/10"
        : glow === "amber"
          ? "border-amber-300/20 bg-amber-500/10"
          : "border-violet-300/20 bg-violet-500/10";

  const gradient =
    glow === "red"
      ? "from-red-500/8 via-transparent to-violet-500/8"
      : glow === "emerald"
        ? "from-emerald-500/8 via-transparent to-violet-500/8"
        : glow === "amber"
          ? "from-amber-500/8 via-transparent to-violet-500/8"
          : "from-violet-500/10 via-transparent to-cyan-400/5";

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/15">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient}`}
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${iconTone}`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-white">{title}</h3>
            <p className="text-xs leading-5 text-slate-500">{subtitle}</p>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
};
