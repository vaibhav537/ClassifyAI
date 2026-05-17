"use client";
import React, { useEffect, useState } from "react";
import { Event } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#08080C]/65 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:bg-[#08080C]/85 disabled:cursor-not-allowed disabled:opacity-60";

const AddEventModal = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "add" | "edit";
  initialData?: Event | null;
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    type: "EXAM",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [campusId, setCampusId] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    const assistantUserId = localStorage.getItem("assistantId") ?? "";
    const assistantCampusId = localStorage.getItem("CampusID") ?? "";

    setCreatedBy(assistantUserId);
    setCampusId(assistantCampusId);

    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description ?? "",
        date: new Date(initialData.date).toISOString().slice(0, 10),
        type: initialData.type,
        active: initialData.active ?? true,
      });
    } else {
      setForm({
        title: "",
        description: "",
        date: "",
        type: "EXAM",
        active: true,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    showLoadingMessage(
      mode === "add" ? "Creating event..." : "Updating event...",
    );

    try {
      const payload: any = {
        ...form,
        date: new Date(form.date).toISOString(),
        campusId: campusId,
        createdBy: createdBy,
      };

      if (mode === "edit") {
        payload.eventId = initialData?.id;
        payload.active = form.active;
      }

      const res = await fetch(
        mode === "add"
          ? `/api/assistant/event/create`
          : `/api/assistant/event/edit`,
        {
          method: mode === "add" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${mode} event`);
      }

      showSuccessMessage(
        `Event ${mode === "add" ? "created" : "updated"} successfully!`,
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] grid place-items-center overflow-hidden bg-[#08080C]/95 p-3 text-white backdrop-blur-2xl sm:p-5"
          onClick={onClose}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_center,rgba(217,70,239,0.05),transparent_38%)]" />
          <div className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-28 bottom-16 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent" />

            <div className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
                    isEdit
                      ? "border-cyan-300/20 bg-cyan-500/10 text-cyan-200"
                      : "border-violet-300/20 bg-violet-500/10 text-violet-200"
                  }`}
                >
                  {isEdit ? (
                    <Pencil className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {isEdit ? "Edit Event" : "Create Event"}
                </span>

                <h2
                  className="mt-3 text-2xl font-extrabold tracking-tight text-white"
                >
                  {isEdit ? "Edit Campus Event" : "Add New Event"}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {isEdit
                    ? "Update event details and visibility status."
                    : "Create a new campus event for the assistant schedule."}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-5 scrollbar-hide sm:p-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Event Title
                  </label>
                  <input
                    name="title"
                    placeholder="Enter event title"
                    className={inputClass}
                    value={form.title}
                    autoComplete="off"
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Write short event description"
                    className={`${inputClass} min-h-[120px] resize-none`}
                    value={form.description}
                    autoComplete="off"
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Event Date
                    </label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                      <input
                        name="date"
                        type="date"
                        autoComplete="off"
                        className={`${inputClass} pl-11`}
                        value={form.date}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Event Type
                    </label>
                    <select
                      name="type"
                      className={`${inputClass} appearance-none text-slate-300`}
                      value={form.type}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="EXAM" className="bg-[#14141B]">
                        Exam
                      </option>
                      <option value="HOLIDAY" className="bg-[#14141B]">
                        Holiday
                      </option>
                      <option value="EVENT" className="bg-[#14141B]">
                        Event
                      </option>
                      <option value="OTHER" className="bg-[#14141B]">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                {isEdit && (
                  <div>
                    <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Event Status
                    </label>
                    <select
                      name="active"
                      className={`${inputClass} appearance-none text-slate-300`}
                      value={form.active ? "true" : "false"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          active: e.target.value === "true",
                        })
                      }
                      disabled={loading}
                    >
                      <option value="true" className="bg-[#14141B]">
                        Active
                      </option>
                      <option value="false" className="bg-[#14141B]">
                        Inactive
                      </option>
                    </select>
                  </div>
                )}

                <div className="rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                      <Sparkles className="h-4 w-4 text-violet-200" />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-white">
                        Assistant Event Sync
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        This event will be connected with the selected campus
                        and shown inside assistant event sections.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex shrink-0 flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isEdit
                    ? "bg-gradient-to-r from-cyan-600 via-violet-500 to-cyan-500 shadow-cyan-950/40 hover:shadow-cyan-800/30"
                    : "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 shadow-violet-950/40 hover:shadow-violet-800/30"
                }`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEdit ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                {loading
                  ? mode === "add"
                    ? "Adding…"
                    : "Updating…"
                  : mode === "add"
                    ? "Add Event"
                    : "Update Event"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;