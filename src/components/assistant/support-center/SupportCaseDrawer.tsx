"use client";

import { SupportCaseDrawerProps } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Activity,
  HeartHandshake,
  MessageCircle,
  NotebookPen,
  PlusCircle,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";

type SupportCaseDetail = any;

function formatDate(value?: string | Date | null) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString();
}

function statusText(value?: string | null) {
  if (!value) return "N/A";
  return value.replaceAll("_", " ");
}

function getStudentName(caseDetail: SupportCaseDetail) {
  return caseDetail?.student?.user?.name || "Unknown Student";
}

function getSubjectName(caseDetail: SupportCaseDetail) {
  return caseDetail?.subject?.name || "Unknown Subject";
}

const SupportCaseDrawer = ({
  caseId,
  onClose,
  open,
}: SupportCaseDrawerProps) => {
  const [caseDetail, setCaseDetail] = useState<SupportCaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !caseId) return;

    const fetchCaseDetail = async () => {
      try {
        setCaseDetail(null);
        setIsLoading(true);
        setError("");

        const res = await fetch(`/api/support/cases/detail?caseId=${caseId}`);
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(
            result.error || result.message || "Failed to load case detail",
          );
        }

        setCaseDetail(result.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load support case detail.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseDetail();
  }, [open, caseId]);

  if (!open) return null;

  const conversationId = caseDetail?.circleOfCareGroup?.conversationId;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/80 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close support case drawer overlay"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="relative z-10 h-full w-full max-w-xl overflow-hidden border-l border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-amber-400/6" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-400/8 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                <HeartHandshake className="h-3.5 w-3.5" />
                Case Detail
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Support Case Overview
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Case ID:{" "}
                <span className="font-bold text-violet-200">
                  {caseId || "N/A"}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 scrollbar-hide sm:px-6">
            {isLoading && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-sm text-zinc-400">
                Loading case details...
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
                {error}
              </div>
            )}

            {!isLoading && !error && !caseDetail && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-sm text-zinc-400">
                No case details found.
              </div>
            )}

            {!isLoading && !error && caseDetail && (
              <>
                <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-amber-400/5" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                        <UserRound className="h-5 w-5 text-violet-200" />
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-white">
                          Student & Case Summary
                        </h3>
                        <p className="text-xs text-slate-500">
                          Profile, case status and subject context
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Student
                        </p>
                        <p className="mt-1 text-lg font-extrabold text-white">
                          {getStudentName(caseDetail)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {caseDetail.student?.user?.email || "No email found"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                          <p className="text-xs text-slate-500">Roll No</p>
                          <p className="mt-1 font-semibold text-slate-200">
                            {caseDetail.student?.rollNumber || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                          <p className="text-xs text-slate-500">Subject</p>
                          <p className="mt-1 font-semibold text-slate-200">
                            {getSubjectName(caseDetail)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                          <p className="text-xs text-slate-500">Priority</p>
                          <p className="mt-1 font-semibold text-amber-200">
                            {caseDetail.priority || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                          <p className="text-xs text-slate-500">Status</p>
                          <p className="mt-1 font-semibold text-violet-200">
                            {statusText(caseDetail.status)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                        <p className="text-xs text-slate-500">Case Title</p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-200">
                          {caseDetail.title || "Support case"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/8 via-transparent to-amber-400/5" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
                        <ShieldAlert className="h-5 w-5 text-red-300" />
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-white">
                          Risk Event
                        </h3>
                        <p className="text-xs text-slate-500">
                          Attendance signal that created this support case
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-white">
                      {caseDetail.riskEvent?.title ||
                        caseDetail.title ||
                        "Attendance risk detected"}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {caseDetail.riskEvent?.description ||
                        "No detailed risk description available."}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                        <p className="text-xs text-slate-500">Severity</p>
                        <p className="mt-1 font-semibold text-red-200">
                          {caseDetail.riskEvent?.severity || "N/A"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                        <p className="text-xs text-slate-500">Risk Status</p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {statusText(caseDetail.riskEvent?.status)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                        <p className="text-xs text-slate-500">Value</p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {caseDetail.riskEvent?.currentValue ?? "N/A"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                        <p className="text-xs text-slate-500">Threshold</p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {caseDetail.riskEvent?.threshold ?? "N/A"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600">
                      Detected at: {formatDate(caseDetail.riskEvent?.detectedAt)}
                    </p>
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-violet-500/8" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                        <HeartHandshake className="h-5 w-5 text-emerald-300" />
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-white">
                          Circle of Care
                        </h3>
                        <p className="text-xs text-slate-500">
                          Support group created for intervention workflow
                        </p>
                      </div>
                    </div>

                    {caseDetail.circleOfCareGroup ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                            <p className="text-xs text-slate-500">
                              Group Status
                            </p>
                            <p className="mt-1 font-semibold text-emerald-200">
                              {statusText(caseDetail.circleOfCareGroup.status)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                            <p className="text-xs text-slate-500">
                              Conversation
                            </p>
                            <p className="mt-1 truncate font-semibold text-slate-200">
                              {conversationId || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                          <p className="text-xs text-slate-500">Reason</p>
                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            {caseDetail.circleOfCareGroup.reason ||
                              "No reason available."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-4 text-sm text-slate-500">
                        No Circle of Care group linked yet.
                      </p>
                    )}
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-violet-500/8" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                        <Activity className="h-5 w-5 text-emerald-300" />
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-white">
                          Timeline
                        </h3>
                        <p className="text-xs text-slate-500">
                          Follow-up actions and case progress
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {caseDetail.activityLogs?.length ? (
                        caseDetail.activityLogs.map((log: any) => (
                          <div
                            key={log.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                          >
                            <p className="text-sm font-bold text-white">
                              {log.title || "Activity"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {log.actor?.name || "SYSTEM"} ·{" "}
                              {formatDate(log.createdAt)}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {log.description || "No description available."}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-4 text-sm text-slate-500">
                          No activity logs yet.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-violet-500/8" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/10">
                        <NotebookPen className="h-5 w-5 text-amber-300" />
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-white">
                          Notes
                        </h3>
                        <p className="text-xs text-slate-500">
                          Support comments and follow-up notes
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {caseDetail.notes?.length ? (
                        caseDetail.notes.map((note: any) => (
                          <div
                            key={note.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                          >
                            <p className="text-sm leading-6 text-slate-300">
                              {note.note}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              {note.author?.name || "SYSTEM"} ·{" "}
                              {formatDate(note.createdAt)}
                            </p>
                            {note.isInternal && (
                              <span className="mt-3 inline-flex rounded-full border border-amber-300/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                                Internal
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-4 text-sm text-slate-500">
                          No support notes yet.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/8 via-transparent to-amber-400/5" />

                  <div className="relative z-10 flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
                      <ShieldAlert className="h-5 w-5 text-red-300" />
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        Intervention Context
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        This case is part of the attendance-triggered Circle of
                        Care workflow. Support center can review attendance
                        risk, add follow-up notes, and coordinate with the
                        assigned teacher before the issue becomes too late.
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>

          <div className="border-t border-white/10 bg-[#14141B]/90 px-5 py-5 backdrop-blur-2xl sm:px-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!caseDetail || isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <PlusCircle className="h-4 w-4" />
                Add Note
              </button>

              <button
                type="button"
                disabled={!conversationId || isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-5 py-3 text-sm font-extrabold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/45 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <MessageCircle className="h-4 w-4" />
                Open Circle Chat
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SupportCaseDrawer;