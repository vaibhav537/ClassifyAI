import { motion } from "framer-motion";
import { ClipboardCheck } from "lucide-react";

const AssignmentRubric = ({ rubric }: any) => {
  if (!rubric) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-500/12 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <ClipboardCheck className="h-5 w-5 text-violet-200" />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-white">
              Grading Rubric
            </h2>
            <p className="text-xs text-slate-500">
              Evaluation points for this assignment
            </p>
          </div>
        </div>

        <div className="text-slate-300">
          {Array.isArray(rubric) ? (
            <ul className="space-y-3">
              {rubric.map((item: string, index: number) => (
                <li
                  key={index}
                  className="group flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 transition duration-300 hover:border-violet-300/30 hover:bg-white/[0.06]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-extrabold text-violet-200">
                    {index + 1}
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm leading-7 text-slate-300">{rubric}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentRubric;