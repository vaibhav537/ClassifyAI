"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { useEffect, useState } from "react";
import AssignmentHeader from "@/components/teacher/assignments/AssignmentHeader";
import AssignmentAnalytics from "@/components/teacher/assignments/AssignmentAnalytics";
import SubmissionTable from "@/components/teacher/assignments/SubmissionTable";
import GradeSubmissionModal from "@/components/teacher/GradeSubmissionModal";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";
import CreateAssignmentModal from "@/components/teacher/CreateAssignmentModal";
import { AlertCircle, FileText, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AssignmentDetailPage() {
  const params = useParams();
  const assignmentId = params.assignmentId as string;
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);
  const [submissionToGrade, setSubmissionToGrade] = useState<any | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setTeacherId(localStorage.getItem("teacherId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const {
    data: assignmentData,
    mutate: mutateAssignment,
    isLoading: aLoading,
  } = useSWR(
    assignmentId && teacherId && campusId
      ? `/api/teacher/assignments?assignmentId=${assignmentId}&teacherId=${teacherId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const { data: analyticsData, isLoading: bLoading } = useSWR(
    assignmentId && teacherId
      ? `/api/teacher/assignments/analytics?assignmentId=${assignmentId}&teacherId=${teacherId}`
      : null,
    fetcher,
  );

  const handleStatusChange = async (newStatus: "PUBLISHED" | "DRAFT") => {
    setIsStatusLoading(true);
    const toastId = showLoadingMessage("Updating status...");

    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId,
          teacherId,
          campusId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      toastDissmisser(toastId);

      if (res.ok) {
        showSuccessMessage("Status updated!");
        mutateAssignment();
      } else {
        showErrorMessage(data.error || "Failed to update status.");
      }
    } catch {
      toastDissmisser(toastId);
      showErrorMessage("Network error.");
    } finally {
      setIsStatusLoading(false);
    }
  };

  if (aLoading || bLoading) {
    return (
      <main className="relative grid min-h-[calc(100vh-8rem)] place-items-center overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-8 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />

          <div className="relative z-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
            </div>

            <p className="mt-5 text-lg font-extrabold text-white">
              Loading assignment
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Fetching submissions, analytics and assignment details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!assignmentData?.assignment) {
    return (
      <main className="relative grid min-h-[calc(100vh-8rem)] place-items-center overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.06),transparent_30%)]" />

        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-red-300/20 bg-red-500/10 p-8 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-300" />
          </div>

          <p className="mt-5 text-lg font-extrabold text-red-200">
            Error loading data
          </p>

          <p className="mt-2 text-sm leading-6 text-red-100/70">
            Assignment details could not be loaded. Please go back and try
            again.
          </p>
        </div>
      </main>
    );
  }

  const { assignment } = assignmentData;

  const sortedSubmissions = [...(assignment.submissions || [])].sort(
    (a: any, b: any) => {
      if (a.grade === null && b.grade !== null) return -1;
      if (a.grade !== null && b.grade === null) return 1;

      return (
        new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      );
    },
  );

  return (
    <main className="relative min-h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <FileText className="h-5 w-5 text-violet-200" />
            </div>

            <div>
              <p className="text-sm font-extrabold text-white">
                Assignment Workspace
              </p>
              <p className="text-xs text-slate-500">
                Manage status, analytics and student submissions.
              </p>
            </div>
          </div>

          <AssignmentHeader
            assignment={assignment}
            handleStatusChange={handleStatusChange}
            isStatusLoading={isStatusLoading}
            onEditClick={() => setIsEditModalOpen(true)}
          />
        </div>

        {analyticsData?.analytics && (
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <AssignmentAnalytics analytics={analyticsData.analytics} />
          </div>
        )}

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
          <SubmissionTable
            submissions={sortedSubmissions}
            dueDate={assignment.dueDate}
            totalMarks={assignment.totalMarks}
            onGrade={setSubmissionToGrade}
          />
        </div>
      </div>

      {submissionToGrade && (
        <GradeSubmissionModal
          isOpen={!!submissionToGrade}
          onClose={() => setSubmissionToGrade(null)}
          onSuccess={() => mutateAssignment()}
          submission={submissionToGrade}
          allSubmissions={sortedSubmissions}
          onNavigate={(nextSub) => setSubmissionToGrade(nextSub)}
          totalMarks={assignment.totalMarks}
          dueDate={assignment.dueDate}
        />
      )}

      {isEditModalOpen && (
        <CreateAssignmentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={assignment}
          mode="edit"
          onSuccess={() => {
            mutateAssignment();
            setIsEditModalOpen(false);
          }}
        />
      )}
    </main>
  );
}