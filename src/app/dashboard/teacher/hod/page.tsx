"use client";

import DefaulterRadar from "@/components/teacher/hod/DefaulterRadar";
import DepartmentPulse from "@/components/teacher/hod/DepartmentPulse";
import SubjectTrendChart from "@/components/teacher/hod/SubjectTrendChart";
import TeacherLeaderboard from "@/components/teacher/hod/TeacherLeaderboard";
import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, CalendarClock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [campusId, setCampusId] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setCampusId(localStorage.getItem("CampusID"));
    setTeacherId(localStorage.getItem("teacherId"));
  }, []);

  if (!campusId || !teacherId) {
    return (
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 grid min-h-[70vh] place-items-center p-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-8 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
                <Activity className="h-7 w-7 animate-pulse text-violet-200" />
              </div>

              <p className="mt-5 text-lg font-extrabold text-white">
                Loading HOD Dashboard...
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preparing real-time department intelligence.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

      <div className="relative z-10 flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                Mentor Desk
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                HOD Command Center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Real-time department analytics, faculty performance monitoring,
                attendance risk insights, and subject trend intelligence.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
                  Live Monitoring
                </p>
                <p className="text-sm font-extrabold text-emerald-100">
                  Active
                </p>
              </div>
            </div>
          </div>
        </header>

        <section
          onClick={() => router.push("/dashboard/teacher/hod/timetable")}
          className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06] sm:p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-400/20" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.4rem] border border-cyan-300/20 bg-cyan-500/10">
                <CalendarClock className="h-7 w-7 text-cyan-200" />
              </div>

              <div>
                <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-100">
                  Academic Scheduler
                </span>

                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white">
                  Make Timetable
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Configure college timings, working days, lunch breaks,
                  lectures, labs, rooms, teachers, semester and section-wise
                  timetable with conflict warnings.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-5 py-3 text-sm font-extrabold text-cyan-100 transition-all duration-300 group-hover:border-cyan-200/40 group-hover:bg-cyan-500/20"
            >
              Open Timetable
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        <section className="w-full">
          <DepartmentPulse campusId={campusId} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/8 via-transparent to-violet-500/8" />

            <div className="relative z-10">
              <DefaulterRadar campusId={campusId} teacherId={teacherId} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10">
              <TeacherLeaderboard campusId={campusId} teacherId={teacherId} />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8" />

          <div className="relative z-10">
            <SubjectTrendChart campusId={campusId} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
