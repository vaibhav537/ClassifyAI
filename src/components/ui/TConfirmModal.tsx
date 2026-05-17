"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function TConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 text-white backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent" />

          <div className="relative z-10 px-5 py-5 sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-200">
              Confirmation
            </span>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">{message}</p>
          </div>

          <div className="relative z-10 flex flex-col-reverse gap-3 border-t border-white/10 bg-[#14141B]/90 px-5 py-5 backdrop-blur-2xl sm:flex-row sm:justify-end sm:px-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-5 py-3 text-sm font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-extrabold text-red-200 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
