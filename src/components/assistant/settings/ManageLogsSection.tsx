"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";

export default function ManageLogsSection() {
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [loginLogs, setLoginLogs] = useState<number>(0);
  const [deleteCount, setDeleteCount] = useState<number>(0); // Default to a reasonable number
  const [type, setType] = useState<"all" | "login">("all");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // 1. ADD STATE to store the campusId
  const [campusId, setCampusId] = useState<string | null>(null);

  useEffect(() => {
    // 2. GET the campusId from localStorage when the component mounts
    const id = localStorage.getItem("CampusID");
    setCampusId(id);
  }, []);

  // 3. This effect now depends on campusId to run
  useEffect(() => {
    // Don't run the fetch if we don't have a campusId yet
    if (!campusId) return;

    const fetchLogCounts = async () => {
      setInitialLoad(true);
      try {
        // 4. SEND the campusId with the API request
        const res = await fetch(
          `/api/assistant/settings/logs?campusId=${campusId}`,
        );
        const data = await res.json();
        if (res.ok) {
          setTotalLogs(data.totalCount);
          setLoginLogs(data.loginCount);
        } else {
          throw new Error(data.error || "Failed to fetch log counts.");
        }
      } catch (err: any) {
        showErrorMessage(err.message);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchLogCounts();
  }, [campusId]); // Re-fetch if campusId changes

  const handleDeleteLogs = async () => {
    if (deleteCount <= 0) {
      showErrorMessage("Please enter a positive number of logs to delete.");
      return;
    }
    // 5. Ensure we have the campusId before trying to delete
    if (!campusId) {
      showErrorMessage("Could not identify the campus. Please refresh.");
      return;
    }

    setLoading(true);
    showLoadingMessage(`Deleting ${deleteCount} ${type} logs...`);
    try {
      const res = await fetch("/api/assistant/settings/logs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // 6. SEND the campusId in the request body
        body: JSON.stringify({ count: deleteCount, type, campusId }),
      });

      const data = await res.json();
      if (res.ok) {
        showSuccessMessage(`${data.deleted} logs deleted successfully.`);
        // Refresh counts after deletion
        if (type === "all") {
          setTotalLogs((prev) => prev - data.deleted);
          // A simple refresh is easier than complex state logic
          const loginRes = await fetch(
            `/api/assistant/settings/logs?campusId=${campusId}`,
          );
          const loginData = await loginRes.json();
          setLoginLogs(loginData.loginCount);
        } else {
          setLoginLogs((prev) => prev - data.deleted);
          setTotalLogs((prev) => prev - data.deleted);
        }
        setDeleteCount(10);
      } else {
        throw new Error(data.error || "Failed to delete logs.");
      }
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // The rest of your UI and animations remain exactly the same
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
            System Audit
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Manage Activity Logs
              </motion.h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor system activity and safely clear old audit entries from
                your campus workspace.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/20 bg-amber-500/10 px-4 py-2 text-xs font-extrabold text-amber-200">
              Cleanup Mode
            </div>
          </div>
        </div>

        {initialLoad ? (
          <div className="grid flex-1 place-items-center">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="h-11 w-11 animate-spin rounded-full border-4 border-violet-300/20 border-t-violet-300" />
                <p className="text-sm font-bold text-slate-400">
                  Loading activity logs…
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              /* ... */
            >
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
                <div className="relative z-10">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                    Total Logs
                  </p>
                  <p className="mt-3 text-4xl font-extrabold tracking-tight text-white">
                    {totalLogs}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Complete audit records stored for this campus.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-400/5" />
                <div className="relative z-10">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                    Login Logs
                  </p>
                  <p className="mt-3 text-4xl font-extrabold tracking-tight text-white">
                    {loginLogs}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Login-specific entries available for cleanup.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
              className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"
              /* ... */
            >
              <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101014]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-400/5" />

                <div className="relative z-10 flex flex-col gap-5">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                      Delete Target
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Choose the log category and number of entries to remove.
                    </p>
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

                  <motion.input
                    type="number"
                    placeholder="Number of logs to delete"
                    min={1}
                    value={deleteCount || ""}
                    onChange={(e) => setDeleteCount(Number(e.target.value))}
                    className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                  />

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteLogs}
                    disabled={loading}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-extrabold text-red-200 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Deleting…"
                      : `Delete ${deleteCount} ${
                          type === "login" ? "Login" : ""
                        } Logs`}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
}
