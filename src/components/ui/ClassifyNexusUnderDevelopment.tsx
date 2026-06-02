"use client";

import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarClock,
  ChevronLeft,
  Clock3,
  Code2,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: BrainCircuit,
    title: "Campus-Aware AI",
    description:
      "Nexus is being prepared to understand campus context, academics, subjects, resources and student workflows.",
  },
  {
    icon: MessageSquareText,
    title: "Secure AI Conversations",
    description:
      "A refined AI chat experience with markdown answers, better reasoning flow and safer academic responses.",
  },
  {
    icon: CalendarClock,
    title: "Timetable Intelligence",
    description:
      "Future-ready integration with HOD-created timetables, today’s classes and subject-specific schedules.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Aware Experience",
    description:
      "Student, teacher, assistant and admin workflows will stay separated with secure session-based identity.",
  },
  {
    icon: WandSparkles,
    title: "Study Tools Upgrade",
    description:
      "Planned improvements for summaries, study planning, PYQ help, doubts and personalized learning support.",
  },
  {
    icon: Code2,
    title: "Under Active Development",
    description:
      "This module is currently being upgraded and will be unlocked once the Nexus layer is stable.",
  },
];

export default function ClassifyNexusUnderDevelopment() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-28 top-16 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 shadow-lg shadow-violet-950/30">
                <Image
                  src="/only-logo.png"
                  alt="Classify AI"
                  width={38}
                  height={38}
                  className="h-9 w-9 object-contain drop-shadow-[0_0_18px_rgba(34,211,238,0.28)]"
                  priority
                />
              </div>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Classify Nexus
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  AI Study Assistant is getting upgraded
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                  We are rebuilding Classify Nexus into a smarter, safer and
                  more campus-aware academic AI layer. This module is currently
                  under active development.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-400/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400/10">
                  <Clock3 className="h-5 w-5 text-amber-200" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-100/70">
                    Status
                  </p>
                  <p className="text-sm font-extrabold text-amber-100">
                    Under Development
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="grid flex-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-fuchsia-500/5 to-cyan-400/8" />
            <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-cyan-300/20 bg-cyan-500/10">
                <Rocket className="h-8 w-8 text-cyan-200" />
              </div>

              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">
                Coming Soon
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Classify Nexus will be more than a chatbot.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                The current AI chat module is being upgraded into a deeper
                academic companion that can connect with study workflows,
                timetable context, resources, attendance insights and future
                campus intelligence features.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-2xl font-extrabold text-white">AI</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Academic assistant layer
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 p-4">
                  <p className="text-2xl font-extrabold text-violet-100">
                    RBAC
                  </p>
                  <p className="mt-1 text-xs font-semibold text-violet-200/70">
                    Role-aware experience
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-500/10 p-4">
                  <p className="text-2xl font-extrabold text-cyan-100">
                    Smart
                  </p>
                  <p className="mt-1 text-xs font-semibold text-cyan-200/70">
                    Campus intelligence
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/student")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.09] hover:text-white"
                >
                  Back to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/chat")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-5 py-3 text-sm font-extrabold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500/20"
                >
                  Open Campus Chat
                  <MessageSquareText className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-white/[0.055]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5 opacity-0 transition group-hover:opacity-100" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                      <Icon className="h-6 w-6 text-violet-200" />
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </main>

        <footer className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-xs font-semibold text-slate-500 backdrop-blur-xl">
          Classify Nexus is temporarily locked while we improve reliability,
          academic context and the premium AI experience.
        </footer>
      </div>
    </section>
  );
}