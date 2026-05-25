"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { AlertTriangle, Send } from "lucide-react";
import { useState } from "react";
import SubjectBar from "./SubjectBar";
import RiskBadge from "./RiskBadge";
import RadarSkeleton from "./RadarSkeleton";
import ErrorState from "./ErrorState";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DefaulterRadar({
  campusId,
  teacherId,
}: {
  campusId: string;
  teacherId: string;
}) {
  const [loadingSend, setLoadingSend] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    campusId
      ? `/api/teacher/hod/student-attendance?campusId=${campusId}`
      : null,
    fetcher,
  );

  async function handleNotify() {
    try {
      setLoadingSend(true);

      await fetch("/api/teacher/hod/student-attendance", {
        method: "POST",
        body: JSON.stringify({
          campusId,
          sentBy: teacherId,
        }),
      });

      mutate();
    } finally {
      setLoadingSend(false);
    }
  }

  if (isLoading) return <RadarSkeleton />;
  if (error || !data) return <ErrorState message="Failed to load defaulters" />;

  return (
    <div className="relative space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            Attendance Risk
          </span>

          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
            Defaulter Radar
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Students with low attendance across assigned subjects.
          </p>
        </div>

        <button
          onClick={handleNotify}
          disabled={loadingSend}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-extrabold text-red-200 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {loadingSend ? "Sending..." : "Notify All"}
        </button>
      </div>

      {data.defaulters.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {data.defaulters.map((student: any, index: number) => (
            <motion.div
              key={student.studentId}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: index * 0.04,
              }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-red-300/30 hover:bg-white/[0.055]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-violet-500/8 opacity-70 transition duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-extrabold tracking-tight text-white">
                      {student.name}
                    </h3>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      Roll: {student.rollNumber}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <RiskBadge value={student.lowestPercentage} />
                  </div>
                </div>

                <div className="space-y-2 rounded-[1.35rem] border border-white/10 bg-[#14141B]/60 p-3">
                  {student.subjects.map((sub: any) => (
                    <SubjectBar key={sub.subjectId} sub={sub} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-[220px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10">
              <AlertTriangle className="h-7 w-7 text-emerald-300" />
            </div>

            <p className="mt-4 text-sm font-extrabold text-slate-200">
              No defaulters found
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Attendance risk alerts will appear here when students fall below
              the threshold.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
