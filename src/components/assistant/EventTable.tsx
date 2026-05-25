"use client";

import React from "react";
import { Event } from "@/lib/types";
import {
  CalendarDays,
  CheckCircle2,
  CircleSlash,
  Pencil,
  Sparkles,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EventTable = ({
  events,
  onEdit,
  onDelete,
}: {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}) => {
  if (events.length === 0) {
    return (
      <div className="grid min-h-[22rem] place-items-center rounded-[1.75rem] border border-dashed border-white/10 bg-[#08080C]/45 p-6 text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
            <CalendarDays className="h-7 w-7 text-violet-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            No events found
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Add your first campus event to show it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full text-white"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        <div className="relative z-10 hidden max-h-[34rem] overflow-auto scrollbar-hide lg:block">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="sticky top-0 z-20 border-b border-white/10 bg-[#14141B]/95 backdrop-blur-2xl">
              <tr className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              <AnimatePresence>
                {events.map((event, idx) => (
                  <motion.tr
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      delay: idx * 0.025,
                    }}
                    className="group transition duration-300 hover:bg-white/[0.045]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                          <CalendarDays className="h-4 w-4 text-violet-200" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-white">
                            {event.title}
                          </p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                            Campus Event
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                        <CalendarDays className="h-4 w-4 text-slate-600" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-cyan-200">
                        {event.type}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {event.active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-300">
                          <CircleSlash className="h-3.5 w-3.5" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onEdit(event)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-violet-200 transition hover:bg-violet-500/20"
                          aria-label="Edit event"
                        >
                          <Pencil className="h-4 w-4" />
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onDelete(event)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                          aria-label="Delete event"
                        >
                          <Trash className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="relative z-10 max-h-[34rem] overflow-y-auto p-3 scrollbar-hide lg:hidden">
          <div className="space-y-3">
            <AnimatePresence>
              {events.map((event, idx) => (
                <motion.article
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: idx * 0.025,
                  }}
                  className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#14141B]/75 p-4 shadow-xl shadow-black/20"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 shrink-0 text-violet-200" />
                          <p className="truncate text-sm font-extrabold text-white">
                            {event.title}
                          </p>
                        </div>

                        <p className="mt-2 text-xs font-semibold text-slate-500">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>

                      {event.active ? (
                        <span className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-red-300">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Type
                      </span>

                      <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-cyan-200">
                        {event.type}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onEdit(event)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3 text-xs font-extrabold text-violet-200 transition hover:bg-violet-500/20"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onDelete(event)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-xs font-extrabold text-red-300 transition hover:bg-red-500/20"
                      >
                        <Trash className="h-4 w-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventTable;
