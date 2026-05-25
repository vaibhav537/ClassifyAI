"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Semester, Section } from "@/lib/types";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";
import {
  Bell,
  CheckCircle2,
  Loader2,
  Megaphone,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#08080C]/65 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:bg-[#08080C]/85 disabled:cursor-not-allowed disabled:opacity-60";

export default function CreateAnnouncementModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  initialData?: any;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAll, setTargetAll] = useState(true);
  const [targetSemester, setTargetSemester] = useState("");
  const [targetSection, setTargetSection] = useState("");
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title || "");
        setMessage(initialData.message || "");
        setTargetAll(initialData.targetAll || true);
        setTargetSemester(initialData.targetSemester?.toString() || "");
        setTargetSection(initialData.targetSection || "");
      } else {
        setTitle("");
        setMessage("");
        setTargetAll(true);
        setTargetSemester("");
        setTargetSection("");
      }

      const campusId = localStorage.getItem("CampusID");

      if (campusId) {
        const fetchDropdownData: () => Promise<void> = async () => {
          try {
            const [semestersRes, sectionsRes] = await Promise.all([
              fetch(`/api/assistant/semester/all?campusId=${campusId}`),
              fetch(`/api/assistant/sections/all?campusId=${campusId}`),
            ]);

            if (!semestersRes.ok || !sectionsRes.ok) {
              throw new Error("Failed to load data.");
            }

            setSemesters(await semestersRes.json());
            setSections(await sectionsRes.json());
          } catch (error: any) {
            showErrorMessage(error.message);
          }
        };

        fetchDropdownData();
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = async () => {
    const assistantId = localStorage.getItem("assistantId");
    const campusId = localStorage.getItem("CampusID");

    if (!title || !message || !assistantId || !campusId) {
      showErrorMessage("Title and message are required.");
      return;
    }

    if (!targetAll && (!targetSemester || !targetSection)) {
      showErrorMessage("Please select a target semester and section.");
      return;
    }

    setIsLoading(true);

    const toastId = showLoadingMessage(
      mode === "create" ? "Posting..." : "Updating...",
    );

    try {
      const body: any = {
        title,
        message,
        targetAll,
        campusId,
        ...(!targetAll && {
          targetSemester: Number(targetSemester),
          targetSection,
        }),
      };

      if (mode === "edit") {
        body.announcementId = initialData.id;
      }

      const response = await fetch(
        `/api/assistant/announcements?assistantId=${assistantId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();
      toastDissmisser(toastId);

      if (!response.ok) {
        throw new Error(data.error || "Failed to post announcement.");
      }

      showSuccessMessage(
        `Announcement ${
          mode === "create" ? "posted" : "updated"
        } successfully!`,
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      toastDissmisser(toastId);
      showErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999999] grid place-items-center overflow-hidden bg-[#08080C]/95 p-3 text-white backdrop-blur-2xl sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_center,rgba(217,70,239,0.05),transparent_38%)]" />
          <div className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-28 bottom-16 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

          <motion.div
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent" />

            <div className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.35rem] border border-violet-300/20 bg-violet-500/10">
                  <Megaphone className="h-6 w-6 text-violet-200" />
                </div>

                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                    {mode === "create" ? "Create Post" : "Edit Post"}
                  </span>

                  <h2
                    className="mt-3 text-2xl font-extrabold tracking-tight text-white"
                  >
                    {mode === "create" ? "New" : "Edit"} Announcement
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Publish a campus update for all students or a selected
                    semester and section.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close announcement modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-5 scrollbar-hide sm:p-6">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Announcement Title
                  </label>

                  <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    disabled={isLoading}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Message
                  </label>

                  <textarea
                    placeholder="Write announcement message"
                    value={message}
                    disabled={isLoading}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className={`${inputClass} min-h-[140px] resize-none`}
                  />
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                      <Users className="h-4 w-4 text-cyan-200" />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-white">
                        Target Audience
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Choose whether this announcement is for everyone or a
                        specific class.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-1">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setTargetAll(true)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-extrabold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                        targetAll
                          ? "bg-violet-500/20 text-violet-100 shadow-lg shadow-violet-950/20"
                          : "text-slate-500 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                      All Students
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setTargetAll(false)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-extrabold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                        !targetAll
                          ? "bg-cyan-500/20 text-cyan-100 shadow-lg shadow-cyan-950/20"
                          : "text-slate-500 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      Specific Class
                    </button>
                  </div>

                  <AnimatePresence>
                    {!targetAll && (
                      <motion.div
                        className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <select
                          value={targetSemester}
                          disabled={isLoading}
                          onChange={(e) => setTargetSemester(e.target.value)}
                          className={`${inputClass} appearance-none text-slate-300`}
                        >
                          <option className="bg-[#14141B]" value="">
                            Select Semester
                          </option>

                          {semesters.map((semester) => (
                            <option
                              className="bg-[#14141B]"
                              key={semester.id}
                              value={semester.number}
                            >
                              {semester.name}
                            </option>
                          ))}
                        </select>

                        <select
                          value={targetSection}
                          disabled={isLoading}
                          onChange={(e) => setTargetSection(e.target.value)}
                          className={`${inputClass} appearance-none text-slate-300`}
                        >
                          <option className="bg-[#14141B]" value="">
                            Select Section
                          </option>

                          {sections.map((section) => (
                            <option
                              className="bg-[#14141B]"
                              key={section.id}
                              value={section.name}
                            >
                              {section.name}
                            </option>
                          ))}
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                      <Sparkles className="h-4 w-4 text-violet-200" />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-white">
                        Assistant Announcement Sync
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        This announcement will be connected with the current
                        campus and assistant identity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex shrink-0 flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "create" ? (
                  <Send className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}

                {isLoading
                  ? mode === "create"
                    ? "Posting..."
                    : "Saving..."
                  : mode === "create"
                    ? "Post Announcement"
                    : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
