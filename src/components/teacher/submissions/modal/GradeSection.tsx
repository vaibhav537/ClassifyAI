import { Hash, SlidersHorizontal } from "lucide-react";

export default function GradeSection({
  grade,
  setGrade,
  gradeMode,
  setGradeMode,
  rubric,
  setRubric,
  totalMarks,
}: any) {
  const rubricItems = [
    { key: "concept", label: "Concept Clarity" },
    { key: "execution", label: "Execution" },
    { key: "formatting", label: "Formatting" },
  ];

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-base font-extrabold text-white">
              Marks Awarded
            </h4>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter marks manually or calculate using rubric sliders.
            </p>
          </div>

          <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-[#08080C]/45 p-1">
            <button
              type="button"
              onClick={() => setGradeMode("manual")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition duration-300 ${
                gradeMode === "manual"
                  ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                  : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Hash size={14} />
              Manual
            </button>

            <button
              type="button"
              onClick={() => setGradeMode("rubric")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition duration-300 ${
                gradeMode === "rubric"
                  ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                  : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <SlidersHorizontal size={14} />
              Rubric
            </button>
          </div>
        </div>

        {gradeMode === "manual" ? (
          <div>
            <input
              type="number"
              placeholder={`Total out of ${totalMarks || 100}`}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
            />

            <p className="mt-2 text-xs font-medium text-slate-500">
              Maximum marks: {totalMarks || 100}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {rubricItems.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-white/10 bg-[#08080C]/45 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-300">
                    {item.label}
                  </p>

                  <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs font-extrabold text-violet-200">
                    {rubric[item.key]} / 40
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="40"
                  value={rubric[item.key]}
                  onChange={(e) =>
                    setRubric({
                      ...rubric,
                      [item.key]: parseInt(e.target.value),
                    })
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-violet-500"
                />
              </div>
            ))}

            <div className="flex items-center justify-between rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 px-4 py-3">
              <p className="text-sm font-extrabold text-violet-100">
                Rubric Total
              </p>

              <p className="text-lg font-extrabold text-white">
                {grade || 0} / {totalMarks || 100}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
