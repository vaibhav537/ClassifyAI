"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Attendance, PremiumStatusResponse } from "@/lib/types";
import Greeting from "@/components/student/Greeting";
import Logo from "@/components/apps/Logo";
import UpgradeToPremiumCard from "@/components/student/UpgradeToPremiumCard";
import HorizontalBar from "@/components/student/HorizontalBar";
import AppCalendar from "@/components/student/Calender";
import BarGraph from "@/components/student/Graph";
import NumberCard from "@/components/student/NumberCard";
import {
  Bot,
  CalendarDays,
  LogOut,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ChatBot from "@/components/student/ChatBot";
import PremiumFeaturesCard from "@/components/student/PremiumFeaturesCard";
import { showErrorMessage } from "@/lib/helper";
import FirstLoginModal from "@/components/student/FirstLoginModal";
import FaceVerificationModal from "@/components/student/FaceVerificationModal";
import DashboardLoader from "@/components/student/DashboardLoader";
import NotificationBell from "@/components/student/NotificationBell";
import {
  faBookOpen,
  faBullhorn,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import NotificationHandler from "@/components/ui/NotificationHandler";
import SideButtons from "@/components/student/SideButtons";

export default function StudentDashboard() {
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [needsFaceVerification, setNeedsFaceVerification] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [premiumStatus, setPremiumStatus] =
    useState<PremiumStatusResponse | null>(null);

  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    localStorage.removeItem("studentId");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("adminId");
    localStorage.removeItem("assistantId");
    localStorage.removeItem("userId");
    localStorage.removeItem("lastCampusSlug");
    router.push("/auth/login");
  };

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const campusId = localStorage.getItem("CampusID");

    setLoading(true);

    if (!studentId) {
      showErrorMessage("No student ID found, Login Again.");
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      try {
        const detailsRes = await fetch(
          `/api/student/details?studentId=${studentId}&campusId=${campusId}`,
        );
        const detailsData = await detailsRes.json();

        if (!detailsRes.ok) throw new Error("Failed to fetch user details");

        setStudentDetails(detailsData);

        if (!detailsData.avatarUrl) {
          setIsFirstLogin(true);
          setNeedsFaceVerification(false);
          return;
        }

        setIsFirstLogin(false);

        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (!sessionRes.ok) {
          showErrorMessage(
            sessionData.error || "Session expired. Please login again.",
          );
          router.push("/auth/login");
          return;
        }

        setNeedsFaceVerification(!sessionData.session?.faceVerified);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTodayAttendance = async () => {
      try {
        const res = await fetch(
          `/api/attendance/today?studentId=${studentId}&campusId=${campusId}`,
        );
        const data = await res.json();
        setTodayAttendance(data || []);
      } catch (error) {
        console.log("Error fetching today's attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `/api/attendance/statistics?studentId=${studentId}&campusId=${campusId}`,
        );
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching attendance statistics:", error);
      }
    };

    const fetchPremiumStatus = async () => {
      try {
        const res = await fetch(
          `/api/student/status?studentId=${studentId}&campusId=${campusId}`,
        );
        const data = await res.json();
        setPremiumStatus(data);
      } catch (error) {
        console.error("Error fetching attendance statistics:", error);
      }
    };

    fetchStats();
    fetchTodayAttendance();
    fetchPremiumStatus();
    fetchStudentData();
    // setNeedsFaceVerification(true); //!false for development
  }, []);

  const handleAvatarSuccess = (newAvatarUrl: string) => {
    setStudentDetails((prev: any) => ({ ...prev, avatarUrl: newAvatarUrl }));
    setIsFirstLogin(false);
    setNeedsFaceVerification(true);
  };

  const handleFaceVerificationSuccess = async () => {
    try {
      const res = await fetch("/api/auth/face-verified", {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save face verification");
      }

      setNeedsFaceVerification(false);
    } catch (error: any) {
      console.error("Failed to save face verification: ", error);
      showErrorMessage(error.message || "Face verification can not be saved");
    }
  };

  if (loading) {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C]">
        <div className="pointer-events-none absolute inset-0 app-shell-bg" />
        <div className="relative z-10">
          <DashboardLoader />
        </div>
      </div>
    );
  }

  return (
    <>
      <NotificationHandler userId={localStorage.getItem("studentId") || ""} />

      {isFirstLogin && studentDetails && (
        <FirstLoginModal
          studentId={studentDetails.id}
          onSuccess={handleAvatarSuccess}
        />
      )}

      {needsFaceVerification && studentDetails?.avatarUrl && (
        <FaceVerificationModal
          studentId={studentDetails.id}
          avatarUrl={studentDetails.avatarUrl}
          onSuccess={handleFaceVerificationSuccess}
        />
      )}

      <section className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-3 py-4 text-slate-100 sm:px-5 lg:px-6">
        <div className="pointer-events-none absolute inset-0 app-shell-bg" />
        <div className="pointer-events-none absolute left-10 top-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-[1800px] flex-col gap-5">
          <header className="overflow-visible rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex shrink-0 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3 shadow-xl shadow-black/20">
                  <Logo imageClassName="!w-[145px] sm:!w-[165px] lg:!w-[185px] 2xl:!w-[205px]" />
                </div>

                <div className="hidden h-14 w-px bg-white/10 lg:block" />

                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                    <Sparkles className="h-3 w-3" />
                    Student Dashboard
                  </div>

                  <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    Your learning workspace
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Attendance, exams, resources and AI study tools organized in
                    one place.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 xl:min-w-[430px] xl:max-w-[520px]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <Greeting />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <NotificationBell />

                    <div className="hidden items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-200 sm:flex">
                      <ShieldCheck className="h-4 w-4" />
                      Verified Session
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {premiumStatus?.features?.includes("AI_CHATBOT") && (
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard/student/chat")}
                        className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2.5 text-sm font-bold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
                      >
                        <Bot className="h-4 w-4 text-violet-200" />
                        <span className="hidden sm:inline">Chat AI</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={logout}
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-100 transition duration-300 hover:-translate-y-0.5 hover:border-red-300/45 hover:bg-red-500/20"
                    >
                      <LogOut className="h-4 w-4 text-red-200 transition group-hover:translate-x-0.5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[320px_minmax(360px,430px)_1fr] 2xl:grid-cols-[360px_minmax(420px,500px)_1fr]">
            <aside className="space-y-5">
              <Link
                href="/attendance/scan"
                className="group flex items-center gap-4 rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-400/10 p-5 shadow-2xl shadow-violet-950/20 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/40 hover:shadow-violet-900/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 ring-1 ring-violet-300/20">
                  <QrCode className="h-6 w-6 text-violet-200" />
                </div>

                <div className="text-left">
                  <p className="text-base font-extrabold text-white">
                    Scan QR Attendance
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    Mark your class attendance securely.
                  </p>
                </div>
              </Link>

              <div className="rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                      Today
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-white">
                      Attendance
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <CalendarDays className="h-5 w-5 text-cyan-300" />
                  </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto pr-1">
                  {todayAttendance.length > 0 ? (
                    <ul className="space-y-3">
                      {todayAttendance.map((att, idx) => (
                        <li
                          key={idx}
                          className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-violet-300/30 hover:bg-white/[0.075]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-white">
                                {att.subject}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                Marked by {att.markedBy}
                              </p>
                            </div>

                            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
                              {att.status}
                            </span>
                          </div>

                          <p className="mt-3 text-xs font-medium text-slate-500">
                            {new Date(att.date).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-slate-300">
                        No attendance marked today.
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Your marked classes will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <main className="space-y-5">
              {premiumStatus?.isPremium ? (
                <PremiumFeaturesCard
                  studentId={localStorage.getItem("studentId") || ""}
                  CampusId={localStorage.getItem("CampusID") || ""}
                />
              ) : (
                <UpgradeToPremiumCard />
              )}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <HorizontalBar
                  content="Check your past attendance records"
                  linkRef="/attendance/history"
                  title="Attendance History"
                />
                <HorizontalBar
                  content="Track upcoming exams and assignment deadlines"
                  linkRef="/dashboard/student/exams"
                  title="Upcoming Exams"
                />
                <HorizontalBar
                  content="See how many classes you can skip safely"
                  linkRef="/attendance/stats"
                  title="Bunk Manager"
                  locked={!premiumStatus?.features?.includes("BUNK_MANAGER")}
                />
                <HorizontalBar
                  content="Get a smart study plan based on your upcoming exams"
                  linkRef="/study-plan"
                  title="Study Plan"
                  locked={!premiumStatus?.features?.includes("STUDY_PLAN")}
                />
              </div>
            </main>

            <section className="space-y-5">
              <div className="grid gap-5 2xl:grid-cols-[1fr_88px]">
                <div className="min-w-0 rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                  <BarGraph />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 2xl:grid-cols-1">
                  <SideButtons
                    faIcon={faBookOpen}
                    title="View Assignments"
                    link="/dashboard/student/assignments"
                  />
                  <SideButtons
                    faIcon={faBullhorn}
                    title="View Annoucements"
                    link="/dashboard/student/announcements"
                  />
                  <SideButtons
                    faIcon={faBookOpen}
                    title="View Resources"
                    link="/dashboard/student/resources"
                  />
                  <SideButtons
                    faIcon={faMessage}
                    title="View Messages"
                    link="/chat"
                  />
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1fr_220px]">
                <div className="min-w-0 rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                  <AppCalendar />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                  <NumberCard
                    title="Lectures Attended"
                    value={
                      isNaN(Number.parseInt(stats?.presents))
                        ? "..."
                        : Number.parseInt(stats?.presents).toString()
                    }
                  />

                  <NumberCard
                    title="Attendance %"
                    value={
                      isNaN(Number.parseInt(stats?.presentPercentage))
                        ? "..."
                        : Number.parseInt(stats?.presentPercentage).toString() +
                          "%"
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {premiumStatus?.features?.includes("AI_CHATBOT") && <ChatBot />}
      </section>
    </>
  );
}