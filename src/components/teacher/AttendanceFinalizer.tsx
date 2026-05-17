"use client";

import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  TimerReset,
  ShieldAlert,
  Radio,
  Lock,
} from "lucide-react";

export default function AttendanceFinalizer({
  classSessionId,
  onClose,
}: {
  classSessionId: string;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleFinalize = async () => {
    setIsLoading(true);
    showLoadingMessage("Finalizing attendance...");

    try {
      const response = await fetch("/api/attendance/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classSessionId }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      showSuccessMessage(data.message);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      showErrorMessage(err.message || "An error occurred.");
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999999] h-dvh w-full overflow-hidden bg-[#08080C]/95 text-white backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_32%),radial-gradient(circle_at_center,rgba(239,68,68,0.06),transparent_36%)]" />
        <div className="pointer-events-none fixed -left-24 top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/14 via-violet-500/8 to-red-500/8" />
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/12 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

              <div className="relative z-10 mx-auto max-w-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-amber-300/20 bg-amber-500/10 shadow-xl shadow-amber-950/20 sm:h-20 sm:w-20">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-amber-200 sm:h-10 sm:w-10" />
                  ) : (
                    <TimerReset className="h-8 w-8 text-amber-200 sm:h-10 sm:w-10" />
                  )}
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-200 sm:mt-5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Attendance Window Closed
                </div>

                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Finalize Attendance Session
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  The attendance window has closed. Confirm finalization to mark
                  all remaining students as{" "}
                  <span className="font-extrabold text-red-300">absent</span>.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:mt-6">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                    <TimerReset className="mx-auto h-5 w-5 text-amber-200" />
                    <p className="mt-2 text-sm font-extrabold text-white">
                      Time&apos;s Up
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Timer ended
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-red-300/20 bg-red-500/10 p-3 sm:p-4">
                    <ShieldAlert className="mx-auto h-5 w-5 text-red-300" />
                    <p className="mt-2 text-sm font-extrabold text-white">
                      Absentees
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Pending mark
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 p-3 sm:p-4">
                    <Lock className="mx-auto h-5 w-5 text-violet-200" />
                    <p className="mt-2 text-sm font-extrabold text-white">
                      Locked
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Action needed
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinalize}
                  disabled={isLoading}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[260px] lg:mt-6"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {isLoading ? "Processing..." : "Yes, Mark Absentees"}
                </button>
              </div>
            </section>

            <aside className="relative hidden min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:block lg:self-center">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-amber-400/8" />

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/10">
                  <Radio className="h-5 w-5 text-amber-200" />
                </div>

                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-white">
                  Finalizer Active
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Dashboard is blocked until this attendance session is
                  finalized.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                      Session Status
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-amber-200">
                      Awaiting Finalization
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                      Action Required
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-red-300">
                      Mark remaining absent
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-500/10 px-4 py-3">
                  <p className="text-xs leading-5 text-amber-100/80">
                    Complete this step to unlock the dashboard.
                  </p>
                </div>
              </div>
            </aside>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
