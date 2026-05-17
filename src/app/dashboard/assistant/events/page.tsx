"use client";

import React, { useEffect, useState } from "react";
import { Event, EventStats } from "@/lib/types";
import StatsRow from "@/components/assistant/StatsRow";
import EventTable from "@/components/assistant/EventTable";
import InsightsPanel from "@/components/assistant/InsightsPanel";
import AddEventModal from "@/components/ui/AddEventModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  titleArrayForEventPage,
} from "@/lib/helper";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";

const Page = () => {
  const [stats, setStats] = useState<EventStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [campusId, setCampusId] = useState("");

  const fetchEvents = async (id: string) => {
    const res = await fetch(
      `/api/assistant/event/all?campusId=${id}&page=1&sortBy=title&sortOrder=asc`,
    );
    const data = await res.json();
    if (data.success) setEvents(data.events);
  };

  const fetchStats = async (id: string) => {
    const res = await fetch(`/api/assistant/event/stats?campusId=${id}`);
    const data = await res.json();
    if (data.success) setStats(data.stats);
  };

  useEffect(() => {
    const CAMPUSID = localStorage.getItem("CampusID");
    if (CAMPUSID) {
      setCampusId(CAMPUSID);
      fetchEvents(CAMPUSID);
      fetchStats(CAMPUSID);
    }
  }, []);

  const handleDelete = async () => {
    if (!selectedEvent) return;

    if (!campusId) {
      showErrorMessage("Campus could not be identified. Please refresh.");
      return;
    }

    showLoadingMessage("Deleting event...");

    try {
      const res = await fetch(`/api/assistant/event/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          campusId: campusId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete event.");
      }

      showSuccessMessage("Event deleted successfully!");
      setIsConfirmOpen(false);
      fetchEvents(campusId);
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  if (!stats) {
    return (
      <div className="grid min-h-[70vh] place-items-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-8 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-violet-200" />
            </div>

            <p className="mt-5 text-sm font-extrabold text-white">
              Loading events...
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Preparing event analytics and campus schedule data.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative flex min-h-full flex-col gap-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.header
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
              <CalendarDays className="h-3.5 w-3.5" />
              Event Control
            </span>

            <h1
              className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            >
              Manage Events
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Create, update, track, and manage campus events from the assistant
              console.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
                  Events Loaded
                </p>
                <p className="text-sm font-extrabold text-emerald-100">
                  {events.length} Records
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedEvent(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </button>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        <div className="relative z-10">
          <StatsRow
            stats={{
              totalUsers: stats.totalEvents,
              premiumUsers: stats.exams,
              proUsers: stats.holidays,
              ultimateUsers: stats.others,
              expiredPremiums: 0,
            }}
            titleArray={titleArrayForEventPage}
            showExpiredCard={false}
          />
        </div>
      </motion.section>

      <motion.section
        className="relative min-h-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        <div className="relative z-10 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Event Directory
            </span>

            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
              Campus Event Records
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Edit or remove existing events from the campus event list.
            </p>
          </div>
        </div>

        <div className="relative z-10 min-h-0 overflow-hidden">
          <EventTable
            events={events}
            onEdit={(event) => {
              setSelectedEvent(event);
              setIsModalOpen(true);
            }}
            onDelete={(event) => {
              setSelectedEvent(event);
              setIsConfirmOpen(true);
            }}
          />
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.3, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8" />

        <div className="relative z-10">
          <InsightsPanel />
        </div>
      </motion.section>

      <button
        onClick={() => {
          setSelectedEvent(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/20 text-violet-100 shadow-2xl shadow-black/40 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-violet-500/30 lg:hidden"
        aria-label="Add Event"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchEvents(campusId)}
        initialData={selectedEvent}
        mode={selectedEvent ? "edit" : "add"}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
};

export default Page;
