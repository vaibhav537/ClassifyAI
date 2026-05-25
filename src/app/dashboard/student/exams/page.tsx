"use client";

import { Exam } from "@/lib/types";
import {
  CalendarDays,
  ChevronLeft,
  ClipboardList,
  Clock3,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const campusId = localStorage.getItem("CampusID");

    const fetchExams = async () => {
      try {
        const res = await fetch(`/api/exam?campusId=${campusId}`);
        const data = await res.json();

        if (data.success) setExams(data.exams);
      } catch (err) {
        console.error("Failed to load exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Student Exam Center
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Upcoming Exams
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Stay ready for upcoming tests, assessments and campus exam
                  schedules.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Total Exams
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {loading ? "..." : exams.length}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/70">
                  Status
                </p>
                <p className="mt-1 text-sm font-extrabold text-violet-100">
                  {loading ? "Loading" : exams.length > 0 ? "Scheduled" : "Clear"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/75 shadow-2xl shadow-black/35 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                <ClipboardList className="h-5 w-5 text-violet-200" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-white">
                  Exam Schedule
                </h2>
                <p className="text-xs text-slate-500">
                  Your latest campus exam updates
                </p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="grid min-h-[360px] place-items-center px-5 py-12">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
                </div>

                <p className="mt-5 text-lg font-extrabold text-white">
                  Loading exams
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Fetching your campus exam schedule...
                </p>
              </div>
            </div>
          )}

          {!loading && exams.length === 0 && (
            <div className="grid min-h-[360px] place-items-center px-5 py-12">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <CalendarDays className="h-7 w-7 text-slate-500" />
                </div>

                <p className="mt-5 text-xl font-extrabold text-white">
                  No upcoming exams
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You are all clear for now. When your campus adds exam
                  schedules, they will appear here.
                </p>
              </div>
            </div>
          )}

          {!loading && exams.length > 0 && (
            <div className="p-4 sm:p-5">
              <div className="grid gap-4">
                {exams.map((exam, index) => (
                  <article
                    key={exam.id}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-white/[0.065] sm:p-5"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#08080C]/60 text-lg font-extrabold text-violet-200">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xl font-extrabold tracking-tight text-white">
                            {exam.title}
                          </h3>

                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                            {exam.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 rounded-2xl border border-white/10 bg-[#08080C]/50 px-4 py-3 md:min-w-[230px]">
                        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5 text-violet-300" />
                          Exam Date
                        </div>

                        <p className="text-sm font-extrabold text-slate-200">
                          {new Date(exam.date).toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          Stay prepared
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Page;