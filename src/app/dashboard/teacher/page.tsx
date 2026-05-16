"use client";

import React, { useState, useEffect, Suspense } from "react";
import { showErrorMessage } from "@/lib/helper";
import {
  TeacherDetails,
  Subject,
  ClassSession,
  AttendanceSessionType,
} from "@/lib/types";

import DashboardSkeleton from "@/components/teacher/DashboardSkeleton";
import DashboardHeader from "@/components/teacher/DashboardHeader";
import {
  QuickActionsCard,
  SubjectsCard,
  ScheduleCard,
  AttendanceSession,
} from "@/components/teacher/ActionCards";
import GenerateTokenDialog from "@/components/teacher/GenerateTokenDialog";
import AttendanceFinalizer from "@/components/teacher/AttendanceFinalizer";
import ActiveSessionTracker from "@/components/teacher/ActiveSessionTracker";
import { BookOpen, CalendarDays, GraduationCap, Radio } from "lucide-react";

export default function TeacherDashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSessionType[]>([]);
  const [details, setDetails] = useState<TeacherDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activeSessionToken, setActiveSessionToken] = useState<string | null>(
    null,
  );
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

  useEffect(() => {
    const teacherUserId = localStorage.getItem("teacherId");
    const campusId = localStorage.getItem("CampusID");

    if (!teacherUserId) {
      showErrorMessage("No teacher ID found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [detailsRes, subjectsRes, timetableRes, attendanceSessionRes] =
          await Promise.all([
            fetch(
              `/api/teacher/id/details?teacherId=${teacherUserId}&campusId=${campusId}`,
            ),
            fetch(
              `/api/teacher/subjects?teacherId=${teacherUserId}&campusId=${campusId}`,
            ),
            fetch(
              `/api/timetable?teacherId=${teacherUserId}&campusId=${campusId}`,
            ),
            fetch(
              `/api/attendance/session?teacherId=${teacherUserId}&campusId=${campusId}`,
            ),
          ]);

        if (
          !detailsRes.ok ||
          !subjectsRes.ok ||
          !timetableRes.ok ||
          !attendanceSessionRes.ok
        ) {
          throw new Error("Failed to load dashboard data.");
        }

        const detailsData = await detailsRes.json();
        const subjectsData = await subjectsRes.json();
        const timetableData = await timetableRes.json();
        const attendanceData = await attendanceSessionRes.json();

        setDetails(detailsData);

        const formattedSubjects: Subject[] = subjectsData.map((item: any) => ({
          id: item.subject.id,
          name: item.subject.name,
          code: item.subject.code,
        }));

        setSubjects(formattedSubjects);
        setClasses(timetableData.sessions || []);
        setAttendance(attendanceData.sessions || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        showErrorMessage("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const handleTimerEnd = () => {
    setIsFinalizeModalOpen(true);
  };

  const handleFinalizeClose = () => {
    setIsFinalizeModalOpen(false);
    setActiveSessionToken(null);
  };

  const todayWeekday = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();

  const todaysClasses = classes.filter((cls) => cls.weekday === todayWeekday);

  const todaysAttendanceSessions = attendance.filter(
    (att) => att.weekday === todayWeekday,
  );

  console.log({ details });

  return (
    <>
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 flex flex-col gap-6">
          <DashboardHeader
            teacherName={details?.name || "Teacher"}
            teacherDesignation={
              details?.teacherProfile?.designation || "Teacher"
            }
            teacherDepartment={
              details?.teacherProfile?.department || "Department"
            }
            onGenerateQrClick={() => setIsGenerateModalOpen(true)}
          />

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                  <BookOpen className="h-5 w-5 text-violet-200" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                    Assigned Subjects
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">
                    {subjects.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-violet-300/20 bg-violet-500/10 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                  <CalendarDays className="h-5 w-5 text-violet-200" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200/70">
                    Classes Today
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-violet-100">
                    {todaysClasses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-500/10 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                  <Radio className="h-5 w-5 text-emerald-300" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
                    Attendance Sessions
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-emerald-100">
                    {todaysAttendanceSessions.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {activeSessionToken && (
            <section className="overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-emerald-500/10 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-2xl">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                  <Radio className="h-5 w-5 text-emerald-300" />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-white">
                    Active Attendance Session
                  </p>
                  <p className="text-xs text-emerald-100/60">
                    Session is live and being tracked.
                  </p>
                </div>
              </div>

              <ActiveSessionTracker
                durationInSeconds={300}
                onTimerEnd={handleTimerEnd}
              />
            </section>
          )}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
            <div className="min-w-0 space-y-6">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <QuickActionsCard />
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <SubjectsCard subjects={subjects} />
              </div>
            </div>

            <aside className="min-w-0 space-y-6">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <GraduationCap className="h-5 w-5 text-violet-200" />
                  </div>

                  <div>
                    <p className="text-base font-extrabold text-white">
                      Today&apos;s Schedule
                    </p>
                    <p className="text-xs text-slate-500">
                      Classes assigned for {todayWeekday}
                    </p>
                  </div>
                </div>

                <ScheduleCard classes={todaysClasses} />
              </div>
            </aside>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <AttendanceSession attendanceSessions={todaysAttendanceSessions} />
          </section>
        </div>
      </main>

      <Suspense
        fallback={
          <div className="grid min-h-[220px] place-items-center text-sm text-slate-500">
            Loading...
          </div>
        }
      >
        <GenerateTokenDialog
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          onSuccess={(token) => {
            setIsGenerateModalOpen(false);
            setActiveSessionToken(token);
          }}
        />

        {isFinalizeModalOpen && activeSessionToken && (
          <AttendanceFinalizer
            token={activeSessionToken}
            onClose={handleFinalizeClose}
          />
        )}
      </Suspense>
    </>
  );
}