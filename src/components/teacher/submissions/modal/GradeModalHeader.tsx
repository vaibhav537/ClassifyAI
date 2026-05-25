import { AlertCircle, CheckCircle2, GraduationCap, UserRound } from "lucide-react";

export default function GradeModalHeader({ submission, isLate }: any) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
          <GraduationCap className="h-3.5 w-3.5" />
          Grading Workspace
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Grade Submission
        </h2>

        <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-slate-300">
          <UserRound className="h-4 w-4 shrink-0 text-violet-300" />
          <span className="text-slate-500">Student:</span>
          <span className="truncate text-white">
            {submission?.student?.user?.name}
          </span>
        </div>
      </div>

      {isLate ? (
        <span className="inline-flex h-fit shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-red-300">
          <AlertCircle className="h-4 w-4" />
          Late
        </span>
      ) : (
        <span className="inline-flex h-fit shrink-0 items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          On Time
        </span>
      )}
    </div>
  );
}