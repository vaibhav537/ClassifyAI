"use client";

import { AssignmentHeaderProps } from "@/lib/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Edit3,
  FileCheck2,
  Loader2,
  Medal,
  UploadCloud,
  X,
} from "lucide-react";
import Link from "next/link";

export default function AssignmentHeader({
  assignment,
  handleStatusChange,
  isStatusLoading,
  onEditClick,
}: AssignmentHeaderProps) {
  const hasSubmissions = assignment.submissions.length > 0;

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-violet-500/12 blur-3xl" />

      <div className="relative z-10">
        <Link
          href="/dashboard/teacher/assignments"
          className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-extrabold text-slate-300 transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Assignments
        </Link>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
              <FileCheck2 className="h-3.5 w-3.5" />
              Assignment Details
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              {assignment.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-2 font-bold text-slate-300">
                <BookOpen className="h-4 w-4 text-violet-300" />
                {assignment.subject.name}
              </span>

              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-2 font-bold text-slate-300">
                <CalendarDays className="h-4 w-4 text-violet-300" />
                Due:{" "}
                {assignment.dueDate
                  ? new Date(assignment.dueDate).toLocaleString()
                  : "No due date"}
              </span>

              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-2 font-bold text-slate-300">
                <Medal className="h-4 w-4 text-amber-300" />
                Max Marks: {assignment.totalMarks || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
            <button
              type="button"
              onClick={onEditClick}
              className="inline-flex h-fit shrink-0 items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-5 py-3 text-sm font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
            >
              <Edit3 size={18} />
              Edit Assignment
            </button>

            {assignment.status === "DRAFT" ? (
              <button
                type="button"
                onClick={() =>
                  !isStatusLoading && handleStatusChange("PUBLISHED")
                }
                disabled={isStatusLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStatusLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud size={18} />
                )}
                Publish
              </button>
            ) : (
              <div className="flex w-fit flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange("DRAFT")}
                  disabled={isStatusLoading || hasSubmissions}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-extrabold transition duration-300 ${
                    hasSubmissions
                      ? "cursor-not-allowed border-white/10 bg-white/[0.035] text-slate-600"
                      : "border-amber-300/25 bg-amber-500/10 text-amber-200 hover:-translate-y-0.5 hover:border-amber-300/45 hover:bg-amber-500/20"
                  }`}
                >
                  {isStatusLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X size={18} />
                  )}
                  Revert to Draft
                </button>

                {assignment.status === "PUBLISHED" && hasSubmissions && (
                  <p className="max-w-[220px] text-xs italic leading-5 text-slate-500">
                    Cannot revert because submissions already exist.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
