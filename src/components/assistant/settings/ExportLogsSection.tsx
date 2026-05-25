"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";

export default function ExportLogsSection() {
  const [type, setType] = useState<"all" | "login">("all");
  const [loading, setLoading] = useState(false);
  const [campusId, setCampusId] = useState<string | null>(null);
  useEffect(() => {
    const id = localStorage.getItem("CampusID");
    setCampusId(id);
  }, []);

  const handleExport = async () => {
    if (!campusId) {
      showErrorMessage("Could not identify your campus. Please log in again.");
      return;
    }

    setLoading(true);
    showLoadingMessage("Preparing your download...");

    try {
      const res = await fetch(
        `/api/assistant/settings/logs/export?type=${type}&campusId=${campusId}`,
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to export logs.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}-logs-${campusId}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccessMessage(
        `${type === "login" ? "Login" : "All"} logs exported successfully.`,
      );
    } catch (err: any) {
      showErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative min-h-[75vh] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(75vh-3rem)] flex-col gap-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
            Data Export
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Export Activity Logs
              </motion.h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Download campus activity logs as a CSV file for audits,
                reporting, or offline record keeping.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-4 py-2 text-xs font-extrabold text-cyan-200">
              CSV Download
            </div>
          </div>
        </div>

        <div className="grid flex-1 place-items-center">
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101014]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                  Export Target
                </p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                  Choose log category
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Select whether you want the full activity archive or only
                  login-specific records.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Current Selection
                  </span>
                  <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs font-extrabold text-violet-200">
                    {type === "login" ? "Login Logs" : "All Logs"}
                  </span>
                </div>

                <motion.select
                  value={type}
                  onChange={(e) => setType(e.target.value as "all" | "login")}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="all" className="bg-neutral-900 text-white">
                    All Logs
                  </option>
                  <option value="login" className="bg-neutral-900 text-white">
                    Only Login Logs
                  </option>
                </motion.select>
              </div>

              <div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
                Exported files are generated for the active campus and saved
                with a campus-specific filename.
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={loading}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Exporting…"
                  : `Export ${type === "login" ? "Login" : "All"} Logs`}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
