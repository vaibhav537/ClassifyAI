import { SupportCaseDrawerProps } from "@/lib/types";
import React from "react";
import {
  Activity,
  HeartHandshake,
  MessageCircle,
  NotebookPen,
  PlusCircle,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";

const SupportCaseDrawer = ({
  caseId,
  onClose,
  open,
}: SupportCaseDrawerProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/80 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close support case drawer overlay"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="relative z-10 h-full w-full max-w-xl overflow-hidden border-l border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-cyan-400/6" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/8 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                <HeartHandshake className="h-3.5 w-3.5" />
                Case Detail
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Support Case Overview
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Case ID:{" "}
                <span className="font-bold text-violet-200">{caseId}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 scrollbar-hide sm:px-6">
            <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <UserRound className="h-5 w-5 text-violet-200" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Student & Risk Summary
                    </h3>
                    <p className="text-xs text-slate-500">
                      Profile, attendance risk and subject context
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-slate-400">
                  API integration will load student profile, risk event,
                  subject, attendance context, and Circle of Care details here.
                </p>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-violet-500/8" />

              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                    <Activity className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Timeline
                    </h3>
                    <p className="text-xs text-slate-500">
                      Follow-up actions and case progress
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-4">
                  <p className="text-sm leading-6 text-slate-500">
                    Support case activity logs will appear here.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-violet-500/8" />

              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/10">
                    <NotebookPen className="h-5 w-5 text-amber-300" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Notes
                    </h3>
                    <p className="text-xs text-slate-500">
                      Support comments and follow-up notes
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-4">
                  <p className="text-sm leading-6 text-slate-500">
                    Support notes and follow-up comments will appear here.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/8 via-transparent to-cyan-400/5" />

              <div className="relative z-10 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
                  <ShieldAlert className="h-5 w-5 text-red-300" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Intervention Context
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    This drawer is reserved for attendance-triggered support
                    actions before student issues become too late.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="border-t border-white/10 bg-[#14141B]/90 px-5 py-5 backdrop-blur-2xl sm:px-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-800/30"
              >
                <PlusCircle className="h-4 w-4" />
                Add Note
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-5 py-3 text-sm font-extrabold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/45 hover:bg-emerald-500/20"
              >
                <MessageCircle className="h-4 w-4" />
                Open Circle Chat
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SupportCaseDrawer;