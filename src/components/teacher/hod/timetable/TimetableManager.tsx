"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DayConfigSetup from "./DayConfigSetup";
import TimetableEntryCard from "./TimetableEntryCard";
import TimetableEntryModal from "./TimetableEntryModal";
import TimetableToolbar from "./TimetableToolbar";
import { TimetableEntry, TimetableFormState, TimetableMeta } from "@/lib/types";
import {
  buildEditForm,
  DEFAULT_FORM,
  formatWeekday,
  groupEntriesByWeekday,
  WEEKDAYS,
} from "@/utils/timetable";

export default function TimetableManager() {
  const router = useRouter();

  const [meta, setMeta] = useState<TimetableMeta>({
    teachers: [],
    subjects: [],
    semesters: [],
    sections: [],
    dayConfigs: [],
  });

  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedWeekday, setSelectedWeekday] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<TimetableFormState | null>(
    null,
  );

  const hasDayConfig = meta.dayConfigs.length > 0;

  const fetchMeta = useCallback(async () => {
    const response = await fetch("/api/teacher/hod/timetable/meta");
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch timetable meta");
    }

    setMeta({
      teachers: data.teachers || [],
      subjects: data.subjects || [],
      semesters: data.semesters || [],
      sections: data.sections || [],
      dayConfigs: data.dayConfigs || [],
    });
  }, []);

  const fetchEntries = useCallback(async () => {
    try {
      setEntriesLoading(true);

      const params = new URLSearchParams();

      if (selectedWeekday) params.set("weekday", selectedWeekday);
      if (selectedSemesterId) params.set("semesterId", selectedSemesterId);
      if (selectedSectionId) params.set("sectionId", selectedSectionId);
      if (selectedTeacherId) params.set("teacherId", selectedTeacherId);

      const query = params.toString();
      const response = await fetch(
        `/api/teacher/hod/timetable${query ? `?${query}` : ""}`,
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch timetable entries");
      }

      setEntries(data.entries || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch timetable entries");
    } finally {
      setEntriesLoading(false);
    }
  }, [
    selectedWeekday,
    selectedSemesterId,
    selectedSectionId,
    selectedTeacherId,
  ]);

  const bootstrap = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      await fetchMeta();
      await fetchEntries();
    } catch (err: any) {
      setError(err.message || "Failed to load timetable manager");
    } finally {
      setLoading(false);
    }
  }, [fetchEntries, fetchMeta]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!loading) {
      fetchEntries();
    }
  }, [
    selectedWeekday,
    selectedSemesterId,
    selectedSectionId,
    selectedTeacherId,
    fetchEntries,
    loading,
  ]);

  const groupedEntries = useMemo(
    () => groupEntriesByWeekday(entries),
    [entries],
  );

  const openAddModal = () => {
    setEditingForm(DEFAULT_FORM);
    setModalOpen(true);
  };

  const openEditModal = (entry: TimetableEntry) => {
    setEditingForm(buildEditForm(entry));
    setModalOpen(true);
  };

  const deleteEntry = async (entry: TimetableEntry) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this timetable slot?",
    );

    if (!confirmDelete) return;

    try {
      setError("");

      const response = await fetch(
        `/api/teacher/hod/timetable?id=${entry.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete timetable entry");
      }

      await fetchEntries();
    } catch (err: any) {
      setError(err.message || "Failed to delete timetable entry");
    }
  };

  const handleModalSaved = async () => {
    await fetchMeta();
    await fetchEntries();
  };

  if (loading) {
    return (
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 grid min-h-[70vh] place-items-center p-4">
          <div className="rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-8 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-200" />
            <p className="mt-4 text-lg font-extrabold text-white">
              Loading Timetable Manager...
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Preparing academic scheduler.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

      <div className="relative z-10 flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <button
                onClick={() => router.push("/dashboard/teacher/hod")}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-extrabold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to HOD Center
              </button>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-100">
                <CalendarClock className="h-3.5 w-3.5" />
                Academic Scheduler
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Manage Timetable
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Create flexible weekly timetables with working-day timing,
                lectures, labs, breaks, rooms, semester and section conflict
                checks.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
                  HOD Access
                </p>
                <p className="text-sm font-extrabold text-emerald-100">
                  Verified
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-[1.5rem] border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        {!hasDayConfig ? (
          <DayConfigSetup configs={meta.dayConfigs} onSaved={bootstrap} />
        ) : (
          <>
            <DayConfigSetup configs={meta.dayConfigs} onSaved={bootstrap} />

            <TimetableToolbar
              selectedWeekday={selectedWeekday}
              selectedSemesterId={selectedSemesterId}
              selectedSectionId={selectedSectionId}
              selectedTeacherId={selectedTeacherId}
              semesters={meta.semesters}
              sections={meta.sections}
              teachers={meta.teachers}
              loading={entriesLoading}
              onWeekdayChange={setSelectedWeekday}
              onSemesterChange={setSelectedSemesterId}
              onSectionChange={setSelectedSectionId}
              onTeacherChange={setSelectedTeacherId}
              onRefresh={fetchEntries}
              onAdd={openAddModal}
            />

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {WEEKDAYS.map((day) => {
                const dayEntries = groupedEntries[day];

                return (
                  <div
                    key={day}
                    className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-cyan-500/[0.04]" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-extrabold text-white">
                          {formatWeekday(day)}
                        </h2>

                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold text-slate-300">
                          {dayEntries.length} Slots
                        </span>
                      </div>

                      <div className="mt-4 flex flex-col gap-3">
                        {dayEntries.length === 0 ? (
                          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-5 text-center text-sm font-semibold text-slate-500">
                            No timetable slots for this day.
                          </div>
                        ) : (
                          dayEntries.map((entry) => (
                            <TimetableEntryCard
                              key={entry.id}
                              entry={entry}
                              onEdit={openEditModal}
                              onDelete={deleteEntry}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        )}
      </div>

      <TimetableEntryModal
        isOpen={modalOpen}
        initialData={editingForm}
        meta={meta}
        onClose={() => {
          setModalOpen(false);
          setEditingForm(null);
        }}
        onSaved={handleModalSaved}
      />
    </main>
  );
}
