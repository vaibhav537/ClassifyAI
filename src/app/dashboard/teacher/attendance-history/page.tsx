"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  History,
  Loader2,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import DatePicker from "@/components/ui/DatePicker";
import {
  AttendanceHistoryLoadingSkeleton,
  AttendanceHistoryTableLoadingSkeleton,
} from "@/components/teacher/SkeletonLoaders";
import { motion, AnimatePresence } from "framer-motion";
import { showErrorMessage, showLoadingMessage } from "@/lib/helper";
import EditAttendanceModal from "@/components/teacher/EditAttendanceModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AttendanceHistoryPage() {
  const [filters, setFilters] = useState({
    subjectId: "",
    semesterId: "",
    sectionId: "",
    date: "",
  });
  const [page, setPage] = useState(1);
  const [teacherSubjects, setTeacherSubjects] = useState<any[]>([]);
  const [recordToEdit, setRecordToEdit] = useState<any | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setTeacherId(localStorage.getItem("teacherId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  useEffect(() => {
    if (teacherId && campusId) {
      const fetchFilterData = async () => {
        const res = await fetch(
          `/api/teacher/subjects?teacherId=${teacherId}&campusId=${campusId}`,
        );

        if (res.ok) {
          setTeacherSubjects(await res.json());
        }
      };

      fetchFilterData();
    }
  }, [teacherId, campusId]);

  const createApiUrl = (basePath: string) => {
    if (!teacherId || !campusId) return null;

    const params = new URLSearchParams({ teacherId, campusId });

    if (filters.subjectId) params.append("subjectId", filters.subjectId);
    if (filters.date) params.append("date", filters.date);

    if (basePath.includes("past-attendance")) {
      params.append("page", page.toString());
      params.append("limit", "15");
    }

    return `${basePath}?${params.toString()}`;
  };

  const { data, error, isLoading } = useSWR(
    hydrated ? createApiUrl("/api/teacher/past-attendance") : null,
    fetcher,
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleExport = () => {
    const exportUrl = createApiUrl("/api/teacher/past-attendance/export");

    if (exportUrl) {
      showLoadingMessage("Preparing your report...");
      window.location.href = exportUrl;
    } else {
      showErrorMessage("Could not generate export link. Please refresh.");
    }
  };

  console.log({ data: data });

  if (!hydrated) return <AttendanceHistoryLoadingSkeleton />;

  return (
    <main className="relative min-h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

      <div className="relative z-10 flex flex-col gap-6">
        <motion.header
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/12 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                <Sparkles className="h-3 w-3" />
                Attendance Archive
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Attendance History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                View, filter, edit and export past attendance records from one
                clean workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  Records
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {isLoading ? "..." : data?.attendance?.length || 0}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200/70">
                  Page
                </p>
                <p className="mt-1 text-2xl font-extrabold text-violet-100">
                  {page}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.section
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                <Search className="h-5 w-5 text-violet-200" />
              </div>

              <div>
                <p className="text-base font-extrabold text-white">Filters</p>
                <p className="text-xs text-slate-500">
                  Narrow results by subject and date.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                  Subject
                </label>

                <select
                  name="subjectId"
                  value={filters.subjectId}
                  onChange={handleFilterChange}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="" className="bg-[#08080C]">
                    All Subjects
                  </option>

                  {[
                    ...new Map(
                      teacherSubjects.map((i) => [i.subject.id, i.subject]),
                    ).values(),
                  ].map((subject: any) => (
                    <option
                      key={subject.id}
                      value={subject.id}
                      className="bg-[#08080C]"
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                  Date
                </label>

                <div className="rounded-2xl border border-white/10 bg-[#08080C]/55 px-3 py-2">
                  <DatePicker
                    value={filters.date}
                    onChange={(val) => {
                      setFilters((p) => ({ ...p, date: val }));
                      setPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {isLoading ? (
          <AttendanceHistoryTableLoadingSkeleton />
        ) : error || !data?.success ? (
          <section className="grid min-h-[320px] place-items-center rounded-[2rem] border border-red-300/20 bg-red-500/10 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <div>
              <AlertCircle className="mx-auto h-10 w-10 text-red-300" />
              <p className="mt-4 text-lg font-extrabold text-red-200">
                Failed to load attendance history
              </p>
              <p className="mt-2 text-sm text-red-100/70">
                Please refresh and try again.
              </p>
            </div>
          </section>
        ) : (
          <motion.section
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/25 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-white">
                <thead className="border-b border-white/10 bg-[#08080C]/45 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-extrabold">Student Name</th>
                    <th className="px-6 py-4 font-extrabold">Subject</th>
                    <th className="px-6 py-4 font-extrabold">Status</th>
                    <th className="px-6 py-4 font-extrabold">Date & Time</th>
                    <th className="px-6 py-4 text-right font-extrabold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {data.attendance.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="mx-auto max-w-sm">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                            <History className="h-6 w-6 text-slate-600" />
                          </div>

                          <p className="mt-4 text-sm font-bold text-slate-300">
                            No records found
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Try changing the selected subject or date filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {data.attendance.map((rec: any, index: number) => (
                        <motion.tr
                          key={rec.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ delay: index * 0.015 }}
                          className="group transition duration-300 hover:bg-white/[0.045]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#08080C]/45 transition group-hover:border-violet-300/25 group-hover:bg-violet-500/10">
                                <UserRound className="h-4 w-4 text-violet-200" />
                              </div>

                              <span className="font-bold text-slate-100">
                                {rec.studentName}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-slate-400">
                            {rec.subjectName}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-extrabold ${
                                rec.status === "PRESENT"
                                  ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
                                  : rec.status === "ABSENT"
                                    ? "border-red-300/20 bg-red-500/10 text-red-300"
                                    : "border-amber-300/20 bg-amber-500/10 text-amber-300"
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-400">
                              <CalendarDays className="h-4 w-4 text-slate-600" />
                              {new Date(rec.markedAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => setRecordToEdit(rec)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-violet-200 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
                              title="Edit attendance"
                            >
                              <Edit size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>

            {data.pagination.totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-white/10 bg-[#08080C]/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={data.pagination.currentPage <= 1}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2.5 text-sm font-extrabold text-violet-100 transition duration-300 hover:border-violet-300/45 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-center text-sm font-bold text-slate-500">
                  Page {data.pagination.currentPage} of{" "}
                  {data.pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={
                    data.pagination.currentPage >= data.pagination.totalPages
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2.5 text-sm font-extrabold text-violet-100 transition duration-300 hover:border-violet-300/45 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.section>
        )}
      </div>

      <motion.button
        type="button"
        onClick={handleExport}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-8 right-8 z-50 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-2xl shadow-violet-950/40 transition duration-300 hover:shadow-violet-800/30"
      >
        <Download size={18} />
        Download Report
      </motion.button>

      {recordToEdit && (
        <EditAttendanceModal
          isOpen={!!recordToEdit}
          onClose={() => setRecordToEdit(null)}
          onSuccess={() => {
            const key = createApiUrl("/api/teacher/past-attendance");
            if (key) mutate(key);
            setRecordToEdit(null);
          }}
          attendanceRecord={recordToEdit}
        />
      )}
    </main>
  );
}
