"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  ClipboardCheck,
  GraduationCap,
  UserRound,
} from "lucide-react";

export default function SubmissionTable({
  submissions,
  dueDate,
  totalMarks,
  onGrade,
}: any) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

      <div className="relative z-10 border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <ClipboardCheck className="h-5 w-5 text-violet-200" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Student Submissions
            </h2>
            <p className="text-xs text-slate-500">
              Review, grade and track submitted work.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-white">
          <thead className="border-b border-white/10 bg-[#08080C]/45 text-[10px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-4 font-extrabold">Student Name</th>
              <th className="px-6 py-4 font-extrabold">Submitted At</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
              <th className="px-6 py-4 font-extrabold">Grade</th>
              <th className="px-6 py-4 text-right font-extrabold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {submissions.length > 0 ? (
              submissions.map((sub: any, index: number) => {
                const isLate =
                  dueDate && new Date(sub.submittedAt) > new Date(dueDate);

                return (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.025 }}
                    className="group transition duration-300 hover:bg-white/[0.045]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#08080C]/45 transition group-hover:border-violet-300/25 group-hover:bg-violet-500/10">
                          <UserRound className="h-4 w-4 text-violet-200" />
                        </div>

                        <span className="font-bold text-slate-100">
                          {sub.student.user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-400">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold ${
                          isLate
                            ? "border-red-300/20 bg-red-500/10 text-red-300"
                            : "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        {isLate ? (
                          <Clock size={13} />
                        ) : (
                          <CheckCircle size={13} />
                        )}
                        {isLate ? "Late" : "On Time"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {sub.grade !== null ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 text-xs font-extrabold text-violet-200">
                          <GraduationCap className="h-4 w-4" />
                          {sub.grade} / {totalMarks}
                        </span>
                      ) : (
                        <span className="rounded-full border border-amber-300/20 bg-amber-500/10 px-3 py-1.5 text-xs font-extrabold text-amber-300">
                          Not Graded
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onGrade(sub)}
                        className="inline-flex items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-sm font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
                      >
                        Grade
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                      <ClipboardCheck className="h-6 w-6 text-slate-600" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-300">
                      No submissions yet
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Student submissions will appear here after they submit the
                      assignment.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
