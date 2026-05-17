"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AssignmentStatus } from "@/lib/types";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Loader2,
  PlusCircle,
  Save,
  ScrollText,
  Trash2,
  X,
} from "lucide-react";

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  mode = "create",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  mode?: "create" | "edit";
}) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [dueDate, setDueDate] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [status, setStatus] = useState<AssignmentStatus>("DRAFT");
  const [rubric, setRubric] = useState("");

  const [teacherSubjects, setTeacherSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasSubmissions =
    initialData?.submissions?.length > 0 ||
    initialData?._count?.submissions > 0;

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title || "");
        try {
          const parsedQuestions = JSON.parse(initialData.description);
          setQuestions(
            Array.isArray(parsedQuestions)
              ? parsedQuestions
              : [initialData.description || ""],
          );
        } catch {
          setQuestions([initialData.description || ""]);
        }
        setDueDate(
          initialData.dueDate
            ? new Date(initialData.dueDate).toISOString().split("T")[0]
            : "",
        );
        setTotalMarks(initialData.totalMarks?.toString() || "");
        setStatus(initialData.status || "DRAFT");
        setRubric(initialData.rubric || "");
        setSelectedSubject(initialData.subjectId || "");
      } else {
        setTitle("");
        setQuestions([""]);
        setDueDate("");
        setTotalMarks("");
        setStatus("DRAFT");
        setRubric("");
      }

      const teacherUserId = localStorage.getItem("teacherId");
      const campusId = localStorage.getItem("CampusID");

      if (teacherUserId && campusId) {
        const fetchSubjects = async () => {
          const res = await fetch(
            `/api/teacher/subjects?teacherId=${teacherUserId}&campusId=${campusId}`,
          );

          if (res.ok) {
            const data = await res.json();
            setTeacherSubjects(data);

            if (data.length > 0) {
              setSelectedSubject(data[0].subject.id);
            }
          }
        };

        fetchSubjects();
      }
    }
  }, [isOpen, mode, initialData]);

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    const teacherUserId = localStorage.getItem("teacherId");
    const campusId = localStorage.getItem("CampusID");

    if (
      !title ||
      !selectedSubject ||
      !teacherUserId ||
      !campusId ||
      !totalMarks
    ) {
      showErrorMessage("Please fill in all required fields.");
      return;
    }

    if (questions.some((q) => !q.trim())) {
      showErrorMessage("Please remove empty questions or fill them in.");
      return;
    }

    setIsLoading(true);
    const actionText = mode === "create" ? "Creating" : "Updating";
    const toastId = showLoadingMessage(`${actionText} assignment...`);

    try {
      const payload = {
        assignmentId: initialData?.id,
        title,
        description: JSON.stringify(questions),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        subjectId: selectedSubject,
        teacherId: teacherUserId,
        campusId,
        totalMarks: parseInt(totalMarks),
        status,
        rubric,
      };

      const response = await fetch("/api/teacher/assignments", {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      toastDissmisser(toastId);

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to ${actionText.toLowerCase()} assignment.`,
        );
      }

      showSuccessMessage(
        `Assignment ${mode === "create" ? "created" : "updated"} successfully!`,
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toastDissmisser(toastId);
      showErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
          initial={{ scale: 0.95, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 24, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-cyan-400/6" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                <FileText className="h-3.5 w-3.5" />
                {mode === "create" ? "Assignment Studio" : "Edit Workspace"}
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {mode === "create" ? "New Assignment" : "Edit Assignment"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add questions, marks, rubric and publishing status for your
                class assignment.
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

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="eg. Linear Algebra Assignment 1"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                      <ScrollText className="h-4 w-4 text-violet-300" />
                      Questions
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Add one or more questions for students to answer.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2.5 text-xs font-extrabold text-violet-100 transition hover:border-violet-300/40 hover:bg-violet-500/20"
                  >
                    <PlusCircle size={16} />
                    Add Question
                  </button>
                </div>

                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#08080C]/45 text-sm font-extrabold text-violet-200">
                        Q{i + 1}
                      </div>

                      <textarea
                        placeholder={`Enter question ${i + 1}...`}
                        value={q}
                        onChange={(e) => updateQuestion(i, e.target.value)}
                        rows={2}
                        className="min-h-[80px] flex-1 resize-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                      />

                      <button
                        type="button"
                        onClick={() => removeQuestion(i)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
                        title="Remove question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    value={totalMarks}
                    disabled={hasSubmissions}
                    required
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className={`w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 ${
                      hasSubmissions
                        ? "cursor-not-allowed opacity-50"
                        : "focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    }`}
                  />
                  {hasSubmissions && (
                    <p className="mt-2 text-xs font-medium text-amber-300">
                      Marks are locked because submissions already exist.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as AssignmentStatus)
                    }
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                  >
                    <option value="DRAFT" className="bg-[#08080C]">
                      Draft
                    </option>
                    <option value="PUBLISHED" className="bg-[#08080C]">
                      Published
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Grading Criteria / Rubric
                </label>
                <textarea
                  placeholder="eg. Accuracy – 10 marks, Steps – 5 marks, Presentation – 5 marks"
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Subject {mode === "edit" && "(Locked)"}
                </label>
                <div className="relative">
                  <BookOpen className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300" />
                  <select
                    disabled={mode === "edit"}
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className={`w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 pl-11 text-sm font-semibold text-white outline-none transition ${
                      mode === "edit"
                        ? "cursor-not-allowed opacity-50"
                        : "focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    }`}
                  >
                    {teacherSubjects.map((ts) => (
                      <option
                        key={ts.id}
                        value={ts.subject.id}
                        className="bg-[#08080C]"
                      >
                        {ts.subject.name} (
                        {ts.semester.name.includes("Semester")
                          ? ts.semester.name
                          : `${ts.semester.name} Semester`}
                        , {ts.section.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Due Date (Optional)
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 pl-11 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading
                ? "Saving..."
                : mode === "create"
                  ? "Create Assignment"
                  : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}