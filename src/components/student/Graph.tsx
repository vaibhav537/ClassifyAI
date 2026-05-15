"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Info, TrendingUp } from "lucide-react";

interface AttendancePercentage {
  subject: string;
  percentage: number;
}

const BarGraph: React.FC = () => {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendancePercentage[]>(
    [],
  );

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const campusID = localStorage.getItem("CampusID");

    if (!studentId || !campusID) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/attendance/percentage?studentId=${studentId}&campusId=${campusID}`,
        );
        const result: AttendancePercentage[] = await res.json();

        const formatted = result.map((item) => ({
          subject: item.subject,
          percentage: Math.round(Number(item.percentage)),
        }));

        setAttendanceData(formatted);
      } catch (err) {
        console.error("Error loading attendance graph data:", err);
      }
    };

    fetchData();
  }, []);

  const maxValue = Math.max(
    ...attendanceData.map((item) => item.percentage),
    0,
  );
  const total = attendanceData.reduce((acc, item) => acc + item.percentage, 0);
  const average = attendanceData.length
    ? Math.round(total / attendanceData.length)
    : 0;

  const handleClick = (index: number) => {
    setSelectedBar(selectedBar === index ? null : index);
  };

  const selectedItem =
    selectedBar !== null ? attendanceData[selectedBar] : undefined;

  return (
    <div className="relative h-full min-h-[360px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/90 shadow-2xl shadow-black/35 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/6" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <BarChart3 className="h-5 w-5 text-violet-200" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Attendance Analytics
              </p>
              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-white">
                Subject Performance
              </h2>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-right sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Average
            </p>
            <p className="mt-0.5 text-lg font-extrabold text-white">
              {average}%
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          {attendanceData.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                  Track your consistency per subject.
                </p>

                {maxValue > 0 && (
                  <span className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 sm:inline-flex">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Max {maxValue}%
                  </span>
                )}
              </div>

              <div className="relative flex min-h-[230px] flex-1 items-end gap-3 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.035] px-4 py-5">
                <div className="pointer-events-none absolute inset-x-4 bottom-5 top-5 flex flex-col justify-between">
                  {[100, 75, 50, 25].map((line) => (
                    <div key={line} className="flex items-center gap-2">
                      <span className="w-7 text-[10px] font-semibold text-slate-600">
                        {line}
                      </span>
                      <div className="h-px flex-1 bg-white/[0.06]" />
                    </div>
                  ))}
                </div>

                <div className="relative z-10 flex min-h-[190px] w-full items-end justify-between gap-3 pl-9">
                  {attendanceData.map((item, index) => {
                    const value = item.percentage;
                    const height = Math.max((value / 100) * 180, 8);
                    const isSelected = selectedBar === index;

                    return (
                      <button
                        type="button"
                        key={`${item.subject}-${index}`}
                        className="group flex min-w-[46px] flex-1 flex-col items-center justify-end gap-2 outline-none"
                        onClick={() => handleClick(index)}
                      >
                        <div className="pointer-events-none rounded-full border border-white/10 bg-[#08080C]/90 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-xl shadow-black/30 transition duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                          {value}%
                        </div>

                        <div className="flex h-[180px] w-full max-w-[42px] items-end rounded-full bg-white/[0.04] p-1">
                          <div
                            className={`relative w-full overflow-hidden rounded-full transition-all duration-300 ${
                              isSelected
                                ? "bg-gradient-to-t from-fuchsia-500 via-violet-500 to-cyan-300 shadow-lg shadow-violet-950/50"
                                : "bg-gradient-to-t from-violet-700 via-violet-500 to-fuchsia-300 group-hover:shadow-lg group-hover:shadow-violet-950/40"
                            }`}
                            style={{ height: `${height}px` }}
                          >
                            {isSelected && (
                              <div
                                className="absolute inset-0 opacity-25"
                                style={{
                                  backgroundImage: `repeating-linear-gradient(
                                    45deg,
                                    transparent,
                                    transparent 4px,
                                    rgba(255,255,255,0.8) 4px,
                                    rgba(255,255,255,0.8) 8px
                                  )`,
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <p
                          className={`max-w-[70px] truncate text-xs font-bold transition ${
                            isSelected ? "text-violet-200" : "text-slate-400"
                          }`}
                          title={item.subject}
                        >
                          {item.subject}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                {selectedItem ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                        Selected Subject
                      </p>
                      <h3 className="mt-1 text-base font-extrabold text-white">
                        {selectedItem.subject}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 text-sm font-bold text-violet-200">
                        Attendance {selectedItem.percentage}%
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-sm font-bold ${
                          selectedItem.percentage >= average
                            ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
                            : "border-amber-300/20 bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {selectedItem.percentage >= average
                          ? "Above average"
                          : "Below average"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                      <Info className="h-4 w-4 text-violet-300" />
                    </div>
                    <p>Click on any bar to view detailed information.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="grid min-h-[260px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <BarChart3 className="h-6 w-6 text-slate-500" />
                </div>

                <p className="mt-4 text-sm font-bold text-slate-300">
                  No attendance data yet
                </p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                  Subject-wise attendance percentage will appear after records
                  are available.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarGraph;