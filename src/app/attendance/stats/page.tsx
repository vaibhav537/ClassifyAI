"use client";

import { BunkStats } from "@/lib/types";
import {
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  Download,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { showSuccessMessage } from "@/lib/helper";

const Page = () => {
  const [stats, setStats] = useState<BunkStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const campusId = localStorage.getItem("CampusID");

    if (!studentId || !campusId) {
      setError("Student or Campus ID not found.");
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `/api/attendance/bunk-manager?studentId=${studentId}&campusId=${campusId}`,
        );
        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        } else {
          setError("Failed to fetch bunk manager stats.");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = stats.map((item) => ({
    subject: item.subject,
    percentage: parseFloat(item.percentage.toFixed(2)),
  }));

  const downloadReport = async () => {
    const node = document.getElementById("bunk-report");
    if (!node) return;

    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const img = new Image();
      img.src = dataUrl;
      await img.decode();

      const ratio = img.height / img.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageWidth * ratio);

      pdf.save("BunkReport.pdf");
      showSuccessMessage("Report downloaded successfully.");
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  return (
    <section
      id="bunk-report"
      className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5">
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
                  Premium Attendance Tool
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Bunk Manager
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Track subject-wise attendance, safe bunks and your overall
                  attendance risk in one place.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Subjects
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {loading ? "..." : stats.length}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/70">
                  Status
                </p>
                <p className="mt-1 text-sm font-extrabold text-violet-100">
                  {loading ? "Loading" : error ? "Error" : "Ready"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {loading && (
          <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
              </div>

              <p className="mt-5 text-lg font-extrabold text-white">
                Loading statistics
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Fetching your attendance and bunk manager data...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-red-300/15 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
                <ShieldAlert className="h-7 w-7 text-red-300" />
              </div>

              <p className="mt-5 text-xl font-extrabold text-white">
                Unable to load stats
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>

              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        )}

        {!loading && !error && stats.length === 0 && (
          <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <BarChart3 className="h-7 w-7 text-slate-500" />
              </div>

              <p className="mt-5 text-xl font-extrabold text-white">
                No Statistics Available
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                We couldn’t find any attendance records for you yet. Once your
                classes and attendance data are updated, your bunk stats will
                appear here.
              </p>

              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
              >
                <ChevronLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        )}

        {!loading && !error && stats.length > 0 && (
          <main className="grid gap-5 xl:grid-cols-[380px_1fr]">
            <aside className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                  <CalendarCheck className="h-5 w-5 text-violet-200" />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-white">
                    Subject Stats
                  </h2>
                  <p className="text-xs text-slate-500">
                    Attendance and safe bunks
                  </p>
                </div>
              </div>

              <div className="max-h-[680px] space-y-3 overflow-y-auto p-4">
                {stats.map((item, idx) => {
                  const isSafe = item.percentage > 75;

                  return (
                    <article
                      key={idx}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:border-violet-300/30 hover:bg-white/[0.065]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-extrabold text-white">
                            {item.subject}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Total:{" "}
                            <span className="font-bold text-slate-300">
                              {item.total}
                            </span>{" "}
                            · Present:{" "}
                            <span className="font-bold text-slate-300">
                              {item.present}
                            </span>
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${
                            isSafe
                              ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
                              : "border-red-300/20 bg-red-500/10 text-red-300"
                          }`}
                        >
                          {isSafe ? "Safe" : "Risk"}
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500">Attendance</span>
                          <span
                            className={
                              isSafe ? "text-emerald-300" : "text-red-300"
                            }
                          >
                            {item.percentage.toFixed(2)}%
                          </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isSafe
                                ? "bg-gradient-to-r from-emerald-500 to-cyan-300"
                                : "bg-gradient-to-r from-red-500 to-amber-300"
                            }`}
                            style={{
                              width: `${Math.min(item.percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-sm font-bold text-amber-200">
                        Safe Bunks: {item.safeBunks}
                      </div>
                    </article>
                  );
                })}
              </div>
            </aside>

            <section className="grid gap-5">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
                <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                      <BarChart3 className="h-5 w-5 text-violet-200" />
                    </div>

                    <div>
                      <h2 className="text-base font-extrabold text-white">
                        Attendance Overview
                      </h2>
                      <p className="text-xs text-slate-500">
                        Subject-wise percentage trend
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={downloadReport}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </button>
                </div>

                <div className="h-[360px] p-4 sm:p-5">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="subject"
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#14141B",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: "16px",
                          color: "#F8FAFC",
                          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
                        }}
                        labelStyle={{ color: "#C084FC", fontWeight: 700 }}
                        itemStyle={{ color: "#F8FAFC" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#C084FC"
                        strokeWidth={3}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400/10">
                    <ShieldAlert className="h-5 w-5 text-amber-200" />
                  </div>

                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      Bunk Planner
                    </h2>
                    <p className="text-xs text-slate-500">
                      Check how many more lectures you can safely miss
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                  {stats.map((item, idx) => {
                    const maxAllowed = Math.floor(item.total * 0.25);
                    const remaining = maxAllowed - (item.total - item.present);

                    return (
                      <div
                        key={idx}
                        className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4"
                      >
                        <h3 className="truncate text-base font-extrabold text-white">
                          {item.subject}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          You can bunk{" "}
                          <span className="font-extrabold text-amber-200">
                            {Math.max(remaining, 0)}
                          </span>{" "}
                          more lecture(s) without falling below 75%.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        )}
      </div>
    </section>
  );
};

export default Page;