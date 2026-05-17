"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";
import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  Loader2,
  Save,
  UserRound,
  X,
} from "lucide-react";

enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  PENDING = "PENDING",
}

export default function EditAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  attendanceRecord,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  attendanceRecord: any;
}) {
  const [newStatus, setNewStatus] = useState<AttendanceStatus>(
    attendanceRecord?.status,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTeacherId(localStorage.getItem("teacherId"));
      setNewStatus(attendanceRecord?.status);
    }
  }, [isOpen, attendanceRecord]);

  const handleUpdate = async () => {
    if (!teacherId) {
      showErrorMessage("Session error. Please log in again.");
      return;
    }

    if (!newStatus || newStatus === attendanceRecord.status) {
      showErrorMessage("Please select a new status.");
      return;
    }

    setIsLoading(true);
    const toastId = showLoadingMessage("Updating status...");

    try {
      const response = await fetch("/api/teacher/past-attendance/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendanceId: attendanceRecord.id,
          teacherId: teacherId,
          newStatus: newStatus,
        }),
      });

      const data = await response.json();
      toastDissmisser(toastId);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status.");
      }

      showSuccessMessage("Attendance status updated successfully!");
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

  const statusStyles: Record<AttendanceStatus, string> = {
    PRESENT: "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
    ABSENT: "border-red-300/20 bg-red-500/10 text-red-300",
    LATE: "border-amber-300/20 bg-amber-500/10 text-amber-300",
    PENDING: "border-slate-300/20 bg-slate-500/10 text-slate-300",
  };

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
          className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
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
                <Edit3 className="h-3.5 w-3.5" />
                Attendance Editor
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Edit Attendance
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update the attendance status for this record.
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

          <div className="relative z-10 px-5 py-5 sm:px-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <UserRound className="h-4 w-4 text-violet-200" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Student
                    </p>
                    <p className="truncate text-sm font-extrabold text-white">
                      {attendanceRecord.studentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                    <CheckCircle2 className="h-4 w-4 text-cyan-200" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Subject
                    </p>
                    <p className="truncate text-sm font-extrabold text-white">
                      {attendanceRecord.subjectName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                    <CalendarDays className="h-4 w-4 text-emerald-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Date
                    </p>
                    <p className="truncate text-sm font-extrabold text-white">
                      {new Date(attendanceRecord.markedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Change Status
              </label>

              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value as AttendanceStatus)
                }
                className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
              >
                <option
                  value={AttendanceStatus.PRESENT}
                  className="bg-[#08080C]"
                >
                  Present
                </option>
                <option
                  value={AttendanceStatus.ABSENT}
                  className="bg-[#08080C]"
                >
                  Absent
                </option>
                <option value={AttendanceStatus.LATE} className="bg-[#08080C]">
                  Late
                </option>
              </select>

              {newStatus && (
                <div
                  className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] ${statusStyles[newStatus]}`}
                >
                  Selected: {newStatus}
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10 flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
