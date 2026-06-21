"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  FileText,
  Loader2,
  Send,
  Type,
  UploadCloud,
  X,
} from "lucide-react";
import { showErrorMessage, showSuccessMessage } from "@/lib/helper";

export default function SubmitAssignmentModal({
  isOpen,
  onClose,
  onSuccess,
  studentId,
  assignment,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentId: string | null;
  assignment: any;
}) {
  const [submitMode, setSubmitMode] = useState<"file" | "text">("file");
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLate = assignment?.dueDate
    ? new Date() > new Date(assignment.dueDate)
    : false;

  useEffect(() => {
    if (isOpen) {
      setSubmitMode("file");
      setTextAnswer("");
      setSelectedFile(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (studentId === null) {
      showErrorMessage("Can't find student details!");
      return;
    }

    if (submitMode === "text" && !textAnswer.trim()) {
      showErrorMessage("Please write an answer before submitting.");
      return;
    }

    if (submitMode === "file" && !selectedFile) {
      showErrorMessage("Please select a file to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      let fireUrl = null;

      if (submitMode === "file" && selectedFile) {
        const cloudName = "dd2bczbdo";
        const uploadPreset = "ClassifyAI-pdf";
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("upload_preset", uploadPreset);
        // formData.append(
        //   "folder",
        //   `classify_ai/assignment/${assignment.id}_${studentId}`,
        // );

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(
            uploadData.error?.message || "Cloudinary upload failed!",
          );
        }

        fireUrl = uploadData.secure_url;
      }

      const response = await fetch("/api/student/assignments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: assignment.id,
          studentId: studentId,
          content: submitMode === "text" ? textAnswer : null,
          fireUrl: submitMode === "file" ? fireUrl : null,
        }),
      });

      const result = await response.json();

      console.log({ result });

      if (response.ok) {
        showSuccessMessage("Assignment Submitted !!");
        onSuccess();
        window.location.reload();
      } else {
        showErrorMessage(
          result?.error || "Failed to Submit Assignment, try again later!!",
        );
        onClose();
      }
    } catch (error) {
      showErrorMessage("Can't Upload this time, try again later");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 18 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
          className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-fuchsia-500/6 to-cyan-400/6" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/12 blur-3xl" />

          <div className="relative z-10 flex max-h-[90vh] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                  <Send className="h-3.5 w-3.5" />
                  Assignment Submission
                </div>

                <h3 className="truncate text-2xl font-extrabold tracking-tight text-white">
                  Submit Your {assignment.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose written answer or file upload to complete your
                  assignment submission.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition duration-300 hover:bg-red-500/20"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              {isLate && (
                <div className="mb-5 flex items-start gap-3 rounded-[1.5rem] border border-red-300/20 bg-red-500/10 p-4 text-red-200">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-extrabold">The due date has passed!</p>
                    <p className="mt-1 text-sm leading-6 text-red-100/70">
                      You can still submit, but your work will be marked as
                      &quot;Late&quot; to your teacher.
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-5 grid gap-2 rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-1.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSubmitMode("text")}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition duration-300 ${
                    submitMode === "text"
                      ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                      : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Type size={18} />
                  Write Answer
                </button>

                <button
                  type="button"
                  onClick={() => setSubmitMode("file")}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition duration-300 ${
                    submitMode === "file"
                      ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                      : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <UploadCloud size={18} />
                  Upload File
                </button>
              </div>

              {submitMode === "text" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Written Answer
                  </label>

                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="h-60 w-full resize-none rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                  />
                </motion.div>
              )}

              {submitMode === "file" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-[1.5rem] border-2 border-dashed border-violet-300/25 bg-white/[0.035] p-4 transition duration-300 hover:border-violet-300/45 hover:bg-white/[0.055]"
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) =>
                      setSelectedFile(
                        e.target.files && e.target.files.length > 0
                          ? e.target.files[0]
                          : null,
                      )
                    }
                  />

                  <label
                    htmlFor="file-upload"
                    className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[1.25rem] text-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 text-violet-200 shadow-xl shadow-violet-950/20">
                      {selectedFile ? (
                        <FileText size={34} />
                      ) : (
                        <UploadCloud size={36} />
                      )}
                    </div>

                    {selectedFile ? (
                      <>
                        <p className="mt-5 max-w-full truncate rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-sm font-extrabold text-violet-100">
                          {selectedFile.name}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          Click again to choose another file.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-5 text-lg font-extrabold text-white">
                          Click to browse or drag file here
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Accepts PDF, DOC, Images (Max 10MB)
                        </p>
                      </>
                    )}
                  </label>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-extrabold text-slate-300 transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                Submit Assignment
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
