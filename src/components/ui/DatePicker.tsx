"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null,
  );

  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date(),
  );

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition hover:border-violet-300/35 hover:bg-white/[0.055] focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
      >
        <span className={selectedDate ? "text-white" : "text-slate-500"}>
          {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Select Date"}
        </span>

        <Calendar className="h-4 w-4 shrink-0 text-violet-300" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[9999] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 p-5 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 18 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-cyan-400/6" />
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                        <Calendar className="h-3.5 w-3.5" />
                        Pick Date
                      </div>

                      <h3 className="text-xl font-extrabold tracking-tight text-white">
                        Select Date
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#08080C]/45 p-2">
                    <motion.button
                      type="button"
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1,
                          ),
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-violet-500/10 hover:text-violet-200"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>

                    <span className="text-sm font-extrabold text-violet-100">
                      {format(currentMonth, "MMMM yyyy")}
                    </span>

                    <motion.button
                      type="button"
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1,
                          ),
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-violet-500/10 hover:text-violet-200"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>

                  <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <span key={d} className="py-2">
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {Array.from({
                      length: startOfMonth(currentMonth).getDay(),
                    }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-10" />
                    ))}

                    {daysInMonth.map((day) => {
                      const isSelected =
                        selectedDate &&
                        selectedDate.toDateString() === day.toDateString();

                      return (
                        <motion.button
                          type="button"
                          key={day.toISOString()}
                          onClick={() => handleSelect(day)}
                          className={`flex h-10 items-center justify-center rounded-xl text-sm font-extrabold transition ${
                            isSelected
                              ? "bg-violet-500/25 text-violet-100 ring-1 ring-violet-300/35"
                              : "text-slate-400 hover:bg-white/[0.055] hover:text-white"
                          }`}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          transition={{ duration: 0.15 }}
                        >
                          {format(day, "d")}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
