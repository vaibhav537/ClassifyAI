"use client";

import { EventItem } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3 } from "lucide-react";

const UpComingEvents = ({ expanded }: { expanded: boolean }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const campusId = localStorage.getItem("CampusID");
        const res = await fetch(`/api/assistant/event?campusId=${campusId}`);
        const data = await res.json();
        if (data.success) {
          setEvents(data.events);
        }
      } catch {
        console.log("Error fetching events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid h-full min-h-[10rem] w-full place-items-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1.25rem] border border-fuchsia-300/20 bg-fuchsia-500/10">
            <CalendarDays className="h-6 w-6 animate-pulse text-fuchsia-200" />
          </div>

          <p className="mt-4 text-sm font-bold text-slate-400 animate-pulse">
            Loading upcoming events…
          </p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="grid h-full min-h-[10rem] w-full place-items-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1.25rem] border border-violet-300/20 bg-violet-500/10">
            <CalendarDays className="h-6 w-6 text-violet-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            No upcoming events
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Scheduled events will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full overflow-y-auto pr-1 outline-none scrollbar-hide"
      style={{
        maxHeight: expanded ? "30rem" : "12rem",
      }}
    >
      <ul className="space-y-3 outline-none">
        {events.map((event, index) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: index * 0.04,
            }}
            className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-3 text-slate-200 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:bg-white/[0.055]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-violet-400/5 opacity-70 transition duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <article className="flex min-w-0 flex-1 items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-300/20 bg-fuchsia-500/10">
                  <Clock3 className="h-4 w-4 text-fuchsia-200" />
                </div>

                <div className="min-w-0">
                  <h3
                    className="truncate text-sm font-extrabold tracking-tight text-white"
                    title={event.title}
                  >
                    {event.title}
                  </h3>

                  <p
                    className="mt-1 truncate text-xs leading-5 text-slate-500"
                    title={event.description}
                  >
                    {event.description}
                  </p>
                </div>
              </article>

              <time
                dateTime={new Date(event.date).toISOString()}
                className="shrink-0 rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-fuchsia-200"
              >
                {new Date(event.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </time>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default UpComingEvents;