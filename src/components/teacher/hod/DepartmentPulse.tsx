"use client";

import useSWR from "swr";
import { BarChart3, BookOpen, School } from "lucide-react";
import GlassCard from "./GlassCard";
import CircularProgress from "./CircularProgress";
import TrendIndicator from "./TrendIndicator";
import PulseSkeleton from "./PulseSkeleton";
import ErrorState from "./ErrorState";
import CountUp from "react-countup";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DepartmentPulsePro({ campusId }: { campusId: string }) {
  const { data, isLoading, error } = useSWR(
    campusId ? `/api/teacher/hod/analytics?campusId=${campusId}` : null,
    fetcher,
  );

  if (isLoading) return <PulseSkeleton />;
  if (error || !data) return <ErrorState message="Failed to load analytics" />;

  const attendance = data.averageAttendance.percentage;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      <GlassCard>
        <div className="relative z-10 flex min-h-[220px] flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                Department Pulse
              </p>
              <h3 className="mt-1 truncate text-base font-extrabold text-white">
                Average Attendance
              </h3>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <BarChart3 size={20} className="text-violet-200" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-5">
            <CircularProgress value={attendance} />

            <div className="min-w-0 flex-1">
              <h2 className="text-4xl font-extrabold tracking-tight text-white">
                <CountUp end={attendance} duration={1} />%
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {data.averageAttendance.present}/{data.averageAttendance.total}{" "}
                marked present
              </p>

              <TrendIndicator value={attendance} threshold={75} />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="relative z-10 flex min-h-[220px] flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                Resource Vault
              </p>
              <h3 className="mt-1 truncate text-base font-extrabold text-white">
                Resources This Week
              </h3>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
              <BookOpen size={20} className="text-cyan-200" />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-5xl font-extrabold tracking-tight text-white">
              <CountUp end={data.totalResources.thisWeek} />
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Uploaded during this week
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[1.35rem] border border-violet-300/20 bg-violet-500/10 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-200/70">
                Notes
              </p>
              <p className="mt-1 text-2xl font-extrabold text-violet-100">
                {data.totalResources.notes}
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-cyan-300/20 bg-cyan-500/10 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-200/70">
                PYQs
              </p>
              <p className="mt-1 text-2xl font-extrabold text-cyan-100">
                {data.totalResources.pyqs}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="relative z-10 flex min-h-[220px] flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                Class Schedule
              </p>
              <h3 className="mt-1 truncate text-base font-extrabold text-white">
                Classes Today
              </h3>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
              <School size={20} className="text-emerald-300" />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-5xl font-extrabold tracking-tight text-white">
              <CountUp end={data.classesConducted.today} />
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Scheduled sessions for today
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[1.35rem] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-100/70">
                Live
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-100">
                {data.classesConducted.live}
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-amber-300/20 bg-amber-500/10 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-100/70">
                Upcoming
              </p>
              <p className="mt-1 text-2xl font-extrabold text-amber-100">
                {data.classesConducted.upcoming}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
