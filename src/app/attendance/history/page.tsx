"use client";

import { formatAttendanceDate } from "@/lib/helper";
import { AttendanceRecord } from "@/lib/types";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const AttendanceHistoryPage = () => {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(10);

  const router = useRouter();

  const studentId =
    typeof window !== "undefined" ? localStorage.getItem("studentId") : null;

  const campusId =
    typeof window !== "undefined" ? localStorage.getItem("CampusID") : null;

  useEffect(() => {
    if (!studentId || !campusId) {
      setError("Student ID not found in localStorage.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `/api/attendance/history?studentId=${studentId}&campusId=${campusId}&page=${page}&limit=${limit}`,
        );
        const data = await res.json();

        if (data.success) {
          setHistory(data.history);
        } else {
          setError(data.error || "Failed to fetch data.");
        }
      } catch (err) {
        setError("Error fetching attendance history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [studentId, page, limit]);

  const filteredHistory = history.filter((record) =>
    record.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Attendance Records
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Attendance History
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Review your previous attendance records, filter by subject,
                  and track your class presence over time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[270px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Page
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {page}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/70">
                  Records
                </p>
                <p className="mt-1 text-2xl font-extrabold text-violet-100">
                  {loading ? "..." : filteredHistory.length}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                <CalendarDays className="h-5 w-5 text-violet-200" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-white">
                  History List
                </h2>
                <p className="text-xs text-slate-500">
                  Latest records from your attendance database
                </p>
              </div>
            </div>

            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 pl-11 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>
          </div>

          {loading && (
            <div className="grid min-h-[360px] place-items-center px-5 py-12">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
                </div>

                <p className="mt-5 text-lg font-extrabold text-white">
                  Loading attendance records
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Fetching your attendance history...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="grid min-h-[320px] place-items-center px-5 py-12 text-center">
              <div className="max-w-md rounded-[1.5rem] border border-red-300/20 bg-red-500/10 p-6">
                <p className="text-lg font-extrabold text-red-200">
                  Unable to load history
                </p>
                <p className="mt-2 text-sm leading-6 text-red-100/70">
                  {error}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="grid min-h-[360px] place-items-center px-5 py-12 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <CalendarDays className="h-7 w-7 text-slate-500" />
                </div>

                <p className="mt-5 text-xl font-extrabold text-white">
                  No attendance records found
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your marked attendance history will appear here once records
                  are available.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <>
              <div className="max-h-[62vh] overflow-y-auto p-4 sm:p-5">
                {filteredHistory.length > 0 ? (
                  <ul className="grid gap-3">
                    {filteredHistory.map((record) => {
                      const status = record.status.toUpperCase();

                      const statusClass =
                        status === "PRESENT"
                          ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
                          : status === "ABSENT"
                            ? "border-red-300/20 bg-red-500/10 text-red-300"
                            : "border-amber-300/20 bg-amber-500/10 text-amber-300";

                      return (
                        <li
                          key={record.id}
                          className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-white/[0.065] sm:p-5"
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

                          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <h3 className="text-lg font-extrabold text-white">
                                {record.subject}
                              </h3>

                              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                                <CalendarDays className="h-3.5 w-3.5 text-violet-300" />
                                {formatAttendanceDate(record.date|| record.markedAt)}
                              </div>
                            </div>

                            <span
                              className={`w-fit rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] ${statusClass}`}
                            >
                              {record.status}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="grid min-h-[260px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
                    <div>
                      <Search className="mx-auto h-8 w-8 text-slate-600" />
                      <p className="mt-4 text-sm font-bold text-slate-300">
                        No matching subjects found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try searching with a different subject name.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm font-bold text-slate-300 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <span className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-sm font-extrabold text-violet-100">
                  Page {page}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm font-bold text-slate-300 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
};

export default AttendanceHistoryPage;