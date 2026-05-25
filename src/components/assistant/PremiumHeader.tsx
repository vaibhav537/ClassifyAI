"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  Crown,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";


const PremiumHeader = ({
  totalPremiumStudents,
}: {
  totalPremiumStudents: number;
}) => {
  const [loading, setLoading] = useState(false);

  const handleSendReports = async () => {
    setLoading(true);
    showLoadingMessage("Sending reports...");

    const campus = localStorage.getItem("CampusID");
    const assistant = localStorage.getItem("assistantId");

    console.log("Sending with IDs:", { campus, assistant });

    if (!campus || !assistant) {
      showErrorMessage(
        "Could not verify assistant identity. Please log in again.",
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/mail/send-monthly-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campusId: campus,
          adminId: assistant,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccessMessage(data.message || "Reports sent successfully.");
      } else {
        showErrorMessage(data.error || "Failed to send reports.");
      }
    } catch (err) {
      showErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
            <Crown className="h-3.5 w-3.5" />
            Premium Control
          </span>

          <h1
            className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl "
          >
            Premium Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Track premium users, monitor subscription activity, and send monthly
            reports from the assistant console.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
                Premium Users
              </p>
              <p className="text-sm font-extrabold text-emerald-100">
                {totalPremiumStudents} Active
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendReports}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {loading ? "Sending…" : "Send Monthly Reports"}
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-5 rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <Sparkles className="h-4 w-4 text-violet-200" />
          </div>

          <div>
            <p className="text-sm font-extrabold text-white">
              Monthly Report Automation
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Sends premium reports using the current campus and assistant
              identity.
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default PremiumHeader;