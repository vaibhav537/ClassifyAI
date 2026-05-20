"use client";

import { Plus, RefreshCw } from "lucide-react";
import {
  SectionOption,
  SemesterOption,
  TeacherOption,
  Weekday,
} from "@/lib/types";
import { formatWeekday, WEEKDAYS } from "@/utils/timetable";

type TimetableToolbarProps = {
  selectedWeekday: string;
  selectedSemesterId: string;
  selectedSectionId: string;
  selectedTeacherId: string;
  semesters: SemesterOption[];
  sections: SectionOption[];
  teachers: TeacherOption[];
  loading: boolean;
  onWeekdayChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onSectionChange: (value: string) => void;
  onTeacherChange: (value: string) => void;
  onRefresh: () => void;
  onAdd: () => void;
};

export default function TimetableToolbar({
  selectedWeekday,
  selectedSemesterId,
  selectedSectionId,
  selectedTeacherId,
  semesters,
  sections,
  teachers,
  loading,
  onWeekdayChange,
  onSemesterChange,
  onSectionChange,
  onTeacherChange,
  onRefresh,
  onAdd,
}: TimetableToolbarProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/8" />

      <div className="relative z-10 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        <select
          value={selectedWeekday}
          onChange={(event) => onWeekdayChange(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
        >
          <option value="">All Days</option>
          {WEEKDAYS.map((day: Weekday) => (
            <option key={day} value={day} className="bg-[#14141B]">
              {formatWeekday(day)}
            </option>
          ))}
        </select>

        <select
          value={selectedSemesterId}
          onChange={(event) => onSemesterChange(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
        >
          <option value="">All Semesters</option>
          {semesters.map((semester) => (
            <option
              key={semester.id}
              value={semester.id}
              className="bg-[#14141B]"
            >
              {semester.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSectionId}
          onChange={(event) => onSectionChange(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
        >
          <option value="">All Sections</option>
          {sections.map((section) => (
            <option
              key={section.id}
              value={section.id}
              className="bg-[#14141B]"
            >
              {section.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTeacherId}
          onChange={(event) => onTeacherChange(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300/40"
        >
          <option value="">All Teachers</option>
          {teachers.map((teacher) => (
            <option
              key={teacher.id}
              value={teacher.id}
              className="bg-[#14141B]"
            >
              {teacher.user.name}
            </option>
          ))}
        </select>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-extrabold text-slate-200 transition hover:bg-white/[0.08] disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-4 py-3 text-sm font-extrabold text-cyan-100 transition hover:bg-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          Add Slot
        </button>
      </div>
    </section>
  );
}
