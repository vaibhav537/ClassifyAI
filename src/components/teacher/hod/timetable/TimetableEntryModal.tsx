"use client";

import { X } from "lucide-react";
import {
  SectionOption,
  SemesterOption,
  SubjectOption,
  TeacherOption,
  TimetableEntry,
  TimetableFormState,
  TimetableMeta,
  Weekday,
} from "@/lib/types";
import {
  DEFAULT_FORM,
  ENTRY_TYPES,
  formatWeekday,
  isClassType,
  WEEKDAYS,
} from "@/utils/timetable";
import { useEffect, useState } from "react";

type TimetableEntryModalProps = {
  isOpen: boolean;
  initialData?: TimetableFormState | null;
  meta: TimetableMeta;
  onClose: () => void;
  onSaved: () => void;
};

export default function TimetableEntryModal({
  isOpen,
  initialData,
  meta,
  onClose,
  onSaved,
}: TimetableEntryModalProps) {
  const [form, setForm] = useState<TimetableFormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editing = Boolean(form.id);
  const classEntry = isClassType(form.type);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ?? DEFAULT_FORM);
      setError("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const updateForm = (field: keyof TimetableFormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveEntry = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        title: form.title.trim(),
        room: form.room.trim(),
        notes: form.notes.trim(),
        teacherId: classEntry ? form.teacherId : "",
        subjectId: classEntry ? form.subjectId : "",
        semesterId: classEntry ? form.semesterId : form.semesterId,
        sectionId: classEntry ? form.sectionId : form.sectionId,
      };

      const url = editing
        ? `/api/teacher/hod/timetable?id=${form.id}`
        : "/api/teacher/hod/timetable";

      const response = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const conflictText = data.conflict
          ? ` Conflict: ${
              data.conflict.subject?.name ||
              data.conflict.title ||
              data.conflict.type ||
              "existing slot"
            }`
          : "";

        throw new Error(
          `${data.message || "Failed to save timetable entry"}${conflictText}`,
        );
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save timetable entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/70 p-4 backdrop-blur-xl">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#111118] p-5 shadow-2xl shadow-black/40 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-100">
                {editing ? "Update Slot" : "Create Slot"}
              </span>

              <h2 className="mt-4 text-2xl font-extrabold text-white">
                {editing ? "Edit Timetable Entry" : "Add Timetable Entry"}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Add lectures, labs, breaks, lunch, exams or custom timetable
                blocks.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-xs font-bold text-slate-400">
              Entry Type
              <select
                value={form.type}
                onChange={(event) => updateForm("type", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
              >
                {ENTRY_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-[#14141B]">
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-bold text-slate-400">
              Weekday
              <select
                value={form.weekday}
                onChange={(event) =>
                  updateForm("weekday", event.target.value as Weekday)
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
              >
                {WEEKDAYS.map((day) => (
                  <option key={day} value={day} className="bg-[#14141B]">
                    {formatWeekday(day)}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-bold text-slate-400">
              Start Time
              <input
                type="time"
                value={form.startTime}
                onChange={(event) => updateForm("startTime", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
              />
            </label>

            <label className="text-xs font-bold text-slate-400">
              End Time
              <input
                type="time"
                value={form.endTime}
                onChange={(event) => updateForm("endTime", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
              />
            </label>

            {!classEntry && (
              <label className="text-xs font-bold text-slate-400 md:col-span-2">
                Title
                <input
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="Lunch Break, Short Break, Event..."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
                />
              </label>
            )}

            {classEntry && (
              <>
                <label className="text-xs font-bold text-slate-400">
                  Teacher
                  <select
                    value={form.teacherId}
                    onChange={(event) =>
                      updateForm("teacherId", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
                  >
                    <option value="">Select Teacher</option>
                    {meta.teachers.map((teacher: TeacherOption) => (
                      <option
                        key={teacher.id}
                        value={teacher.id}
                        className="bg-[#14141B]"
                      >
                        {teacher.user.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-bold text-slate-400">
                  Subject
                  <select
                    value={form.subjectId}
                    onChange={(event) =>
                      updateForm("subjectId", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
                  >
                    <option value="">Select Subject</option>
                    {meta.subjects.map((subject: SubjectOption) => (
                      <option
                        key={subject.id}
                        value={subject.id}
                        className="bg-[#14141B]"
                      >
                        {subject.code
                          ? `${subject.name} (${subject.code})`
                          : subject.name}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <label className="text-xs font-bold text-slate-400">
              Semester
              <select
                value={form.semesterId}
                onChange={(event) =>
                  updateForm("semesterId", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
              >
                <option value="">Select Semester</option>
                {meta.semesters.map((semester: SemesterOption) => (
                  <option
                    key={semester.id}
                    value={semester.id}
                    className="bg-[#14141B]"
                  >
                    {semester.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-bold text-slate-400">
              Section
              <select
                value={form.sectionId}
                onChange={(event) =>
                  updateForm("sectionId", event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
              >
                <option value="">Select Section</option>
                {meta.sections.map((section: SectionOption) => (
                  <option
                    key={section.id}
                    value={section.id}
                    className="bg-[#14141B]"
                  >
                    {section.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-bold text-slate-400">
              Room
              <input
                value={form.room}
                onChange={(event) => updateForm("room", event.target.value)}
                placeholder="Room 101, Lab 2..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
              />
            </label>

            <label className="text-xs font-bold text-slate-400 md:col-span-2">
              Notes
              <textarea
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
                placeholder="Optional notes..."
                rows={3}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-slate-200 transition hover:bg-white/[0.08]"
            >
              Cancel
            </button>

            <button
              onClick={saveEntry}
              disabled={saving}
              className="rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-5 py-3 text-sm font-extrabold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Update Slot" : "Create Slot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}