"use client";

import { SupportRequest } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";

const ContactRequestsSection = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<SupportRequest | null>(null);

  // 1. ADD STATE to store the campusId
  const [campusId, setCampusId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("CampusID");
    setCampusId(id);
  }, []);

  useEffect(() => {
    if (!campusId) return;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/assistant/settings/contact-requests?campusId=${campusId}`,
        );
        const data = await res.json();
        if (res.ok) {
          setRequests(data.requests);
        } else {
          throw new Error(data.error || "Failed to fetch requests.");
        }
      } catch (err: any) {
        showErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [campusId]);

  const handleDelete = async (id: string) => {
    if (!campusId) {
      showErrorMessage("Could not verify campus. Please refresh.");
      return;
    }
    showLoadingMessage("Deleting request...");
    try {
      const res = await fetch(`/api/assistant/settings/contact-requests`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id, campusId: campusId }),
      });
      const data = await res.json();
      if (res.ok) {
        showSuccessMessage("Request deleted.");
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setSelected(null);
      } else {
        throw new Error(data.error || "Failed to delete request.");
      }
    } catch (err: any) {
      showErrorMessage(err.message);
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
            Inbox Desk
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Contact Requests
              </motion.h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Review support messages submitted from your campus contact flow.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-4 py-2 text-xs font-extrabold text-cyan-200">
              {requests.length} {requests.length === 1 ? "Request" : "Requests"}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid flex-1 place-items-center"
            >
              <div className="w-full max-w-3xl space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="h-5 w-40 rounded-full bg-white/10" />
                      <div className="h-4 w-24 rounded-full bg-white/10" />
                    </div>
                    <div className="h-4 w-full rounded-full bg-white/10" />
                    <div className="mt-2 h-4 w-2/3 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : requests.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid flex-1 place-items-center"
            >
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
                <div className="relative z-10">
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-xl font-extrabold text-violet-200">
                    0
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    No contact requests yet.
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    New support messages will appear here when students,
                    teachers, or visitors contact the campus team.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide"
            >
              <div className="grid w-full grid-cols-1 gap-4">
                <AnimatePresence>
                  {requests.map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      onClick={() => setSelected(req)}
                      className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101014]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055]"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-80" />

                      <div className="relative z-10 flex flex-col gap-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-extrabold text-white transition group-hover:text-violet-100">
                              {req.name}
                            </h3>
                            <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                              {req.email}
                            </p>
                          </div>

                          <span className="inline-flex w-fit shrink-0 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 text-xs font-extrabold text-violet-200">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="line-clamp-2 text-sm leading-6 text-slate-400">
                          {req.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />

              <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                    Contact Message
                  </div>

                  <h3 className=" truncate text-2xl font-extrabold text-white">
                    {selected.name}
                  </h3>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-500">
                    {selected.email}
                  </p>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-extrabold text-slate-300 transition hover:border-violet-300/35 hover:bg-white/[0.08] hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 py-5 scrollbar-hide sm:px-6">
                <div className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-extrabold text-cyan-200">
                  {new Date(selected.createdAt).toLocaleString()}
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-[#08080C]/55 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                    {selected.message}
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex flex-col-reverse gap-3 border-t border-white/10 bg-[#14141B]/90 px-5 py-5 backdrop-blur-2xl sm:flex-row sm:justify-end sm:px-6">
                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Close
                </button>

                <button
                  onClick={() => handleDelete(selected.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-extrabold text-red-200 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20"
                >
                  Delete
                </button>

                <a
                  href={`mailto:${selected.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-5 py-3 text-sm font-extrabold text-cyan-200 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-cyan-500/20"
                >
                  Reply via Email
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default ContactRequestsSection;
