"use client";

import { Edit3, Trash2 } from "lucide-react";
import { TimetableEntry } from "@/lib/types";
import { formatTime, formatWeekday, isClassType } from "@/utils/timetable";

type TimetableEntryCardProps = {
  entry: TimetableEntry;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (entry: TimetableEntry) => void;
};

export default function TimetableEntryCard({
  entry,
  onEdit,
  onDelete,
}: TimetableEntryCardProps) {
  const classEntry = isClassType(entry.type);

  return (
    <article className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/25 hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-100">
                {entry.type.replace("_", " ")}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold text-slate-300">
                {formatWeekday(entry.weekday)}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-extrabold text-white">
              {classEntry
                ? entry.subject?.name || "Class Slot"
                : entry.title || "Timetable Slot"}
            </h3>

            <p className="mt-1 text-sm font-bold text-cyan-100">
              {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(entry)}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              title="Edit"
            >
              <Edit3 className="h-4 w-4" />
            </button>

            <button
              onClick={() => onDelete(entry)}
              className="rounded-xl border border-red-300/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-400 sm:grid-cols-2">
          {classEntry && (
            <>
              <p>
                <span className="font-bold text-slate-300">Teacher:</span>{" "}
                {entry.teacher?.user.name || "N/A"}
              </p>
              <p>
                <span className="font-bold text-slate-300">Subject:</span>{" "}
                {entry.subject?.code
                  ? `${entry.subject.name} (${entry.subject.code})`
                  : entry.subject?.name || "N/A"}
              </p>
              <p>
                <span className="font-bold text-slate-300">Semester:</span>{" "}
                {entry.semester?.name || "N/A"}
              </p>
              <p>
                <span className="font-bold text-slate-300">Section:</span>{" "}
                {entry.section?.name || "N/A"}
              </p>
            </>
          )}

          <p>
            <span className="font-bold text-slate-300">Room:</span>{" "}
            {entry.room || "Not assigned"}
          </p>

          {entry.notes && (
            <p className="sm:col-span-2">
              <span className="font-bold text-slate-300">Notes:</span>{" "}
              {entry.notes}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
