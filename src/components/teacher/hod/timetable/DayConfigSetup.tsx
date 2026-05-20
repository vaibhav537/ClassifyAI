"use client";

import { CalendarDays, Save } from "lucide-react";
import { useState } from "react";
import { TimetableDayConfig, Weekday } from "@/lib/types";
import { dateToTime, formatWeekday, WEEKDAYS } from "@/utils/timetable";

type ConfigDraft = {
  weekday: Weekday;
  startTime: string;
  endTime: string;
  isWorking: boolean;
};

type DayConfigSetupProps = {
  configs: TimetableDayConfig[];
  onSaved: () => void;
};

export default function DayConfigSetup({
  configs,
  onSaved,
}: DayConfigSetupProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [drafts, setDrafts] = useState<ConfigDraft[]>(() => {
    return WEEKDAYS.map((weekday) => {
      const existing = configs.find((config) => config.weekday === weekday);

      return {
        weekday,
        startTime: existing ? dateToTime(existing.startTime) : "08:00",
        endTime: existing ? dateToTime(existing.endTime) : "14:00",
        isWorking: existing?.isWorking ?? !["SUNDAY"].includes(weekday),
      };
    });
  });

  const updateDraft = (
    weekday: Weekday,
    field: keyof ConfigDraft,
    value: string | boolean,
  ) => {
    setDrafts((previous) =>
      previous.map((draft) =>
        draft.weekday === weekday ? { ...draft, [field]: value } : draft,
      ),
    );
  };

  const saveConfigs = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/teacher/hod/timetable/day-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          configs: drafts.map((draft) => ({
            weekday: draft.weekday,
            startTime: draft.isWorking ? draft.startTime : "00:00",
            endTime: draft.isWorking ? draft.endTime : "00:00",
            isWorking: draft.isWorking,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save college timings");
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save college timings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-100">
              <CalendarDays className="h-3.5 w-3.5" />
              College Timing Setup
            </span>

            <h2 className="mt-4 text-2xl font-extrabold text-white">
              Set working days and timings
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Timetable slots will only be allowed inside these configured
              college hours.
            </p>
          </div>

          <button
            onClick={saveConfigs}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-5 py-3 text-sm font-extrabold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Timings"}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {drafts.map((draft) => (
            <div
              key={draft.weekday}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-extrabold text-white">
                  {formatWeekday(draft.weekday)}
                </p>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={draft.isWorking}
                    onChange={(event) =>
                      updateDraft(
                        draft.weekday,
                        "isWorking",
                        event.target.checked,
                      )
                    }
                    className="h-4 w-4 accent-cyan-400"
                  />
                  Working
                </label>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="text-xs font-bold text-slate-400">
                  Start Time
                  <input
                    type="time"
                    value={draft.startTime}
                    disabled={!draft.isWorking}
                    onChange={(event) =>
                      updateDraft(
                        draft.weekday,
                        "startTime",
                        event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/40 disabled:opacity-40"
                  />
                </label>

                <label className="text-xs font-bold text-slate-400">
                  End Time
                  <input
                    type="time"
                    value={draft.endTime}
                    disabled={!draft.isWorking}
                    onChange={(event) =>
                      updateDraft(draft.weekday, "endTime", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/40 disabled:opacity-40"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
