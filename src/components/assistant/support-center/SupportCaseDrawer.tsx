"use client";

import { SupportCaseDetail, SupportCaseDrawerProps } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  HeartHandshake,
  Loader2,
  MessageCircle,
  NotebookPen,
  PlusCircle,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";
import {
  formatDate,
  getStudentName,
  getSubjectName,
  statusText,
  SUPPORT_CASE_STATUSES,
} from "@/lib/helper";
import { InfoCard } from "./InfoCard";
import { SectionCard } from "./SectionCard";

const SupportCaseDrawer = ({
  caseId,
  onClose,
  open,
}: SupportCaseDrawerProps) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [noteText, setNoteText] = useState<string>("");
  const [isInternalNote, setIsInternalNote] = useState<boolean>(true);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [caseDetail, setCaseDetail] = useState<SupportCaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchCaseDetail = useCallback(
    async (silent = false) => {
      if (!caseId) return;

      try {
        if (!silent) {
          setCaseDetail(null);
          setIsLoading(true);
        }

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
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [caseId],
  );

  const handleUpdateStatus = async () => {
    if (!caseId || !selectedStatus) return;

    try {
      setIsUpdatingStatus(true);
      setActionError("");
      setActionSuccess("");

      const actorId =
        localStorage.getItem("UserID") ||
        localStorage.getItem("AssistantID") ||
        localStorage.getItem("assistantId") ||
        localStorage.getItem("userId");

      const res = await fetch("/api/support/cases", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseId,
          status: selectedStatus,
          actorId: actorId || null,
          note: statusNote.trim() || null,
          isInternalNote: true,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || result.error || "Failed to update case status",
        );
      }

      setStatusNote("");
      setSelectedStatus("");
      setActionSuccess("Support case status updated successfully.");

      await fetchCaseDetail(true);
    } catch (error) {
      console.error(error);
      setActionError("Unable to update support case status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!caseId || !noteText.trim()) return;

    try {
      setIsAddingNote(true);
      setActionError("");
      setActionSuccess("");

      const actorId =
        localStorage.getItem("UserID") ||
        localStorage.getItem("AssistantID") ||
        localStorage.getItem("assistantId") ||
        localStorage.getItem("userId");

      const res = await fetch("/api/support/cases/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseId,
          actorId: actorId || null,
          note: noteText.trim(),
          isInternalNote,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || result.error || "Failed to add note");
      }

      setNoteText("");
      setActionSuccess("Support note added successfully.");

      await fetchCaseDetail(true);
    } catch (error) {
      console.error(error);
      setActionError("Unable to add support note.");
    } finally {
      setIsAddingNote(false);
    }
  };

  useEffect(() => {
    if (!open || !caseId) return;

    setNoteText("");
    setActionError("");
    setActionSuccess("");
    setIsInternalNote(true);
    setSelectedStatus("");
    setStatusNote("");

    fetchCaseDetail();
  }, [open, caseId, fetchCaseDetail]);

  if (!open) return null;

  const conversationId = caseDetail?.circleOfCareGroup?.conversationId;
  const isCaseClosed = caseDetail?.status === "CLOSED";
  const isCaseResolved = caseDetail?.status === "RESOLVED";

  const isStatusOptionDisabled = (status: string) => {
    if (!caseDetail) return true;
    if (status === caseDetail.status) return true;
    if (isCaseClosed) return true;
    if (
      isCaseResolved &&
      [
        "OPEN",
        "IN_REVIEW",
        "CONTACTED_STUDENT",
        "WAITING_FOR_RESPONSE",
        "ESCALATED",
      ].includes(status)
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/80 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close support case drawer overlay"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="relative z-10 h-full w-full max-w-2xl overflow-hidden border-l border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-cyan-400/6" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/8 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="shrink-0 border-b border-white/10 bg-[#14141B]/85 px-5 py-5 backdrop-blur-2xl sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                  <HeartHandshake className="h-3.5 w-3.5" />
                  Circle of Care Detail
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  Support Case Overview
                </h2>

                <p className="mt-2 max-w-md truncate text-sm leading-6 text-slate-500">
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
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 scrollbar-hide sm:px-6">
            {isLoading && (
              <div className="grid min-h-[320px] place-items-center rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-6 text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-300" />
                  </div>
                  <p className="mt-4 text-sm font-extrabold text-white">
                    Loading case details...
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Fetching student, risk event and Circle of Care data.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-[1.75rem] border border-red-300/20 bg-red-500/10 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                  <div>
                    <p className="text-sm font-extrabold text-red-200">
                      Unable to load case
                    </p>
                    <p className="mt-1 text-sm leading-6 text-red-100/70">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && !caseDetail && (
              <div className="rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 text-sm text-slate-500">
                No case details found.
              </div>
            )}

            {!isLoading && !error && caseDetail && (
              <>
                <SectionCard
                  icon={<UserRound className="h-5 w-5 text-violet-200" />}
                  title="Student & Case Summary"
                  subtitle="Profile, case status and subject context"
                >
                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Student
                      </p>
                      <p className="mt-2 text-lg font-extrabold text-white">
                        {getStudentName(caseDetail)}
                      </p>
                      <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                        {caseDetail.student?.user?.email || "No email found"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InfoCard
                        label="Roll No"
                        value={caseDetail.student?.rollNumber || "N/A"}
                      />
                      <InfoCard
                        label="Subject"
                        value={getSubjectName(caseDetail)}
                      />
                      <InfoCard
                        label="Priority"
                        value={caseDetail.priority || "N/A"}
                        tone="amber"
                      />
                      <InfoCard
                        label="Status"
                        value={statusText(caseDetail.status)}
                        tone="violet"
                      />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Case Title
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-200">
                        {caseDetail.title || "Support case"}
                      </p>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<ShieldAlert className="h-5 w-5 text-red-300" />}
                  title="Risk Event"
                  subtitle="Attendance signal that created this support case"
                  glow="red"
                >
                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-sm font-extrabold text-white">
                        {caseDetail.riskEvent?.title ||
                          caseDetail.title ||
                          "Attendance risk detected"}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {caseDetail.riskEvent?.description ||
                          "No detailed risk description available."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InfoCard
                        label="Severity"
                        value={caseDetail.riskEvent?.severity || "N/A"}
                        tone="red"
                      />
                      <InfoCard
                        label="Risk Status"
                        value={statusText(caseDetail.riskEvent?.status)}
                      />
                      <InfoCard
                        label="Value"
                        value={caseDetail.riskEvent?.currentValue ?? "N/A"}
                      />
                      <InfoCard
                        label="Threshold"
                        value={caseDetail.riskEvent?.threshold ?? "N/A"}
                      />
                    </div>

                    <p className="text-xs leading-5 text-slate-600">
                      Detected at:{" "}
                      <span className="font-bold text-slate-500">
                        {formatDate(caseDetail.riskEvent?.detectedAt)}
                      </span>
                    </p>
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<HeartHandshake className="h-5 w-5 text-emerald-300" />}
                  title="Circle of Care"
                  subtitle="Support group created for intervention workflow"
                  glow="emerald"
                >
                  {caseDetail.circleOfCareGroup ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <InfoCard
                          label="Group Status"
                          value={statusText(
                            caseDetail.circleOfCareGroup.status,
                          )}
                          tone="emerald"
                        />
                        <InfoCard
                          label="Conversation"
                          value={conversationId || "N/A"}
                        />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                          Reason
                        </p>
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
                </SectionCard>

                <SectionCard
                  icon={<Activity className="h-5 w-5 text-emerald-300" />}
                  title="Timeline"
                  subtitle="Follow-up actions and case progress"
                  glow="emerald"
                >
                  <div className="space-y-3">
                    {caseDetail.activityLogs?.length ? (
                      caseDetail.activityLogs.map((log: any) => (
                        <div
                          key={log.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                        >
                          <p className="text-sm font-extrabold text-white">
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
                </SectionCard>

                <SectionCard
                  icon={<NotebookPen className="h-5 w-5 text-amber-300" />}
                  title="Notes"
                  subtitle="Support comments and follow-up notes"
                  glow="amber"
                >
                  <div className="mb-4 space-y-3">
                    <textarea
                      value={noteText}
                      onChange={(e) => {
                        setNoteText(e.target.value);
                        setActionSuccess("");
                        setActionError("");
                      }}
                      placeholder={
                        isCaseClosed
                          ? "Closed cases cannot receive new notes."
                          : "Write a follow-up note..."
                      }
                      disabled={isAddingNote || isLoading || isCaseClosed}
                      className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-slate-400">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        disabled={isAddingNote || isLoading || isCaseClosed}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-white/20 bg-[#08080C] text-violet-500 focus:ring-violet-500 disabled:cursor-not-allowed"
                      />
                      Internal support note
                    </label>

                    {actionError && (
                      <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-3 text-xs font-bold text-red-300">
                        {actionError}
                      </div>
                    )}

                    {actionSuccess && (
                      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-300">
                        {actionSuccess}
                      </div>
                    )}
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
                            <span className="mt-3 inline-flex rounded-full border border-amber-300/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-200">
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
                </SectionCard>

                <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-amber-400/5" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                        <Activity className="h-5 w-5 text-violet-200" />
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-white">
                          Status Actions
                        </h3>
                        <p className="text-xs text-slate-500">
                          Update support case progress and resolution state
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <select
                        value={selectedStatus}
                        disabled={isUpdatingStatus || isLoading || isCaseClosed}
                        onChange={(e) => {
                          setSelectedStatus(e.target.value);
                          setActionSuccess("");
                          setActionError("");
                        }}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-violet-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option className="bg-zinc-950" value="">
                          Select new status
                        </option>

                        {SUPPORT_CASE_STATUSES.map((status) => (
                          <option
                            className="bg-zinc-950"
                            key={status}
                            value={status}
                            disabled={isStatusOptionDisabled(status)}
                          >
                            {statusText(status)}
                          </option>
                        ))}
                      </select>

                      <textarea
                        value={statusNote}
                        disabled={isUpdatingStatus || isLoading}
                        onChange={(e) => {
                          setStatusNote(e.target.value);
                          setActionSuccess("");
                          setActionError("");
                        }}
                        placeholder="Optional status update note..."
                        className="min-h-20 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={handleUpdateStatus}
                        disabled={
                          !caseDetail ||
                          isLoading ||
                          isUpdatingStatus ||
                          isCaseClosed ||
                          !selectedStatus ||
                          selectedStatus === caseDetail.status
                        }
                        className="w-full rounded-2xl border border-violet-300/20 bg-violet-500/10 px-5 py-3 text-sm font-extrabold text-violet-100 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdatingStatus ? "Updating..." : "Update Status"}
                      </button>
                    </div>
                  </div>
                </section>

                <SectionCard
                  icon={<ShieldAlert className="h-5 w-5 text-red-300" />}
                  title="Intervention Context"
                  subtitle="Attendance-triggered support action"
                  glow="red"
                >
                  <p className="text-sm leading-7 text-slate-500">
                    This case is part of the attendance-triggered Circle of Care
                    workflow. Support center can review attendance risk, add
                    follow-up notes, and coordinate with the assigned teacher
                    before the issue becomes too late.
                  </p>
                </SectionCard>
              </>
            )}
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#14141B]/90 px-5 py-5 backdrop-blur-2xl sm:px-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={
                  !caseDetail ||
                  isLoading ||
                  isAddingNote ||
                  isCaseClosed ||
                  !noteText.trim()
                }
                onClick={handleAddNote}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isAddingNote ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                {isAddingNote ? "Adding..." : "Add Note"}
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
