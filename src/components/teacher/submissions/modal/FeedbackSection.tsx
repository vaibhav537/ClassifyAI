import { AlignLeft, Mic, PenLine } from "lucide-react";
import AudioRecorder from "./AudioRecorder";

export default function FeedbackSection({
  feedback,
  setFeedback,
  feedbackMode,
  setFeedbackMode,
  attachSignature,
  setAttachSignature,
  submission,
  setAudioBlob,
}: any) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-base font-extrabold text-white">
              Teacher&apos;s Feedback
            </h4>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Share feedback as written comments or an audio note.
            </p>
          </div>

          <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-[#08080C]/45 p-1">
            <button
              type="button"
              onClick={() => setFeedbackMode("text")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition duration-300 ${
                feedbackMode === "text"
                  ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                  : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <AlignLeft size={14} />
              Text
            </button>

            <button
              type="button"
              onClick={() => setFeedbackMode("audio")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition duration-300 ${
                feedbackMode === "audio"
                  ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                  : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Mic size={14} />
              Audio
            </button>
          </div>
        </div>

        {feedbackMode === "text" ? (
          <textarea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
          />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#08080C]/45 p-4">
            <AudioRecorder onAudioReady={(blob) => setAudioBlob(blob)} />
          </div>
        )}

        {submission?.fileUrl && submission.fileUrl.endsWith(".pdf") && (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-[#08080C]/45 p-4 transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/10">
            <input
              type="checkbox"
              checked={attachSignature}
              onChange={(e) => setAttachSignature(e.target.checked)}
              className="mt-1 h-5 w-5 cursor-pointer rounded border-white/20 bg-[#08080C] text-violet-500 focus:ring-violet-500"
            />

            <div className="min-w-0">
              <span className="flex items-center gap-2 text-sm font-extrabold text-white">
                <PenLine size={16} className="text-violet-300" />
                Attach my Digital Signature
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Stamp your pre-saved signature on this PDF.
              </span>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
