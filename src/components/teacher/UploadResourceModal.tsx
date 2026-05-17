"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  File as FileIcon,
  X,
  BookOpen,
  FileQuestion,
  FileText,
  Video,
} from "lucide-react";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";

const resourceTypes = [
  { id: "NOTES", label: "Notes", icon: <BookOpen size={16} /> },
  { id: "PYQ", label: "PYQs", icon: <FileQuestion size={16} /> },
  { id: "SYLLABUS", label: "Syllabus", icon: <FileText size={16} /> },
  { id: "VIDEO_LINK", label: "Video", icon: <Video size={16} /> },
];

export default function UploadResourceModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [resourceType, setResourceType] = useState("NOTES");
  const [file, setFile] = useState<File | null>(null);
  const [teacherSubjects, setTeacherSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setSelectedSubject("");
      setResourceType("NOTES");
      setFile(null);

      const teacherId = localStorage.getItem("teacherId");
      const campusId = localStorage.getItem("CampusID");

      if (teacherId && campusId) {
        fetch(
          `/api/teacher/subjects?teacherId=${teacherId}&campusId=${campusId}`,
        )
          .then((res) => res.json())
          .then((data) => {
            setTeacherSubjects(data);
            if (data.length > 0) setSelectedSubject(data[0].subject.id);
          });
      }
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const teacherId = localStorage.getItem("teacherId");
    const campusId = localStorage.getItem("CampusID");

    if (!file || !title || !selectedSubject || !teacherId || !campusId) {
      showErrorMessage("Please fill all required fields.");
      return;
    }

    setIsLoading(true);

    const isAIEligible =
      file.type.endsWith(".pdf") &&
      (resourceType === "NOTES" || resourceType === "PYQ");

    const toastId = showLoadingMessage(
      isAIEligible
        ? "Uploading & generating AI summary..."
        : "Uploading resource...",
    );

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subjectId", selectedSubject);
    formData.append("resourceType", resourceType);
    formData.append("teacherId", teacherId);
    formData.append("campusId", campusId);
    formData.append("file", file);

    try {
      const res = await fetch("/api/teacher/resources", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toastDissmisser(toastId);

      if (!res.ok) throw new Error(data.error);

      showSuccessMessage("Uploaded successfully");
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
        className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 text-white backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.07),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent" />

          <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                Resource Vault
              </span>

              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                Upload Resource
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add study material for your assigned subject and share it with
                your class.
              </p>
            </div>

            <button
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/10 hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 py-5 scrollbar-hide sm:px-6">
            <div className="grid grid-cols-2 gap-3">
              {resourceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setResourceType(type.id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold transition duration-300 ${
                    resourceType === type.id
                      ? "border-violet-300/35 bg-violet-500/15 text-violet-100 shadow-xl shadow-violet-950/20"
                      : "border-white/10 bg-white/[0.035] text-slate-400 hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-violet-500/10 hover:text-violet-100"
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              <input
                type="text"
                placeholder="Resource title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
              />

              <textarea
                placeholder="Optional description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-24 w-full resize-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
              />

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
              >
                {teacherSubjects.map((ts) => (
                  <option key={ts.subject.id} value={ts.subject.id}>
                    {ts.subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <div
                className={`relative overflow-hidden rounded-[1.75rem] border border-dashed p-6 text-center transition duration-300 ${
                  file
                    ? "border-emerald-300/30 bg-emerald-500/10"
                    : "border-white/15 bg-white/[0.035] hover:border-violet-300/35 hover:bg-violet-500/10"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                {!file ? (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-black/20">
                      <UploadCloud className="h-7 w-7 text-violet-200" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-400">
                      Drag & drop or{" "}
                      <label
                        htmlFor="file"
                        className="cursor-pointer font-extrabold text-violet-200 underline decoration-violet-300/30 underline-offset-4 transition hover:text-white"
                      >
                        browse
                      </label>
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Upload notes, PYQs, syllabus files, or video resources.
                    </p>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 shadow-xl shadow-black/20">
                      <FileIcon className="h-7 w-7 text-emerald-300" />
                    </div>

                    <span className="max-w-full truncate text-sm font-extrabold text-white">
                      {file.name}
                    </span>

                    <button
                      onClick={() => setFile(null)}
                      className="rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 text-xs font-extrabold text-red-300 transition hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col-reverse gap-3 border-t border-white/10 bg-[#14141B]/90 px-5 py-5 backdrop-blur-2xl sm:flex-row sm:justify-end sm:px-6">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-5 py-3 text-sm font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
