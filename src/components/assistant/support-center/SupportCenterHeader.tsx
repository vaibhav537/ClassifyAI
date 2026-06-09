import React from "react";
import { HeartHandshake, RefreshCw, Send, ShieldCheck } from "lucide-react";

const SupportCenterHeader = () => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
            <HeartHandshake className="h-3.5 w-3.5" />
            Classify AI · Circle of Care
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Support Center Dashboard
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Attendance-triggered monitoring for at-risk students, support cases,
            and Circle of Care follow-up workflows.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-xs font-extrabold text-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            Academic care workflow active
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:shrink-0">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-5 py-3 text-sm font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
          >
            <Send className="h-4 w-4" />
            Send Notice
          </button>
        </div>
      </div>
    </section>
  );
};

export default SupportCenterHeader;