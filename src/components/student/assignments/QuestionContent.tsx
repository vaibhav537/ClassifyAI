"use client";

import SubmitAssignmentModal from "@/components/student/SubmitAssignmentModal";
import { motion } from "framer-motion";
import { ChevronLeft, ClipboardList, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import AssignmentHeader from "./AssignmentHeader";
import AssignmentQuestions from "./AssignmentQuestions";
import AssignmentRubric from "./AssignmentRubric";
import AssignmentSubmission from "./AssignmentSubmission";
import SubmitButton from "./SubmitButton";
import CenterMessage from "./CenterMessage";
import LoadingState from "./LoadingState";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const QuestionContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assignmentId = searchParams.get("assignmentId");

  const [mounted, setMounted] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStudentId(localStorage.getItem("studentId"));
  }, []);

  const { data, error, isLoading } = useSWR(
    assignmentId && studentId
      ? `/api/student/assignments/detail?assignmentId=${assignmentId}&studentId=${studentId}`
      : null,
    fetcher,
  );

  const assignment = data?.assignment;
  const hasSubmitted = data?.hasSubmitted;
  const submissionData = data?.submissionData;

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student/assignments")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Assignment Workspace
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Assignment Details
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Review questions, rubric, submission status and submit your
                  assignment from one focused workspace.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Status
                </p>
                <p className="mt-1 text-sm font-extrabold text-white">
                  {isLoading
                    ? "Loading"
                    : hasSubmitted
                      ? "Submitted"
                      : "Pending"}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/70">
                  Module
                </p>
                <p className="mt-1 text-sm font-extrabold text-violet-100">
                  Assignment
                </p>
              </div>
            </div>
          </div>
        </header>

        {!assignmentId ? (
          <CenterMessage text="No Assignment Found" />
        ) : isLoading ? (
          <LoadingState />
        ) : error || !assignment ? (
          <CenterMessage text="Failed to load assignment data. Please try again later." />
        ) : (
          <motion.main
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]"
          >
            <section className="flex min-w-0 flex-col gap-5">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-5">
                <AssignmentHeader assignment={assignment} />
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                      <ClipboardList className="h-5 w-5 text-violet-200" />
                    </div>

                    <div>
                      <h2 className="text-base font-extrabold text-white">
                        Questions
                      </h2>
                      <p className="text-xs text-slate-500">
                        Read each question carefully before submitting.
                      </p>
                    </div>
                  </div>

                  <AssignmentQuestions assignment={assignment} />
                </div>

                <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-5">
                  <AssignmentRubric rubric={assignment.rubric} />
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-5">
                <SubmitButton
                  hasSubmitted={hasSubmitted}
                  onClick={() => setShowSubmitForm(true)}
                />
              </div>
            </section>

            <aside className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-5 xl:sticky xl:top-5 xl:self-start">
              <AssignmentSubmission
                hasSubmitted={hasSubmitted}
                submissionData={submissionData}
                assignment={assignment}
              />
            </aside>
          </motion.main>
        )}
      </div>

      <SubmitAssignmentModal
        isOpen={showSubmitForm}
        onClose={() => setShowSubmitForm(false)}
        onSuccess={() => setShowSubmitForm(false)}
        studentId={studentId}
        assignment={assignment}
      />
    </section>
  );
};

export default QuestionContent;