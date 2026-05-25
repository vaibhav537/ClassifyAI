"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download } from "lucide-react";

interface ResourcePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    title: string;
    description?: string;
    url: string;
  } | null;
}

export default function ResourcePreviewModal({
  isOpen,
  onClose,
  resource,
}: ResourcePreviewModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen || !resource) return null;

  const fileUrl = resource.url || "";
  const lowerUrl = fileUrl.toLowerCase();
  const isPDF = lowerUrl.endsWith(".pdf");
  const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(lowerUrl);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(lowerUrl);
  const isAudio = /\.(mp3|wav|ogg)$/i.test(lowerUrl);
  const isText =
    /\.(txt|csv|json|md)$/i.test(lowerUrl) || lowerUrl.startsWith("data:text");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="resource-modal"
          className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 text-white backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            key={fileUrl}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.07),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent" />

            <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  Resource Preview
                </span>

                <h2 className="mt-4 truncate text-2xl font-extrabold tracking-tight text-white">
                  {resource.title}
                </h2>

                {resource.description && (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {resource.description}
                  </p>
                )}
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
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/55 shadow-2xl shadow-black/25">
                {isPDF ? (
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      fileUrl,
                    )}&embedded=true`}
                    className="h-[70vh] w-full bg-[#08080C]"
                    title={resource.title}
                  />
                ) : isImage ? (
                  <img
                    src={fileUrl}
                    alt={resource.title}
                    className="h-[70vh] w-full object-contain"
                    onError={(e) => (e.currentTarget.src = "/no-preview.png")}
                  />
                ) : isVideo ? (
                  <video
                    src={fileUrl}
                    controls
                    className="h-[70vh] w-full bg-black"
                  />
                ) : isAudio ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center p-6 sm:p-8">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-black/20">
                      <FileText className="h-7 w-7 text-violet-200" />
                    </div>

                    <audio src={fileUrl} controls className="w-full" />
                  </div>
                ) : isText ? (
                  <iframe
                    src={fileUrl}
                    className="h-[70vh] w-full bg-[#08080C] text-white"
                    title={resource.title}
                  />
                ) : (
                  <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center sm:p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-black/20">
                      <FileText size={34} className="text-violet-200" />
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold tracking-tight text-white">
                      Preview not available
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                      This file type cannot be previewed inside the Resource
                      Vault. You can still download or open it directly.
                    </p>

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                    >
                      <Download size={16} />
                      Download File
                    </a>
                  </div>
                )}
              </div>

              {isPDF && (
                <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-center text-sm leading-6 text-amber-200">
                  If the PDF doesn’t appear,{" "}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-amber-100 underline decoration-amber-300/40 underline-offset-4 transition hover:text-white"
                  >
                    click here to open it in a new tab
                  </a>
                  .
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
