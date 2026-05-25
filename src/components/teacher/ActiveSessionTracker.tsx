"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Radio, Timer, X, ShieldCheck, Activity } from "lucide-react";

export default function ActiveSessionTracker({
  durationInSeconds,
  onTimerEnd,
}: {
  durationInSeconds: number;
  onTimerEnd: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set flag in localStorage when component mounts
  useEffect(() => {
    setMounted(true);
    localStorage.setItem("activeAttendanceSession", "true");

    return () => {
      // Remove flag when component unmounts
      localStorage.removeItem("activeAttendanceSession");
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimerEnd();
      localStorage.removeItem("activeAttendanceSession"); // Remove flag when timer ends
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimerEnd]);

  useEffect(() => {
    if (!mounted || !isDialogOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mounted, isDialogOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            className="fixed inset-0 z-[999999] h-dvh w-full overflow-hidden bg-[#08080C]/95 text-white backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_32%),radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_36%)]" />
            <div className="pointer-events-none fixed -left-24 top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none fixed -right-24 bottom-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden p-3 sm:p-5 lg:p-6">
              <motion.div
                className="grid max-h-full w-full max-w-6xl min-w-0 gap-4 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <section className="relative max-h-full min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 p-5 text-center shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-6 lg:p-8">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/14 via-violet-500/8 to-cyan-400/8" />
                  <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/12 blur-3xl" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />

                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-400 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
                    aria-label="Minimize timer"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="relative z-10 mx-auto max-w-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 shadow-xl shadow-emerald-950/20 sm:h-20 sm:w-20">
                      <Radio className="h-8 w-8 animate-pulse text-emerald-300 sm:h-10 sm:w-10" />
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-200 sm:mt-5">
                      <Clock3 className="h-3.5 w-3.5" />
                      Live Attendance Session
                    </div>

                    <p className="mt-5 font-mono text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
                      {String(minutes).padStart(2, "0")}:
                      {String(seconds).padStart(2, "0")}
                    </p>

                    <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">
                      Time Remaining
                    </p>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
                      Attendance session is currently live. Keep this session
                      active until the timer ends.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:mt-6">
                      <div className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 p-3 sm:p-4">
                        <Activity className="mx-auto h-5 w-5 text-emerald-300" />
                        <p className="mt-2 text-sm font-extrabold text-white">
                          Session Live
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Accepting marks
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-500/10 p-3 sm:p-4">
                        <Clock3 className="mx-auto h-5 w-5 text-amber-200" />
                        <p className="mt-2 text-sm font-extrabold text-white">
                          Timer Running
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Auto finalizer
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 p-3 sm:p-4">
                        <ShieldCheck className="mx-auto h-5 w-5 text-violet-200" />
                        <p className="mt-2 text-sm font-extrabold text-white">
                          Safe Tracking
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Flag enabled
                        </p>
                      </div>
                    </div>

                    <div className="mx-auto mt-5 max-w-xl rounded-[1.5rem] border border-amber-300/20 bg-amber-500/10 p-3 sm:p-4">
                      <p className="text-sm font-bold text-amber-100">
                        Do not logout until the timer ends.
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-100/60">
                        Keep this session active so attendance can be finalized
                        correctly.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-800/30 sm:w-auto sm:min-w-[240px] lg:mt-6"
                    >
                      <Timer className="h-4 w-4" />
                      Minimize Timer
                    </button>
                  </div>
                </section>

                <aside className="relative hidden min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:block lg:self-center">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-400/8" />

                  <div className="relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                      <Radio className="h-5 w-5 animate-pulse text-emerald-300" />
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold tracking-tight text-white">
                      Live Tracker Active
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Minimize this full-screen tracker and continue using the
                      dashboard while the timer keeps running.
                    </p>

                    <div className="mt-5 space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                          Current Timer
                        </p>
                        <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-200">
                          {String(minutes).padStart(2, "0")}:
                          {String(seconds).padStart(2, "0")}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                          Session Status
                        </p>
                        <p className="mt-1 text-sm font-extrabold text-emerald-300">
                          Accepting Attendance
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
                      <p className="text-xs leading-5 text-emerald-100/80">
                        When minimized, a small floating timer stays visible.
                      </p>
                    </div>
                  </div>
                </aside>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isDialogOpen && (
          <motion.button
            type="button"
            className="fixed bottom-4 right-4 z-[999999] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-emerald-300/20 bg-[#14141B]/95 px-4 py-3 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl sm:bottom-6 sm:right-6"
            initial={{ scale: 0.8, opacity: 0, x: 24, y: 24 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: 24, y: 24 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/16 via-violet-500/8 to-cyan-400/8" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                <Radio className="h-5 w-5 animate-pulse text-emerald-300" />
              </div>

              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200/70">
                  Live Session
                </p>
                <p className="font-mono text-lg font-extrabold text-white">
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </p>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
