import { motion } from "framer-motion";
import { questionCleaner } from "@/lib/helper";

const AssignmentQuestions = ({ assignment }: any) => {
  return (
    <div className="w-full">
      <h2 className="mb-5 border-b border-white/10 pb-4 text-base font-extrabold text-white">
        Assignment Questions
      </h2>

      {(() => {
        if (!assignment.description) {
          return (
            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="text-sm font-medium italic text-slate-500">
                No description available.
              </p>
            </div>
          );
        }

        try {
          const parsedData = JSON.parse(assignment.description);

          if (Array.isArray(parsedData)) {
            return (
              <ul className="space-y-4 whitespace-pre-wrap">
                {parsedData.map((q: string, index: number) => (
                  <motion.li
                    key={index}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 text-sm leading-7 text-slate-300 transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.065]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-xs font-extrabold text-violet-200">
                        Q{index + 1}
                      </span>

                      <p className="min-w-0 flex-1">{questionCleaner(q)}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            );
          }
        } catch {
          return (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {assignment.description}
              </p>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default AssignmentQuestions;