import { ExternalLink, FileText, ScrollText } from "lucide-react";

export default function SubmissionPreview({ submission, openInBrowser }: any) {
  const isPDF = submission?.fileUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-5">
      {submission?.fileUrl && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <FileText className="h-5 w-5 text-violet-200" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-extrabold text-white">
                Submitted Document
              </p>
              <p className="text-xs text-slate-500">
                Preview uploaded work
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => openInBrowser(e, submission.fileUrl)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-slate-300 transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
            title="Open in browser"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
        </div>
      )}

      {submission?.fileUrl && isPDF && (
        <div className="h-[70vh] min-h-[620px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-2xl shadow-black/25">
          <iframe
            src={submission.fileUrl}
            className="h-full w-full"
            title="Submitted Document"
          />
        </div>
      )}

      {submission?.fileUrl && !isPDF && (
        <button
          type="button"
          onClick={(e) => openInBrowser(e, submission.fileUrl)}
          className="group flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 text-center transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/10"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <FileText className="h-7 w-7 text-violet-200" />
          </div>

          <div>
            <p className="text-base font-extrabold text-white">
              View Submitted Document
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Open this file in browser preview.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-extrabold text-violet-200 transition group-hover:border-violet-300/35">
            <ExternalLink className="h-4 w-4" />
            Open File
          </div>
        </button>
      )}

      {submission?.text && (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035]">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
              <ScrollText className="h-5 w-5 text-cyan-200" />
            </div>

            <div>
              <p className="text-sm font-extrabold text-white">
                Written Answer
              </p>
              <p className="text-xs text-slate-500">
                Student&apos;s typed response
              </p>
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto p-5 scrollbar-hide">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {submission.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}