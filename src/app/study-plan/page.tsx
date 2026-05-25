"use client";

import { useState } from "react";
import {
  Sparkles,
  ClipboardList,
  CalendarCheck,
  Lightbulb,
  CalendarClock,
  ChevronLeft,
  Loader2,
  WandSparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const StudyPlanPage = () => {
  const [syllabus, setSyllabus] = useState("");
  const [examDate, setExamDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [planData, setPlanData] = useState<{
    roadmap: string[];
    importantTopics: string[];
    importantQuestions: string[];
    studyPlan: Record<string, string>;
  } | null>(null);

  const router = useRouter();

  const handleGenerate = async () => {
    if (!syllabus.trim()) return;

    setProgress(0);
    setLoading(true);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 150);

    try {
      const res = await fetch(`/api/study-plan/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabus, examDate }),
      });

      const data = await res.json();
      if (data.success) {
        setPlanData(data.data);
        setProgress(100);
      }
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setTimeout(() => {
        setLoading(false); // Hide loading after showing 100%
      }, 1000);
    }
  };

  if (loading) {
    return (
      <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] px-4 py-10 text-white">
        <div className="pointer-events-none absolute inset-0 app-shell-bg" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-[12%] top-[18%] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-8 text-center shadow-2xl shadow-black/45 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-cyan-400/8" />

          <div className="relative z-10">
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 144 144"
              >
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="url(#studyPlanLoaderGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 62}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 62 - (progress / 100) * (2 * Math.PI * 62)
                  }`}
                />
                <defs>
                  <linearGradient
                    id="studyPlanLoaderGradient"
                    x1="0"
                    y1="0"
                    x2="144"
                    y2="144"
                  >
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="55%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.05] shadow-2xl shadow-violet-950/35">
                <img
                  src="/only-logo.png"
                  alt="ClassifyAI"
                  className="h-14 w-14 object-contain drop-shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                />
              </div>
            </div>

            <p className="mt-7 text-xl font-extrabold tracking-tight text-white">
              Generating Your Study Plan
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Classify AI is organizing your syllabus into a focused preparation
              roadmap.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-300">Progress</span>
                <span className="font-extrabold text-violet-200">
                  {progress}%
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-300 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
                Building your plan...
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5">
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
                  AI Study Planner
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Make Study Plan
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Paste your syllabus, choose your exam date, and generate a
                  focused preparation roadmap.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[270px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Status
                </p>
                <p className="mt-1 text-sm font-extrabold text-white">
                  {planData ? "Generated" : "Ready"}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/70">
                  Powered By
                </p>
                <p className="mt-1 text-sm font-extrabold text-violet-100">
                  Classify AI
                </p>
              </div>
            </div>
          </div>
        </header>

        {!planData && (
          <main className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <aside className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                <WandSparkles className="h-7 w-7 text-violet-200" />
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Build a smarter plan from your syllabus
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                We recommend copying your syllabus exactly as provided by your
                teacher so the generated roadmap, topics and questions stay
                accurate.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-white">
                    <ClipboardList className="h-4 w-4 text-violet-300" />
                    Paste Syllabus
                  </div>
                  <p className="text-xs leading-5 text-slate-500">
                    Add units, topics, chapters or exam scope in one place.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-white">
                    <CalendarClock className="h-4 w-4 text-cyan-300" />
                    Pick Exam Date
                  </div>
                  <p className="text-xs leading-5 text-slate-500">
                    The planner can organize preparation around your deadline.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-white">
                    <Sparkles className="h-4 w-4 text-fuchsia-300" />
                    Generate Roadmap
                  </div>
                  <p className="text-xs leading-5 text-slate-500">
                    Get daily plan, important topics, roadmap and questions.
                  </p>
                </div>
              </div>
            </aside>

            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-violet-300">
                  Input Details
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-white">
                  Create your study plan
                </h2>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-300">
                    Syllabus
                  </span>

                  <textarea
                    placeholder="Paste your syllabus here..."
                    value={syllabus}
                    onChange={(e) => setSyllabus(e.target.value)}
                    rows={14}
                    className="min-h-[340px] w-full resize-none rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    We recommend copying your syllabus exactly as provided by
                    your teacher.
                  </p>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-300">
                    Exam Date
                  </span>

                  <input
                    id="examDate"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full rounded-[1.25rem] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    placeholder="📅 Exam Date"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Select the date of your final exam.
                  </p>
                </label>

                <button
                  disabled={loading}
                  onClick={handleGenerate}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Study Plan
                </button>
              </div>
            </section>
          </main>
        )}

        {planData && (
          <main className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <CalendarCheck className="h-5 w-5 text-violet-200" />
                  </div>

                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      Daily Study Plan
                    </h2>
                    <p className="text-xs text-slate-500">
                      Day-wise preparation roadmap
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-[950px] overflow-y-auto p-5">
                <ol className="space-y-4">
                  {Object.entries(planData.studyPlan).map(([day, content]) => (
                    <li
                      key={day}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 transition hover:border-violet-300/30 hover:bg-white/[0.065]"
                    >
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-300">
                        {day}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {content}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="grid gap-5">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-300/20 bg-fuchsia-500/10">
                    <Sparkles className="h-5 w-5 text-fuchsia-200" />
                  </div>

                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      Study Roadmap
                    </h2>
                    <p className="text-xs text-slate-500">
                      Overall preparation flow
                    </p>
                  </div>
                </div>

                <div className="max-h-[260px] overflow-y-auto p-5">
                  <ul className="space-y-3">
                    {planData.roadmap.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-extrabold text-violet-200">
                          {idx + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
                <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
                  <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                      <Lightbulb className="h-5 w-5 text-emerald-200" />
                    </div>

                    <div>
                      <h2 className="text-base font-extrabold text-white">
                        Important Topics
                      </h2>
                      <p className="text-xs text-slate-500">
                        Focus areas to revise
                      </p>
                    </div>
                  </div>

                  <div className="max-h-[260px] overflow-y-auto p-5">
                    <ul className="space-y-3">
                      {planData.importantTopics.map((topic, idx) => (
                        <li
                          key={idx}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300"
                        >
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
                  <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                      <ClipboardList className="h-5 w-5 text-cyan-200" />
                    </div>

                    <div>
                      <h2 className="text-base font-extrabold text-white">
                        Important Questions
                      </h2>
                      <p className="text-xs text-slate-500">
                        Practice these first
                      </p>
                    </div>
                  </div>

                  <div className="max-h-[260px] overflow-y-auto p-5">
                    <ol className="space-y-3">
                      {planData.importantQuestions.map((q, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300"
                        >
                          <span className="text-xs font-extrabold text-cyan-200">
                            {idx + 1}.
                          </span>
                          {q}
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>
              </div>
            </section>
          </main>
        )}
      </div>
    </section>
  );
};

export default StudyPlanPage;