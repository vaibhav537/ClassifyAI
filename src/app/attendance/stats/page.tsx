"use client";

import { BunkStats } from "@/lib/types";
import {
  AlertTriangle,
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  Download,
  Loader2,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { showSuccessMessage } from "@/lib/helper";

const MIN_PERCENTAGE = 75;

type RiskLevel = "SAFE" | "WARNING" | "RISK";

type EnhancedBunkStats = BunkStats & {
  subjectCode?: string | null;
  absent?: number;
  late?: number;
  pending?: number;
  classesNeededToReach75?: number;
  risk?: RiskLevel;
};

function getRiskLevel(percentage: number): RiskLevel {
  if (percentage >= 85) return "SAFE";
  if (percentage >= MIN_PERCENTAGE) return "WARNING";
  return "RISK";
}

function getRiskStyles(risk: RiskLevel) {
  if (risk === "SAFE") {
    return {
      badge:
        "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
      progress: "bg-gradient-to-r from-emerald-500 to-cyan-300",
      icon: "text-emerald-300",
      card: "hover:border-emerald-300/30",
    };
  }

  if (risk === "WARNING") {
    return {
      badge: "border-amber-300/20 bg-amber-500/10 text-amber-300",
      progress: "bg-gradient-to-r from-amber-500 to-yellow-300",
      icon: "text-amber-300",
      card: "hover:border-amber-300/30",
    };
  }

  return {
    badge: "border-red-300/20 bg-red-500/10 text-red-300",
    progress: "bg-gradient-to-r from-red-500 to-amber-300",
    icon: "text-red-300",
    card: "hover:border-red-300/30",
  };
}

function formatPercentage(value: number) {
  return `${Number(value || 0).toFixed(2)}%`;
}

const Page = () => {
  const [stats, setStats] = useState<EnhancedBunkStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchStats = async () => {
    const studentId = localStorage.getItem("studentId");
    const campusId = localStorage.getItem("CampusID");

    if (!studentId || !campusId) {
      setError("Student or Campus ID not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/attendance/bunk-manager?studentId=${studentId}&campusId=${campusId}`,
        {
          cache: "no-store",
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch bunk manager stats.");
      }

      setStats(data.data || []);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const summary = useMemo(() => {
    const totalSubjects = stats.length;
    const totalClasses = stats.reduce((sum, item) => sum + (item.total || 0), 0);
    const totalPresent = stats.reduce(
      (sum, item) => sum + (item.present || 0),
      0,
    );
    const totalSafeBunks = stats.reduce(
      (sum, item) => sum + (item.safeBunks || 0),
      0,
    );

    const overallPercentage =
      totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;

    const riskSubjects = stats.filter(
      (item) => getRiskLevel(item.percentage) === "RISK",
    ).length;

    return {
      totalSubjects,
      totalClasses,
      totalPresent,
      totalSafeBunks,
      overallPercentage,
      riskSubjects,
    };
  }, [stats]);

  const chartData = stats.map((item) => ({
    subject: item.subjectCode || item.subject,
    percentage: Number(item.percentage.toFixed(2)),
  }));

  const downloadReport = async () => {
    const node = document.getElementById("bunk-report");
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#08080C",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      const img = new Image();
      img.src = dataUrl;
      await img.decode();

      const ratio = img.height / img.width;
      const imgHeight = pageWidth * ratio;

      pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, imgHeight);
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
                  Track subject-wise attendance, safe bunks, recovery targets
                  and your overall attendance risk in one place.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Subjects
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {loading ? "..." : stats.length}
                </p>
              </div>

              <div
                className={`rounded-2xl border px-4 py-3 ${
                  summary.riskSubjects > 0
                    ? "border-red-300/20 bg-red-500/10"
                    : "border-emerald-300/20 bg-emerald-500/10"
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                    summary.riskSubjects > 0
                      ? "text-red-200/70"
                      : "text-emerald-200/70"
                  }`}
                >
                  Overall
                </p>
                <p
                  className={`mt-1 text-sm font-extrabold ${
                    summary.riskSubjects > 0
                      ? "text-red-100"
                      : "text-emerald-100"
                  }`}
                >
                  {loading
                    ? "Loading"
                    : error
                      ? "Error"
                      : stats.length === 0
                        ? "No Data"
                        : summary.riskSubjects > 0
                          ? "Risk"
                          : "Ready"}
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

        {!loading && error && (
          <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-red-300/15 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
                <ShieldAlert className="h-7 w-7 text-red-300" />
              </div>

              <p className="mt-5 text-xl font-extrabold text-white">
                Unable to load stats
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={fetchStats}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                >
                  Try Again
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/student")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Go Back
                </button>
              </div>
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
                We couldn’t find attendance records for your student profile.
                Once your teacher marks attendance, your bunk stats will appear
                here.
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
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                    <CalendarCheck className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Total Classes
                    </p>
                    <p className="text-2xl font-extrabold text-white">
                      {summary.totalClasses}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-500/10 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                    <TrendingUp className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/70">
                      Overall Attendance
                    </p>
                    <p className="text-2xl font-extrabold text-emerald-100">
                      {formatPercentage(summary.overallPercentage)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-500/10 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/10">
                    <Target className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200/70">
                      Safe Bunks
                    </p>
                    <p className="text-2xl font-extrabold text-amber-100">
                      {summary.totalSafeBunks}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-[1.75rem] border p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl ${
                  summary.riskSubjects > 0
                    ? "border-red-300/20 bg-red-500/10"
                    : "border-emerald-300/20 bg-emerald-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                      summary.riskSubjects > 0
                        ? "border-red-300/20 bg-red-500/10"
                        : "border-emerald-300/20 bg-emerald-500/10"
                    }`}
                  >
                    {summary.riskSubjects > 0 ? (
                      <TrendingDown className="h-5 w-5 text-red-300" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-emerald-300" />
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                        summary.riskSubjects > 0
                          ? "text-red-200/70"
                          : "text-emerald-200/70"
                      }`}
                    >
                      Risk Subjects
                    </p>
                    <p
                      className={`text-2xl font-extrabold ${
                        summary.riskSubjects > 0
                          ? "text-red-100"
                          : "text-emerald-100"
                      }`}
                    >
                      {summary.riskSubjects}
                    </p>
                  </div>
                </div>
              </div>
            </section>

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
                      Attendance, safe bunks and risk level
                    </p>
                  </div>
                </div>

                <div className="max-h-[740px] space-y-3 overflow-y-auto p-4">
                  {stats.map((item, idx) => {
                    const risk = item.risk || getRiskLevel(item.percentage);
                    const styles = getRiskStyles(risk);

                    return (
                      <article
                        key={`${item.subject}-${idx}`}
                        className={`rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 transition duration-300 ${styles.card} hover:bg-white/[0.065]`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-extrabold text-white">
                              {item.subject}
                            </h3>

                            {item.subjectCode && (
                              <p className="mt-1 text-xs font-bold text-cyan-300">
                                {item.subjectCode}
                              </p>
                            )}

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              Total:{" "}
                              <span className="font-bold text-slate-300">
                                {item.total}
                              </span>{" "}
                              · Present:{" "}
                              <span className="font-bold text-slate-300">
                                {item.present}
                              </span>
                              {typeof item.absent === "number" && (
                                <>
                                  {" "}
                                  · Absent:{" "}
                                  <span className="font-bold text-slate-300">
                                    {item.absent}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${styles.badge}`}
                          >
                            {risk}
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-500">Attendance</span>
                            <span className={styles.icon}>
                              {formatPercentage(item.percentage)}
                            </span>
                          </div>

                          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${styles.progress}`}
                              style={{
                                width: `${Math.min(item.percentage, 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className={`mt-4 rounded-2xl border px-3 py-2 text-sm font-bold ${
                            risk === "RISK"
                              ? "border-red-300/20 bg-red-500/10 text-red-200"
                              : "border-amber-300/20 bg-amber-400/10 text-amber-200"
                          }`}
                        >
                          {item.percentage >= MIN_PERCENTAGE ? (
                            <>Safe Bunks: {item.safeBunks}</>
                          ) : (
                            <>
                              Attend {item.classesNeededToReach75 || 0} more
                              class(es) to reach 75%.
                            </>
                          )}
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
                          Subject-wise percentage with 75% reference line
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

                  <div className="h-[380px] p-4 sm:p-5">
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
                          domain={[0, 100]}
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
                          formatter={(value) => [`${value}%`, "Attendance"]}
                        />
                        <ReferenceLine
                          y={MIN_PERCENTAGE}
                          stroke="#F59E0B"
                          strokeDasharray="4 4"
                          label={{
                            value: "75% Required",
                            fill: "#FCD34D",
                            fontSize: 12,
                          }}
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
                        Know whether you can bunk or need recovery classes
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                    {stats.map((item, idx) => {
                      const risk = item.risk || getRiskLevel(item.percentage);

                      return (
                        <div
                          key={`${item.subject}-planner-${idx}`}
                          className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="truncate text-base font-extrabold text-white">
                              {item.subject}
                            </h3>

                            {risk === "RISK" && (
                              <AlertTriangle className="h-5 w-5 shrink-0 text-red-300" />
                            )}
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {item.percentage >= MIN_PERCENTAGE ? (
                              <>
                                You can bunk{" "}
                                <span className="font-extrabold text-amber-200">
                                  {item.safeBunks}
                                </span>{" "}
                                more lecture(s) without falling below 75%.
                              </>
                            ) : (
                              <>
                                You need to attend{" "}
                                <span className="font-extrabold text-red-200">
                                  {item.classesNeededToReach75 || 0}
                                </span>{" "}
                                more lecture(s) to reach 75%.
                              </>
                            )}
                          </p>

                          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold text-slate-400">
                            Current: {formatPercentage(item.percentage)} ·
                            Required: {MIN_PERCENTAGE}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </main>
          </>
        )}
      </div>
    </section>
  );
};

export default Page;