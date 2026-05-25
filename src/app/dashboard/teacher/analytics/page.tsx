"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Book, Trophy, TrendingUp, Users, Download } from "lucide-react";
import { motion } from "framer-motion";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.055]"
  >
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
    <div
      className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-15 blur-3xl transition duration-300 group-hover:opacity-25`}
    />

    <div className="relative z-10 flex items-start gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${color} shadow-xl shadow-black/20`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>
        <p className="mt-2 truncate text-2xl font-extrabold tracking-tight text-white">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

export default function TeacherAnalyticsPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  useEffect(() => {
    setTeacherId(localStorage.getItem("teacherId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const { data, error, isLoading } = useSWR(
    teacherId && campusId
      ? `/api/teacher/analytics/assignments?teacherId=${teacherId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const handleExport = async () => {
    const toastId = showLoadingMessage("Preparing your export...");
    setExportLoading(true);
    if (!teacherId) return;

    try {
      const res = await fetch(
        `/api/teacher/analytics/export?teacherId=${teacherId}`,
      );

      if (!res.ok) {
        toastDissmisser(toastId);
        showErrorMessage("Failed to export data. Please try again.");
        setExportLoading(false);
        throw new Error("Failed to download file");
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let fileName = "export.csv";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) fileName = match[1];
      }

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toastDissmisser(toastId);
      showSuccessMessage("Export successful.");
      setExportLoading(false);
    } catch (err) {
      toastDissmisser(toastId);
      showErrorMessage("An error occurred during export. Please try again.");
      setExportLoading(false);
      console.error("Download error:", err);
    } finally {
      setExportLoading(false);
    }
  };

  const analytics = data?.analytics;

  if (isLoading) {
    return (
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10 animate-pulse">
              <div className="h-6 w-36 rounded-full bg-white/10" />
              <div className="mt-5 h-10 w-72 max-w-full rounded-2xl bg-white/10" />
              <div className="mt-3 h-4 w-[32rem] max-w-full rounded-full bg-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                <div className="relative z-10 flex animate-pulse items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10" />
                  <div className="flex-1">
                    <div className="h-3 w-28 rounded-full bg-white/10" />
                    <div className="mt-3 h-7 w-20 rounded-xl bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                <div className="relative z-10 animate-pulse">
                  <div className="h-7 w-52 rounded-2xl bg-white/10" />
                  <div className="mt-5 space-y-3">
                    {[1, 2, 3, 4, 5].map((row) => (
                      <div
                        key={row}
                        className="h-12 w-full rounded-2xl bg-white/10"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !data?.success) {
    return (
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-red-300/20 bg-red-500/10 p-5 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <p className="text-sm font-bold text-red-300">
              Failed to load analytics.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                Assignment Studio
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Assignment Analytics
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Track assignment performance, subject-wise averages, and student
                grading trends across your Mentor Desk workspace.
              </p>
            </div>

            <motion.button
              onClick={handleExport}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={exportLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-5 py-3 text-sm font-extrabold text-emerald-300 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exportLoading ? (
                <span className="animate-pulse">Exporting...</span>
              ) : (
                <>
                  <Download size={20} />
                  Export to Excel
                </>
              )}
            </motion.button>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Total Assignments"
            value={analytics.totalAssignments}
            icon={<Book className="text-white" />}
            color="from-violet-600 via-fuchsia-500 to-violet-500"
          />
          <StatCard
            title="Graded Submissions"
            value={analytics.totalGradedSubmissions}
            icon={<Users className="text-white" />}
            color="from-cyan-500 via-blue-500 to-violet-500"
          />
          <StatCard
            title="Top Subject"
            value={analytics.performanceBySubject[0]?.subject || "N/A"}
            icon={<Trophy className="text-white" />}
            color="from-amber-400 via-orange-500 to-red-500"
          />
          <StatCard
            title="Students Tracked"
            value={analytics.trendsByStudent.length}
            icon={<TrendingUp className="text-white" />}
            color="from-emerald-400 via-emerald-500 to-green-600"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                    Subject Scores
                  </span>

                  <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
                    Performance by Subject
                  </h2>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-white">
                    <thead className="border-b border-white/10 bg-[#08080C]/45 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Subject</th>
                        <th className="px-5 py-4 text-right">Average Grade</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {analytics.performanceBySubject.length > 0 ? (
                        analytics.performanceBySubject.map((item: any) => (
                          <tr
                            key={item.subject}
                            className="transition hover:bg-white/[0.045]"
                          >
                            <td className="px-5 py-4 text-sm font-extrabold text-white">
                              {item.subject}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 text-xs font-extrabold text-violet-200">
                                {item.averageGrade}%
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-5 py-10 text-center text-sm font-semibold text-slate-500"
                          >
                            No graded assignments yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-violet-400/5" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                    Grade Movement
                  </span>

                  <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
                    Student Grade Trends
                  </h2>
                </div>
              </div>

              <div className="max-h-[420px] overflow-y-auto pr-1 scrollbar-hide">
                <ul className="space-y-3">
                  {analytics.trendsByStudent.length > 0 ? (
                    analytics.trendsByStudent.map((student: any) => (
                      <li
                        key={student.studentName}
                        className="group rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-4 transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.06]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-white">
                              {student.studentName}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Grades: {student.grades.join(", ")}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-extrabold text-cyan-200">
                            {student.grades.length}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="grid min-h-[180px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
                      <div>
                        <TrendingUp className="mx-auto h-8 w-8 text-slate-600" />
                        <p className="mt-4 text-sm font-bold text-slate-300">
                          No graded assignments yet.
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Student trends will appear after grading starts.
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
