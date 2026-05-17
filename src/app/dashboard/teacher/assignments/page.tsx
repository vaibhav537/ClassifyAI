"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Archive,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  Loader2,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react";
import CreateAssignmentModal from "@/components/teacher/CreateAssignmentModal";
import { AssignmentStatus } from "@/lib/types";
import Link from "next/link";

const statusColors: Record<AssignmentStatus, string> = {
  DRAFT:
    "border-slate-300/20 bg-slate-500/10 text-slate-200",
  PUBLISHED:
    "border-emerald-300/20 bg-emerald-500/10 text-emerald-200",
  CLOSED:
    "border-red-300/20 bg-red-500/10 text-red-200",
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AssignmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);

  useEffect(() => {
    setTeacherId(localStorage.getItem("teacherId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    teacherId && campusId
      ? `/api/teacher/assignments?teacherId=${teacherId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const assignments = data?.assignments || [];

  return (
    <>
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 flex flex-col gap-6">
          <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/12 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Assignment Studio
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Assignments
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Create, publish and track class assignments from one clean
                  workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                    Total
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">
                    {isLoading ? "..." : assignments.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                >
                  <PlusCircle size={18} />
                  Create Assignment
                </button>
              </div>
            </div>
          </header>

          {isLoading && (
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="h-6 w-44 rounded-xl bg-white/10" />
                      <div className="h-4 w-28 rounded-xl bg-white/10" />
                    </div>

                    <div className="h-7 w-20 rounded-full bg-white/10" />
                  </div>

                  <div className="h-4 w-36 rounded-xl bg-white/10" />
                  <div className="mt-3 h-4 w-28 rounded-xl bg-white/10" />

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="flex justify-between gap-4">
                      <div className="h-4 w-32 rounded-xl bg-white/10" />
                      <div className="h-4 w-20 rounded-xl bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {error && (
            <section className="grid min-h-[320px] place-items-center rounded-[2rem] border border-red-300/20 bg-red-500/10 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div>
                <Archive className="mx-auto h-10 w-10 text-red-300" />
                <p className="mt-4 text-lg font-extrabold text-red-200">
                  Failed to load assignments
                </p>
                <p className="mt-2 text-sm text-red-100/70">
                  Please refresh and try again.
                </p>
              </div>
            </section>
          )}

          {!isLoading && !error && (
            <>
              {assignments.length === 0 ? (
                <section className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
                  <div className="max-w-md">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                      <ClipboardList className="h-7 w-7 text-violet-200" />
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold text-white">
                      No assignments yet
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Create your first assignment and start collecting student
                      submissions.
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                    >
                      <PlusCircle size={18} />
                      Create Assignment
                    </button>
                  </div>
                </section>
              ) : (
                <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {assignments.map((assignment: any) => (
                    <Link
                      href={`/dashboard/teacher/assignments/${assignment.id}`}
                      key={assignment.id}
                      className="group block"
                    >
                      <article className="relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055]">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />
                        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                                <FileText className="h-5 w-5 text-violet-200" />
                              </div>

                              <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-white">
                                {assignment.title}
                              </h3>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                                statusColors[
                                  assignment.status as AssignmentStatus
                                ]
                              }`}
                            >
                              {assignment.status}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-bold text-slate-300">
                              <BookOpen className="h-4 w-4 shrink-0 text-violet-300" />
                              <span className="truncate">
                                {assignment.subject?.name || "No subject"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                              <CalendarDays className="h-4 w-4 text-slate-600" />
                              Due:{" "}
                              {assignment.dueDate
                                ? new Date(
                                    assignment.dueDate,
                                  ).toLocaleDateString()
                                : "No due date"}
                            </div>
                          </div>

                          <div className="mt-auto border-t border-white/10 pt-5">
                            <div className="flex items-center justify-between gap-3">
                              <span className="inline-flex items-center gap-2 text-sm font-extrabold text-violet-200">
                                <Users className="h-4 w-4" />
                                {assignment._count.submissions} Submissions
                              </span>

                              {assignment.totalMarks && (
                                <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs font-bold text-slate-400">
                                  / {assignment.totalMarks} Marks
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <CreateAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => mutate()}
      />
    </>
  );
}