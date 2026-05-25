"use client";

import useSWR from "swr";
import SubjectChart from "./SubjectChart";
import ChartSkeleton from "./ChartSkeleton";
import ErrorState from "./ErrorState";
import { TrendingUp } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SubjectTrendChart({ campusId }: { campusId: string }) {
  const { data, isLoading, error } = useSWR(
    campusId
      ? `/api/teacher/hod/subject-attendance-trend?campusId=${campusId}`
      : null,
    fetcher,
  );

  if (isLoading) return <ChartSkeleton />;
  if (error || !data) return <ErrorState message="Failed to load trends" />;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8" />

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
              <TrendingUp className="h-3.5 w-3.5" />
              7 Day Trend
            </span>

            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
              Subject Attendance Trend
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Track subject-wise attendance movement across the last 7 days.
            </p>
          </div>
        </div>

        {data.subjects.length > 0 ? (
          <div className="space-y-5">
            {data.subjects.map((subject: any) => (
              <div
                key={subject.subjectId}
                className="rounded-[1.5rem] border border-white/10 bg-[#14141B]/70 p-4"
              >
                <SubjectChart subject={subject} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[220px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-cyan-300/20 bg-cyan-500/10">
                <TrendingUp className="h-7 w-7 text-cyan-200" />
              </div>

              <p className="mt-4 text-sm font-extrabold text-slate-200">
                No trend data available
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Subject attendance trends will appear after attendance records
                are available.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}