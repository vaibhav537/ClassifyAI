"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  Clock,
  Users,
  Calendar,
  BookOpen,
  Radio,
  Sparkles,
} from "lucide-react";
import { TeacherClassSession } from "@/lib/types";
import { showErrorMessage } from "@/lib/helper";
import GenerateTokenDialog from "@/components/teacher/GenerateTokenDialog";
import AttendanceFinalizer from "@/components/teacher/AttendanceFinalizer";
import { motion } from "framer-motion";
import { ClassesLoadingSkeleton } from "@/components/teacher/SkeletonLoaders";

export default function ClassesPage() {
  const [classes, setClasses] = useState<TeacherClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [preselectedClass, setPreselectedClass] = useState<any | null>(null);

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    const campusId = localStorage.getItem("CampusID");

    if (!teacherId || !campusId) {
      showErrorMessage("Session invalid. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchClasses = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/teacher/classes?teacherId=${teacherId}&campusId=${campusId}`,
        );
        const data = await res.json();

        if (res.ok) {
          setClasses(data.classes || []);
        } else {
          throw new Error(data.error || "Failed to fetch classes");
        }
      } catch (error: any) {
        showErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleTakeAttendance = (cls: TeacherClassSession) => {
    setPreselectedClass({
      subjectId: cls.subject.id,
      semesterId: cls.semester.id,
      sectionId: cls.section.id,
    });
    setIsGenerateModalOpen(true);
  };

  if (loading) {
    return <ClassesLoadingSkeleton />;
  }

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
                  Class Schedule
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Your Weekly Schedule
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  View assigned classes and start attendance sessions directly
                  from your schedule.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                    Assigned
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">
                    {classes.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
                    Attendance
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-emerald-100">
                    Ready
                  </p>
                </div>
              </div>
            </div>
          </header>

          {classes.length > 0 ? (
            <motion.section
              className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              {classes.map((cls, index) => (
                <motion.article
                  key={cls.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                        <BookOpen className="h-5 w-5 text-violet-200" />
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 text-xl font-extrabold leading-tight text-white">
                          {cls.subject?.name}
                        </p>

                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                          {cls.weekday}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                        <Users className="h-4 w-4 shrink-0 text-violet-300" />

                        <p className="min-w-0 text-sm font-semibold text-slate-300">
                          {cls.semester?.name.includes("Semester")
                            ? cls.semester?.name
                            : "Semester " + cls.semester?.name}{" "}
                          • {cls.section?.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                        <Calendar className="h-4 w-4 shrink-0 text-cyan-300" />

                        <p className="text-sm font-semibold text-slate-300">
                          {cls.weekday}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                        <Clock className="h-4 w-4 shrink-0 text-emerald-300" />

                        <p className="text-sm font-semibold text-slate-300">
                          {new Date(cls.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(cls.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleTakeAttendance(cls)}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:shadow-violet-800/30"
                    >
                      <Radio className="h-4 w-4" />
                      Take Attendance
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </motion.section>
          ) : (
            <section className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                  <BookOpen className="h-7 w-7 text-violet-200" />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-white">
                  No classes assigned
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You have not been assigned to any classes yet. Once assigned,
                  your weekly schedule will appear here.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      <Suspense fallback={null}>
        <GenerateTokenDialog
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          onSuccess={(classSessionId) => {
            setIsGenerateModalOpen(false);
            setActiveSessionId(classSessionId);
          }}
          preselectedClass={preselectedClass}
        />

        {activeSessionId && (
          <AttendanceFinalizer
            token={activeSessionId}
            onClose={() => setActiveSessionId(null)}
          />
        )}
      </Suspense>
    </>
  );
}
