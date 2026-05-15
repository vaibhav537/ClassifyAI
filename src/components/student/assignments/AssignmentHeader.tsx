import { Award, BookOpen, CalendarDays } from "lucide-react";

const AssignmentHeader = ({ assignment }: any) => {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/12 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
          <BookOpen className="h-3.5 w-3.5" />
          {assignment.subject?.name || "Subject"}
        </div>

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
          {assignment.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-3">
            <CalendarDays className="h-4 w-4 text-violet-300" />
            <span
              className={
                new Date(assignment.dueDate) < new Date()
                  ? "font-bold text-red-300"
                  : "font-bold text-slate-300"
              }
            >
              {assignment.dueDate
                ? new Date(assignment.dueDate).toLocaleString()
                : "No Due Date"}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3">
            <Award className="h-4 w-4 text-amber-200" />
            <span className="font-bold text-amber-100">
              {assignment.totalMarks
                ? `${assignment.totalMarks} Marks`
                : "Not Graded"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentHeader;