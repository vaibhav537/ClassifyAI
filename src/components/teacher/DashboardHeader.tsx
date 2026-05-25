"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Crown,
  QrCode,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function DashboardHeader({
  teacherName,
  teacherDesignation,
  teacherDepartment,
  onGenerateQrClick,
}: {
  teacherName: string;
  teacherDesignation: string;
  teacherDepartment: string;
  onGenerateQrClick: () => void;
}) {
  const router = useRouter();
  const today = new Date();
  const isHOD = teacherDesignation.toUpperCase() === "HOD";

  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/12 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
            <Sparkles className="h-3 w-3" />
            Mentor Desk
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back,{" "}
            <span className="text-brand-gradient">{teacherName}</span>
          </h1>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-2 text-sm font-semibold text-slate-300">
              <CalendarDays className="h-4 w-4 text-violet-300" />
              {today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-100">
              <UserRound className="h-4 w-4 text-violet-200" />
              {teacherDesignation}
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100">
              <Building2 className="h-4 w-4 text-cyan-200" />
              {teacherDepartment}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row xl:shrink-0">
          {isHOD && (
            <button
              type="button"
              onClick={() => {
                router.push("/dashboard/teacher/hod");
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-5 py-3 text-sm font-extrabold text-amber-100 shadow-xl shadow-amber-950/10 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-amber-400/20"
            >
              <Crown className="h-5 w-5 text-amber-200" />
              Go to HOD Center
            </button>
          )}

          <button
            type="button"
            onClick={onGenerateQrClick}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
          >
            <QrCode className="h-5 w-5 transition group-hover:rotate-6" />
            Start Attendance
          </button>
        </div>
      </div>
    </header>
  );
}