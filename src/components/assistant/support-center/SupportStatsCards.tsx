import React from "react";
import { SupportStateProps } from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  HeartPulse,
  ShieldAlert,
} from "lucide-react";

const SupportStatsCards = ({ stats }: SupportStateProps) => {
  const cards = [
    {
      key: "openCases",
      label: "Open Cases",
      helper: "Active follow-up cases",
      icon: CircleAlert,
      tone: "violet",
      className: "border-violet-300/20 bg-violet-500/10 text-violet-200",
    },
    {
      key: "highPriorityCases",
      label: "High Priority",
      helper: "High and urgent cases",
      icon: AlertTriangle,
      tone: "amber",
      className: "border-amber-300/20 bg-amber-500/10 text-amber-300",
    },
    {
      key: "escalatedCases",
      label: "Escalated",
      helper: "Needs higher attention",
      icon: ShieldAlert,
      tone: "red",
      className: "border-red-300/20 bg-red-500/10 text-red-300",
    },
    {
      key: "resolvedThisWeek",
      label: "Resolved This Week",
      helper: "Cases handled this week",
      icon: CheckCircle2,
      tone: "emerald",
      className: "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
    },
    {
      key: "atRiskStudents",
      label: "At-risk Students",
      helper: "Currently flagged students",
      icon: HeartPulse,
      tone: "cyan",
      className: "border-cyan-300/20 bg-cyan-500/10 text-cyan-200",
    },
  ] as const;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  {card.label}
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                  {stats[card.key]}
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {card.helper}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${card.className}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SupportStatsCards;