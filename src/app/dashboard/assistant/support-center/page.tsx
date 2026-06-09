"use client";

import { useEffect, useState } from "react";
import SupportCenterHeader from "@/components/assistant/support-center/SupportCenterHeader";
import SupportStatsCards from "@/components/assistant/support-center/SupportStatsCards";
import SupportCasesTable from "@/components/assistant/support-center/SupportCasesTable";
import RecentRiskEventsPanel from "@/components/assistant/support-center/RecentRiskEventsPanel";
import RecentSupportActivityPanel from "@/components/assistant/support-center/RecentSupportActivityPanel";
import SupportCaseDrawer from "@/components/assistant/support-center/SupportCaseDrawer";
import {
  RiskEvent,
  SupportActivity,
  SupportCaseRow,
  SupportStats,
} from "@/lib/types";
import { AlertCircle, HeartHandshake, Loader2 } from "lucide-react";

export default function SupportCenterPage() {
  const [cases, setCases] = useState<SupportCaseRow[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const [stats, setStats] = useState<SupportStats>({
    atRiskStudents: 0,
    escalatedCases: 0,
    highPriorityCases: 0,
    openCases: 0,
    resolvedThisWeek: 0,
  });

  const [recentRiskEvents, setRecentRiskEvents] = useState<RiskEvent[]>([]);
  const [recentSupportActivity, setRecentSupportActivity] = useState<
    SupportActivity[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchCases = async (id: string) => {
    const res = await fetch(`/api/support/cases?campusId=${id}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to load support cases");
    }

    setCases(
      result.data.cases.map((item: any) => ({
        id: item.id,
        studentName: item.student?.user?.name || "Unknown Student",
        rollNumber: item.student?.rollNumber || "N/A",
        subject: item.subject?.name || "Unknown Subject",
        risk: item.riskEvent?.title || item.title || "Attendance risk detected",
        priority: item.priority,
        status: item.status,
        lastFollowUp: item.lastFollowUpAt
          ? new Date(item.lastFollowUpAt).toLocaleString()
          : "No follow-up yet",
        conversationId: item.circleOfCareGroup?.conversationId || null,
      })),
    );
  };

  const loadSupportCenterData = async (id: string) => {
    try {
      setIsLoading(true);
      setError("");

      await Promise.all([fetchStats(id), fetchCases(id)]);
    } catch (error) {
      console.error(error);
      setError("Unable to load support center data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async (id: string) => {
    try {
      setError("");

      const res = await fetch(`/api/support/dashboard/stats?campusId=${id}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.error || "Failed to load support dashboard stats",
        );
      }

      setStats(result.data.summary);

      setRecentSupportActivity(
        result.data.recentSupportActivity.map((activity: any) => ({
          id: activity.id,
          title: activity.title || "Support activity",
          caseTitle: activity.supportCase?.title || "Support case",
          actor: activity.actor?.name || activity.actor?.username || "SYSTEM",
          time: new Date(activity.createdAt).toLocaleString(),
        })),
      );

      setRecentRiskEvents(
        result.data.recentRiskEvents.map((event: any) => ({
          id: event.id,
          studentName: event.student?.user?.name || "Unknown Student",
          subject: event.subject?.name || "Unknown Subject",
          severity: event.severity,
          title: event.title || "Attendance risk detected",
          time: new Date(event.detectedAt).toLocaleString(),
        })),
      );
    } catch (error: any) {
      console.error(error);
      setError("Unable to load support center data.");
    }
  };

  useEffect(() => {
    const CampusID = localStorage.getItem("CampusID");

    if (CampusID) {
      loadSupportCenterData(CampusID);
    } else {
      setError("No Campus Id found, Login again");
    }
  }, []);

  if (error) {
    return (
      <main className="relative grid min-h-[calc(100vh-8rem)] place-items-center overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.06),transparent_30%)]" />
        <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-red-300/20 bg-red-500/10 p-7 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-300" />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-red-200">
            Support Center Error
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-100/70">{error}</p>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="relative grid min-h-[calc(100vh-8rem)] place-items-center overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-8 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />

          <div className="relative z-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
              <HeartHandshake className="h-3.5 w-3.5" />
              Circle of Care
            </div>

            <p className="mt-4 text-lg font-extrabold text-white">
              Loading support center data...
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Fetching attendance risks, support activity and dashboard stats.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1800px] flex-col gap-6">
        <SupportCenterHeader />

        <SupportStatsCards stats={stats} />

        <section className="min-w-0">
          <SupportCasesTable
            cases={cases}
            onViewCase={(caseId) => setSelectedCaseId(caseId)}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentRiskEventsPanel events={recentRiskEvents} />
          <RecentSupportActivityPanel activities={recentSupportActivity} />
        </section>
      </div>

      <SupportCaseDrawer
        caseId={selectedCaseId}
        open={Boolean(selectedCaseId)}
        onClose={() => setSelectedCaseId(null)}
      />
    </main>
  );
}
