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
  BellRing,
  FileIcon,
  Loader2,
  Megaphone,
  Save,
  Send,
  Target,
  UploadCloud,
  Users,
  X,
} from "lucide-react";

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
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title || "");
        setMessage(initialData.message || "");
        setTargetAll(initialData.targetAll || true);
        setTargetSemester(initialData.targetSemester?.toString() || "");
        setTargetSection(initialData.targetSection || "");
        setFile(initialData.file || null);
      } else {
        setTitle("");
        setMessage("");
        setTargetAll(true);
        setTargetSemester("");
        setTargetSection("");
        setFile(null);
      }

      const campusId = localStorage.getItem("CampusID");

      if (campusId) {
        const fetchDropdownData = async () => {
          try {
            const [semestersRes, sectionsRes] = await Promise.all([
              fetch(`/api/teacher/semester/all?campusId=${campusId}`),
              fetch(`/api/teacher/sections/all?campusId=${campusId}`),
            ]);

            console.log({ semestersRes, sectionsRes });

            if (!semestersRes.ok || !sectionsRes.ok)
              throw new Error("Failed to load data.");

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
    const teacherId = localStorage.getItem("teacherId");
    const campusId = localStorage.getItem("CampusID");

    if (!title || !message || !teacherId || !campusId) {
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
      const formData = new FormData();

      formData.append("title", title);
      formData.append("message", message);
      formData.append("targetAll", String(targetAll));

      if (!targetAll) {
        formData.append("targetSemester", targetSemester);
        formData.append("targetSection", targetSection);
      }

      formData.append("teacherId", teacherId);
      formData.append("campusId", campusId);

      if (file) {
        formData.append("attachment", file);
      }

      if (mode === "edit") {
        formData.append("announcementId", initialData.id);
      }

      const response = await fetch("/api/teacher/announcements", {
        method: mode === "create" ? "POST" : "PATCH",
        body: formData,
      });

      const data = await response.json();
      toastDissmisser(toastId);

      if (!response.ok) {
        throw new Error(data.error || "Failed to post announcement.");
      }

      showSuccessMessage(
        `Announcement  ${
          mode === "create" ? "posted" : "updated"
        }  successfully!`,
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
          initial={{ scale: 0.95, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 24, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-cyan-400/6" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/8 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                <Megaphone className="h-3.5 w-3.5" />
                Broadcast Composer
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {mode === "create" ? "New Announcement" : "Edit Announcement"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Write an update, choose audience, and attach a file if needed.
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

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 py-5 scrollbar-hide sm:px-6">
            <div className="space-y-5">
              <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <BellRing className="h-5 w-5 text-violet-200" />
                  </div>

                  <div>
                    <p className="text-base font-extrabold text-white">
                      Announcement Details
                    </p>
                    <p className="text-xs text-slate-500">
                      Title and message are required.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Announcement title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                  />

                  <textarea
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                    <UploadCloud className="h-5 w-5 text-cyan-200" />
                  </div>

                  <div>
                    <p className="text-base font-extrabold text-white">
                      Attachment
                    </p>
                    <p className="text-xs text-slate-500">
                      Optional file for extra information.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-dashed border-violet-300/20 bg-[#08080C]/35 p-5 text-center">
                  <UploadCloud className="mx-auto h-10 w-10 text-violet-200" />

                  <p className="mt-3 text-sm font-extrabold text-white">
                    Drop or choose a file to attach
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Upload notes, images, PDFs, or supporting documents.
                  </p>

                  <label
                    htmlFor="file-upload"
                    className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/35 transition hover:-translate-y-0.5 hover:shadow-violet-800/30"
                  >
                    <UploadCloud size={16} />
                    Select File
                    <input
                      id="file-upload"
                      name="file"
                      type="file"
                      className="sr-only"
                      onChange={(e) =>
                        setFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </label>

                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mx-auto mt-4 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm"
                    >
                      <FileIcon className="h-4 w-4 shrink-0 text-emerald-300" />

                      <span className="truncate font-bold text-emerald-100">
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
                      >
                        <X size={15} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                    <Target className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div>
                    <p className="text-base font-extrabold text-white">
                      Target Audience
                    </p>
                    <p className="text-xs text-slate-500">
                      Send to all students or a specific class.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-[#08080C]/45 p-1">
                  <button
                    type="button"
                    onClick={() => setTargetAll(true)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold transition duration-300 ${
                      targetAll
                        ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                        : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Users size={14} />
                    All Students
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetAll(false)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold transition duration-300 ${
                      !targetAll
                        ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                        : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Target size={14} />
                    Specific Class
                  </button>
                </div>

                <AnimatePresence>
                  {!targetAll && (
                    <motion.div
                      className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <select
                        value={targetSemester}
                        onChange={(e) => setTargetSemester(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                      >
                        <option value="" className="bg-[#08080C]">
                          Select Semester
                        </option>

                        {semesters.map((s) => (
                          <option
                            key={s.id}
                            value={s.number}
                            className="bg-[#08080C]"
                          >
                            {s.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={targetSection}
                        onChange={(e) => setTargetSection(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                      >
                        <option value="" className="bg-[#08080C]">
                          Select Section
                        </option>

                        {sections.map((s) => (
                          <option
                            key={s.id}
                            value={s.name}
                            className="bg-[#08080C]"
                          >
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </div>
          </div>

          <div className="relative z-10 flex flex-col-reverse gap-3 border-t border-white/10 bg-[#14141B]/90 px-5 py-5 backdrop-blur-2xl sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
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
                <Save className="h-4 w-4" />
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
    </AnimatePresence>
  );
}
