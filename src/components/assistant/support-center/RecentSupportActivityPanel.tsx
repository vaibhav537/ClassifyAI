import { SupportActivityProps } from "@/lib/types";
import React from "react";
import { Activity, Clock3, GitBranch, UserRound } from "lucide-react";

const RecentSupportActivityPanel = ({
  activities,
}: SupportActivityProps) => {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <Activity className="h-5 w-5 text-violet-200" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Support Timeline
            </h2>
            <p className="text-xs leading-5 text-slate-500">
              Recent follow-up actions and case updates.
            </p>
          </div>
        </div>

        <div className="relative flex flex-col gap-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                  <GitBranch className="h-4 w-4 text-violet-200" />
                </div>

                {index !== activities.length - 1 && (
                  <div className="mt-2 h-full min-h-12 w-px bg-white/10" />
                )}
              </div>

              <div className="group flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-white/[0.055]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-white">
                      {activity.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {activity.caseTitle}
                    </p>
                  </div>

                  <span className="inline-flex h-fit shrink-0 items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-cyan-200">
                    <Clock3 className="h-3.5 w-3.5" />
                    {activity.time}
                  </span>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-slate-400">
                  <UserRound className="h-3.5 w-3.5 text-violet-300" />
                  by {activity.actor}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentSupportActivityPanel;