import { openInBrowser } from "@/lib/helper";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  MessageSquare,
  Mic,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const AssignmentSubmission = ({
  hasSubmitted,
  submissionData,
  assignment,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!hasSubmitted || !submissionData) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/12 via-violet-500/8 to-cyan-400/5" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white">
                  Your Submission
                </h2>
                <p className="text-xs text-slate-500">
                  Submitted work and evaluation details
                </p>
              </div>
            </div>

            <div className="w-fit rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold">
              {submissionData.grade ? (
                <span className="flex items-center gap-2 text-emerald-300">
                  <Award size={16} />
                  {submissionData.grade} / {assignment.totalMarks}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-amber-300">
                  <Clock size={16} />
                  Waiting for grading
                </span>
              )}
            </div>
          </div>

          {submissionData.text && (
            <div className="mb-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-white">
                <FileText className="h-4 w-4 text-violet-300" />
                Written Answer
              </div>

              <div className="relative max-h-[420px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
                <p className="line-clamp-[16] text-sm leading-7 text-slate-300">
                  {submissionData.text}
                </p>

                <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#08080C] to-transparent" />

                <button
                  type="button"
                  onClick={() => setIsTextModalOpen(true)}
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-2xl border border-violet-300/25 bg-violet-500/10 px-4 py-2 text-xs font-extrabold text-violet-100 transition duration-300 hover:border-violet-300/45 hover:bg-violet-500/20"
                >
                  <Eye className="h-4 w-4" />
                  Read Full Answer
                </button>
              </div>
            </div>
          )}

          {submissionData.fileUrl && (
            <div className="mb-5">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:border-violet-300/30 hover:bg-white/[0.06]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 hover:opacity-100" />

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                      <FileText className="h-5 w-5 text-violet-200" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Submission File
                      </p>
                      <p className="truncate text-sm font-extrabold text-white">
                        Uploaded Document
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-violet-950/35 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </div>
              </div>
            </div>
          )}

          {submissionData.grade !== null &&
            submissionData.grade !== undefined && (
              <div className="border-t border-white/10 pt-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-violet-300">
                    <Award size={18} />
                    Teacher Evaluation
                  </h3>

                  <div className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-300">
                    Grade: {submissionData.grade}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {submissionData.feedback ? (
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:border-violet-300/30 hover:bg-white/[0.06]">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-violet-200">
                        <MessageSquare size={16} />
                        Remarks by{" "}
                        <span className="text-white">
                          {submissionData.gradedBy || "Teacher"}
                        </span>
                      </div>

                      <p className="text-sm italic leading-7 text-slate-300">
                        “{submissionData.feedback}”
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-center text-sm italic text-slate-500">
                      No written feedback provided.
                    </div>
                  )}

                  {submissionData.audioFeedbackUrl && (
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan-300/20 bg-cyan-500/10 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-cyan-200">
                        <Mic size={16} className="animate-pulse" />
                        Voice Feedback
                      </div>

                      <audio
                        src={submissionData.audioFeedbackUrl}
                        controls
                        className="h-10 w-full rounded-lg opacity-90 outline-none [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-panel]:bg-[#08080C] [&::-webkit-media-controls-play-button]:text-white [&::-webkit-media-controls-time-remaining-display]:text-gray-400"
                      />

                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Tap to listen • Recorded by{" "}
                        {submissionData.gradedBy || "Teacher"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </motion.div>

      {mounted &&
        createPortal(
          <>
            {" "}
            <AnimatePresence>
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="relative z-10 flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B] shadow-2xl shadow-black/60"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 bg-[#14141B]/90 p-4 backdrop-blur-xl">
                      <div className="flex items-center gap-3 text-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                          <FileText className="h-5 w-5 text-violet-200" />
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold">
                            Submitted Document
                          </h3>
                          <p className="text-xs text-slate-500">
                            Preview uploaded file
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) =>
                            openInBrowser(e, submissionData.fileUrl)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
                          title="Open in System Browser"
                        >
                          <ExternalLink size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 bg-[#08080C]/70 p-3 sm:p-4">
                      <iframe
                        src={
                          submissionData.fileUrl.endsWith(".pdf")
                            ? submissionData.fileUrl
                            : `https://docs.google.com/gview?url=${submissionData.fileUrl}&embedded=true`
                        }
                        className="h-full w-full rounded-[1.25rem] border border-white/10 bg-white"
                        title="Submitted Document"
                      />
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isTextModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsTextModalOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="relative z-10 flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B] shadow-2xl shadow-black/60"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 bg-[#14141B]/90 p-4 backdrop-blur-xl">
                      <div className="flex items-center gap-3 text-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                          <FileText className="h-5 w-5 text-violet-200" />
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold">
                            Full Answer
                          </h3>
                          <p className="text-xs text-slate-500">
                            Complete written submission
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsTextModalOpen(false)}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 text-sm leading-7 text-slate-300">
                      {submissionData.text}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>,
          document.body,
        )}
    </>
  );
};

export default AssignmentSubmission;
