import { RiskEventProps } from "@/lib/types";
import React from "react";
import { AlertTriangle, Clock3, Radio, UserRound } from "lucide-react";

const RecentRiskEventsPanel = ({ events }: RiskEventProps) => {
  function severityClass(severity: string) {
    if (severity === "CRITICAL") {
      return "border-red-300/20 bg-red-500/10 text-red-300";
    }

    if (severity === "HIGH") {
      return "border-orange-300/20 bg-orange-500/10 text-orange-300";
    }

    if (severity === "MEDIUM") {
      return "border-amber-300/20 bg-amber-500/10 text-amber-300";
    }

    return "border-white/10 bg-white/[0.055] text-slate-300";
  }

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/8 via-violet-500/8 to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-300" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Recent Risk Events
            </h2>
            <p className="text-xs leading-5 text-slate-500">
              Latest attendance-triggered alerts.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-white/[0.055]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                        <UserRound className="h-4 w-4 text-violet-200" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-extrabold text-white">
                          {event.studentName}
                        </h3>
                        <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                          {event.subject}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ${severityClass(
                      event.severity,
                    )}`}
                  >
                    {event.severity}
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  <div className="flex items-start gap-2">
                    <Radio className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                    <p className="text-sm font-semibold leading-6 text-slate-300">
                      {event.title}
                    </p>
                  </div>
                </div>

                <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Clock3 className="h-3.5 w-3.5" />
                  {event.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentRiskEventsPanel;