"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";


const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] grid place-items-center overflow-hidden bg-[#08080C]/95 p-4 text-white backdrop-blur-2xl"
          onClick={onClose}
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
                  <AlertTriangle className="h-6 w-6 text-red-300" />
                </div>

                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-300">
                    Destructive Action
                  </span>

                  <h2
                    className="mt-3 text-xl font-extrabold tracking-tight text-white"
                  >
                    Confirm Deletion
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
                aria-label="Close confirmation modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative z-10 p-5 sm:p-6">
              <p className="text-sm leading-6 text-slate-400">
                {message ?? "Are you sure you want to delete this item?"}
              </p>

              <div className="mt-5 rounded-[1.5rem] border border-red-300/20 bg-red-500/10 p-4">
                <p className="text-xs font-semibold leading-5 text-red-100/75">
                  This action may permanently remove the selected record. Please
                  confirm only if you are sure.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:bg-white/[0.08]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-extrabold text-red-300 transition hover:-translate-y-0.5 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;