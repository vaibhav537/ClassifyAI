"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";

export default function CreateAssistantDialog({
  isOpen,
  onClose,
  onActionComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onActionComplete: () => void;
}) {
  const [assistantName, setAssistantName] = useState("");
  const [assistantEmail, setAssistantEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminID, setAdminID] = useState("admin123"); // default fallback

  useEffect(() => {
    const storedId = localStorage.getItem("adminId");
    if (storedId) {
      setAdminID(storedId);
    }
  }, []);

  const resetForm = () => {
    setAssistantName("");
    setAssistantEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      showErrorMessage("Admin ID not found. Please login again.");
      return;
    }
    setIsLoading(true);
    const toastID = showLoadingMessage("Creating assistant account...");

    try {
      const response = await fetch("/api/admin/add-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminID,
          assistantName,
          assistantEmail,
        }),
      });

      const data = await response.json();
      toastDissmisser(toastID);
      if (!response.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      showSuccessMessage("Assistant created successfully!");
      resetForm();
      onActionComplete();
      onClose();
    } catch (err: any) {
      toastDissmisser(toastID);
      showErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                New Campus Setup
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Create New Assistant
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                This will create a new Campus Admin account and send them a
                welcome email with valid ID.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-extrabold text-slate-300 transition hover:border-violet-300/35 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 scrollbar-hide sm:px-6">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101014]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                <div className="relative z-10 flex flex-col gap-5">
                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Assistant Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Assistant Full Name"
                      value={assistantName}
                      onChange={(e) => setAssistantName(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Assistant Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Assistant Email Address"
                      value={assistantEmail}
                      autoComplete="off"
                      onChange={(e) => setAssistantEmail(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>

                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
                    The new assistant will receive campus admin access after
                    successful account creation.
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col-reverse gap-3 border-t border-white/10 bg-[#14141B]/90 px-5 py-5 backdrop-blur-2xl sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating..." : "Create Campus"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
