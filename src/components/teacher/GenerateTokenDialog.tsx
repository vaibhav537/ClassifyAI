"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Subject,
  Semester,
  Student,
  Section,
  PreselectedClass,
} from "@/lib/types";
import {
  getCurrentLocation,
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Monitor,
  QrCode,
  Send,
  Users,
  Wifi,
  X,
} from "lucide-react";

function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />
  );
}

export default function GenerateTokenDialog({
  isOpen,
  onClose,
  onSuccess,
  preselectedClass,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
  preselectedClass?: PreselectedClass | null;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [mode, setMode] = useState<"OFFLINE" | "ONLINE">("OFFLINE");
  const [campusId, setCampusId] = useState<string | null>(null);
  const [isFetchingInitial, setIsFetchingInitial] = useState(false);

  useEffect(() => {
    const storedCampusId = localStorage.getItem("CampusID");
    setCampusId(storedCampusId);
  }, []);

  useEffect(() => {
    if (students && students.length > 0) {
      setSelectedStudents(students.map((s) => s.id));
    }
  }, [students]);

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setSuccess("");
    setSelectedStudents([]);

    async function fetchData() {
      setIsFetchingInitial(true);
      try {
        const teacherUserId = localStorage.getItem("teacherId");

        if (!teacherUserId || !campusId) {
          throw new Error("Teacher ID or Campus ID missing.");
        }

        const assignedRes = await fetch(
          `/api/teacher/subjects?teacherId=${teacherUserId}&campusId=${campusId}`,
        );

        if (!assignedRes.ok) {
          throw new Error("Failed to load assigned class data.");
        }

        const assignedData = await assignedRes.json();

        setAssignedClasses(assignedData);

        const subjectsData = [
          ...new Map(
            assignedData.map((item: any) => [item.subject.id, item.subject]),
          ).values(),
        ] as Subject[];

        const semestersData = [
          ...new Map(
            assignedData.map((item: any) => [item.semester.id, item.semester]),
          ).values(),
        ] as Semester[];

        const sectionsData = [
          ...new Map(
            assignedData.map((item: any) => [item.section.id, item.section]),
          ).values(),
        ] as Section[];

        setSubjects(subjectsData);
        setSemesters(semestersData);
        setSections(sectionsData);

        if (preselectedClass) {
          setSelectedSubject(preselectedClass.subjectId);
          setSelectedSemester(preselectedClass.semesterId);
          setSelectedSection(preselectedClass.sectionId);
        } else {
          if (subjectsData.length > 0) setSelectedSubject(subjectsData[0].id);
          if (semestersData.length > 0)
            setSelectedSemester(semestersData[0].id);
          if (sectionsData.length > 0) setSelectedSection(sectionsData[0].id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetchingInitial(false);
      }
    }

    fetchData();
  }, [isOpen, preselectedClass, campusId]);

  useEffect(() => {
    if (!selectedSemester || !selectedSection) return;

    async function fetchStudents() {
      setIsFetchingStudents(true);
      setStudents([]);
      setSelectedStudents([]);

      try {
        const res = await fetch(
          `/api/teacher/semester/students?semesterId=${selectedSemester}&sectionId=${selectedSection}&campusId=${campusId}`,
        );

        if (!res.ok) throw new Error("Failed to fetch students.");

        const data = await res.json();
        setStudents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetchingStudents(false);
      }
    }

    fetchStudents();
  }, [selectedSemester, selectedSection, campusId]);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const availableSemesters = [
    ...new Map(
      assignedClasses
        .filter((item) => item.subject.id === selectedSubject)
        .map((item) => [item.semester.id, item.semester]),
    ).values(),
  ] as Semester[];

  const availableSections = [
    ...new Map(
      assignedClasses
        .filter(
          (item) =>
            item.subject.id === selectedSubject &&
            item.semester.id === selectedSemester,
        )
        .map((item) => [item.section.id, item.section]),
    ).values(),
  ] as Section[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    showLoadingMessage("Getting your location...");

    const teacherUserId = localStorage.getItem("teacherId");

    if (!teacherUserId) {
      setError("Could not find teacher ID. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      let location = null;

      if (mode === "OFFLINE") {
        location = await getCurrentLocation();
        showLoadingMessage("Location found. Generating tokens...");
      }

      const response = await fetch("/api/attendance/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubject,
          semesterId: selectedSemester,
          studentIds: selectedStudents,
          teacherUserId,
          sectionId: selectedSection,
          location,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showErrorMessage(data.message);
        throw new Error(data.message);
      }

      setSuccess("Tokens sent successfully! Starting session...");
      showSuccessMessage("Tokens sent successfully!");

      setTimeout(() => {
        onSuccess(data.classSessionId);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-cyan-400/6" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

            <div className="relative z-10 flex max-h-[92vh] flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                    <QrCode className="h-3.5 w-3.5" />
                    Attendance Token
                  </div>

                  <h2 className="text-2xl font-extrabold tracking-tight text-white">
                    Generate & Send QR Codes
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select class details and students to start a secure
                    attendance session.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Subject
                    </label>

                    {isFetchingInitial ? (
                      <SkeletonBox className="h-12 w-full" />
                    ) : (
                      <select
                        value={selectedSubject}
                        onChange={(e) => {
                          const subjectId = e.target.value;
                          setSelectedSubject(subjectId);

                          const firstMatchingClass = assignedClasses.find(
                            (item) => item.subject.id === subjectId,
                          );

                          if (firstMatchingClass) {
                            setSelectedSemester(firstMatchingClass.semester.id);
                            setSelectedSection(firstMatchingClass.section.id);
                          } else {
                            setSelectedSemester("");
                            setSelectedSection("");
                          }
                        }}
                        className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                      >
                        {subjects.map((s) => (
                          <option
                            key={s.id}
                            value={s.id}
                            className="bg-[#08080C]"
                          >
                            {s.name} {s.code && `(${s.code})`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Semester
                    </label>

                    {isFetchingInitial ? (
                      <SkeletonBox className="h-12 w-full" />
                    ) : (
                      <select
                        value={selectedSemester}
                        onChange={(e) => {
                          const semesterId = e.target.value;
                          setSelectedSemester(semesterId);

                          const firstMatchingClass = assignedClasses.find(
                            (item) =>
                              item.subject.id === selectedSubject &&
                              item.semester.id === semesterId,
                          );

                          if (firstMatchingClass) {
                            setSelectedSection(firstMatchingClass.section.id);
                          } else {
                            setSelectedSection("");
                          }
                        }}
                        className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                      >
                        {availableSemesters.map((s) => (
                          <option
                            key={s.id}
                            value={s.id}
                            className="bg-[#08080C]"
                          >
                            {s.name.includes("Semester")
                              ? s.name
                              : `Semester ${s.name}`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Section
                    </label>

                    {isFetchingInitial ? (
                      <SkeletonBox className="h-12 w-full" />
                    ) : (
                      <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                      >
                        {availableSections.map((s) => (
                          <option
                            key={s.id}
                            value={s.id}
                            className="bg-[#08080C]"
                          >
                            {s.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                        <Users className="h-4 w-4 text-violet-300" />
                        Select Students
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {selectedStudents.length} selected from{" "}
                        {students.length} students
                      </p>
                    </div>

                    {students.length > 0 && (
                      <div className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 text-xs font-extrabold text-violet-200">
                        {selectedStudents.length} Selected
                      </div>
                    )}
                  </div>

                  {isFetchingStudents ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-8 text-sm font-bold text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
                      Loading students...
                    </div>
                  ) : (
                    <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-[#08080C]/45 p-2 sm:grid-cols-2">
                      {students.length > 0 ? (
                        students.map((student, index) => {
                          const isSelected = selectedStudents.includes(
                            student.id,
                          );

                          return (
                            <motion.label
                              key={student.id}
                              htmlFor={`student-${student.id}`}
                              className={`group flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition duration-300 ${
                                isSelected
                                  ? "border-violet-300/35 bg-violet-500/15"
                                  : "border-transparent hover:border-white/10 hover:bg-white/[0.055]"
                              }`}
                              initial={{ opacity: 0, x: -14 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.025 }}
                            >
                              <input
                                type="checkbox"
                                id={`student-${student.id}`}
                                checked={isSelected}
                                onChange={() => handleStudentSelect(student.id)}
                                className="h-4 w-4 rounded border-white/20 bg-[#08080C] text-violet-500 focus:ring-violet-500"
                              />

                              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-200">
                                {student.user.name}
                              </span>

                              {isSelected && (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-200" />
                              )}
                            </motion.label>
                          );
                        })
                      ) : (
                        <p className="col-span-full px-4 py-8 text-center text-sm font-medium text-slate-500">
                          No students found for this semester/section.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-1.5">
                  <button
                    type="button"
                    onClick={() => setMode("OFFLINE")}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold uppercase transition duration-300 ${
                      mode === "OFFLINE"
                        ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                        : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    Offline
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("ONLINE")}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold uppercase transition duration-300 ${
                      mode === "ONLINE"
                        ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                        : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                    Online
                  </button>
                </div>

                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                      {mode === "OFFLINE" ? (
                        <MapPin className="h-5 w-5 text-emerald-300" />
                      ) : (
                        <Wifi className="h-5 w-5 text-emerald-300" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-white">
                        {mode === "OFFLINE"
                          ? "Offline verification enabled"
                          : "Online attendance mode"}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {mode === "OFFLINE"
                          ? "Location will be requested before generating attendance tokens."
                          : "Location verification will be skipped for online attendance."}
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-500/10 p-3 text-sm font-semibold text-red-200">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-200">
                    {success}
                  </p>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !selectedSubject ||
                      !selectedSemester ||
                      !selectedSection ||
                      selectedStudents.length === 0
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isLoading ? "Sending..." : "Generate & Send Emails"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
