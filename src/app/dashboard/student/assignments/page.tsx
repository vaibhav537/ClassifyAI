"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Clock,
  Check,
  Award,
  ChevronLeft,
  CalendarDays,
  ArrowRight,
  ClipboardList,
  Loader2,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const StatusBadge = ({ status }: { status: string }) => {
    type AssignmentStatus = "PENDING" | "SUBMITTED" | "GRADED";

  const statusInfo = {
    PENDING: {
      text: "PENDING",
      color: "border-amber-300/20 bg-amber-500/10 text-amber-300",
      icon: <Clock size={14} />,
    },
    SUBMITTED: {
      text: "SUBMITTED",
      color: "border-violet-300/20 bg-violet-500/10 text-violet-300",
      icon: <Check size={14} />,
    },
    GRADED: {
      text: "GRADED",
      color: "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
      icon: <Award size={14} />,
    },
  };

  const currentStatus =
    statusInfo[status as AssignmentStatus] || statusInfo.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${currentStatus.color}`}
    >
      {currentStatus.icon}
      {currentStatus.text}
    </span>
  );
};

const AssignmentCardSkeleton = () => (
  <div className="min-h-[330px] animate-pulse rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
    <div className="h-12 w-12 rounded-2xl bg-white/10" />
    <div className="mt-6 h-5 w-3/4 rounded-full bg-white/10" />
    <div className="mt-3 h-4 w-1/2 rounded-full bg-white/10" />
    <div className="mt-6 h-10 rounded-2xl bg-white/10" />
    <div className="mt-20 h-12 rounded-2xl bg-white/10" />
  </div>
);

export default function StudentAssignmentsPage() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setStudentId(localStorage.getItem("studentId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    studentId && campusId
      ? `/api/student/assignments?studentId=${studentId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const assignments = data?.assignments || [];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
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
                  Student Assignments
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Your Assignments
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Keep track of due dates, submissions, marks and feedback from
                  one clean workspace.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Total
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {isLoading ? "..." : assignments.length}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/70">
                  Status
                </p>
                <p className="mt-1 text-sm font-extrabold text-violet-100">
                  {isLoading ? "Loading" : error ? "Error" : "Ready"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {isLoading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <AssignmentCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {error && (
          <div className="grid min-h-[360px] place-items-center rounded-[2rem] border border-red-300/15 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
                <ClipboardList className="h-7 w-7 text-red-300" />
              </div>

              <p className="mt-5 text-xl font-extrabold text-white">
                Failed to load assignments
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Please refresh and try again.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <AnimatePresence>
            {assignments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid min-h-[360px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl"
              >
                <div className="max-w-md">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <FileCheck2 className="h-7 w-7 text-slate-500" />
                  </div>

                  <p className="mt-5 text-xl font-extrabold text-white">
                    No assignments right now
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    You are all clear. New assignments from your teachers will
                    appear here.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
              >
                {assignments.map((assignment: any) => {
                  const isOverdue =
                    assignment.dueDate &&
                    new Date(assignment.dueDate) < new Date();

                  const actionClass =
                    assignment.submissionStatus === "PENDING"
                      ? "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 text-white shadow-xl shadow-violet-950/40 hover:shadow-violet-800/30"
                      : assignment.submissionStatus === "SUBMITTED"
                        ? "border border-violet-300/25 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20"
                        : "border border-emerald-300/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20";

                  return (
                    <motion.article
                      key={assignment.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-[#1B1B24]/90"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                      <div className="relative z-10 flex flex-1 flex-col">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                            <ClipboardList className="h-6 w-6 text-violet-200" />
                          </div>

                          <StatusBadge status={assignment.submissionStatus} />
                        </div>

                        <div>
                          <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white transition group-hover:text-violet-100">
                            {assignment.title}
                          </h3>

                          <p className="mt-3 text-sm font-bold text-violet-300">
                            {assignment.subjectName}
                          </p>

                          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-400">
                            <CalendarDays
                              size={14}
                              className={
                                isOverdue ? "text-red-300" : "text-violet-300"
                              }
                            />

                            <span className={isOverdue ? "text-red-300" : ""}>
                              Due:{" "}
                              {assignment.dueDate
                                ? new Date(
                                    assignment.dueDate,
                                  ).toLocaleDateString()
                                : "No due date"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto pt-6">
                          <div className="mb-4 grid gap-3">
                            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
                              <span className="text-slate-500">
                                Total Marks
                              </span>
                              <span className="font-extrabold text-white">
                                {assignment.totalMarks || "N/A"}
                              </span>
                            </div>

                            {assignment.submissionStatus === "GRADED" && (
                              <div className="flex items-center justify-between rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-sm">
                                <span className="text-emerald-100/70">
                                  Your Grade
                                </span>
                                <span className="font-extrabold text-emerald-300">
                                  {assignment.grade}
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/dashboard/student/assignments/questions?assignmentId=${assignment.id}`,
                              )
                            }
                            className={`group/button inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${actionClass}`}
                          >
                            {assignment.submissionStatus === "PENDING" &&
                              "View & Submit"}
                            {assignment.submissionStatus === "SUBMITTED" &&
                              "View Submission"}
                            {assignment.submissionStatus === "GRADED" &&
                              "View Feedback"}

                            <ArrowRight
                              size={18}
                              className="transition duration-300 group-hover/button:translate-x-1"
                            />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.section>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}