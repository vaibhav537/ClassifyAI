"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, ShieldAlert, X } from "lucide-react";

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

const PremiumCancelModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  message?: string;
  loading?: boolean;
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setReason("");
    }
  }, [isOpen]);

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] grid h-[100dvh] w-[100dvw] place-items-center overflow-hidden bg-[#08080C]/95 p-4 text-white backdrop-blur-2xl"
            onClick={loading ? undefined : onClose}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.10),transparent_30%),radial-gradient(circle_at_center,rgba(217,70,239,0.04),transparent_38%)]" />
            <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-violet-500/8" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/45 to-transparent" />

              <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.35rem] border border-red-300/20 bg-red-500/10">
                    <ShieldAlert className="h-6 w-6 text-red-300" />
                  </div>

                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-300">
                      Premium Action
                    </span>

                    <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white ">
                      Confirm Plan Change
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Close premium cancellation modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative z-10 p-5 sm:p-6">
                <p className="text-sm leading-6 text-slate-400">
                  {message ??
                    "Are you sure you want to cancel this user's plan?"}
                </p>

                <div className="mt-5 rounded-[1.5rem] border border-red-300/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                    <p className="text-xs font-semibold leading-5 text-red-100/75">
                      This may change the user&apos;s premium access
                      immediately. Add a clear reason before confirming.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Reason
                  </label>

                  <textarea
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#08080C]/65 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-red-300/40 focus:bg-[#08080C]/85 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Reason for cancellation or downgrade"
                    rows={4}
                    value={reason}
                    disabled={loading}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end sm:p-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => onConfirm(reason)}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-extrabold text-red-300 transition hover:-translate-y-0.5 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  {loading ? "Processing…" : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
};

export default PremiumCancelModal;
