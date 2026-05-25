"use client";

import { getTimeAgo, showErrorMessage, showSuccessMessage } from "@/lib/helper";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Loader2,
  Megaphone,
  Plus,
  Sparkles,
  Trash,
  UserRound,
} from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CreateAnnouncementModal from "@/components/assistant/announcements/CreateAnnouncements";

const Page = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [announcementModalOpen, setAnnouncementModalOpen] =
    useState<boolean>(false);
  const [campusId, setCampusId] = useState<string>();
  const [assistantId, setAssistantId] = useState<string>();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  useEffect(() => {
    const cId = localStorage.getItem("CampusID") || "";
    const aId = localStorage.getItem("assistantId") || "";
    setCampusId(cId);
    setAssistantId(aId);
  }, []);

  useEffect(() => {
    if (campusId && assistantId) {
      fetchAnnouncements();
    }
  }, [campusId, assistantId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncements((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/assistant/announcements?campusId=${campusId}&assistantId=${assistantId}`,
      );

      if (response.ok) {
        const result = await response.json();
        setAnnouncements(result.data || []);
      }
    } catch (error) {
      showErrorMessage("Can't reach announcements right now");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const previous = announcements;
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));

      const res = await fetch(
        `/api/assistant/announcements?announcementId=${id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        setAnnouncements(previous);
        showErrorMessage("Failed to delete announcement");
        return;
      }

      showSuccessMessage("Announcement deleted successfully");
    } catch (err) {
      showErrorMessage("Something went wrong");
    } finally {
      setSelectedAnnouncement(null);
    }
  };

  return (
    <motion.div
      className="relative flex min-h-full flex-col gap-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
              <Megaphone className="h-3.5 w-3.5" />
              Announcement Center
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Announcements
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Create, monitor, and manage campus-wide updates from the assistant
              console.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-cyan-300/20 bg-cyan-500/10 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                <Bell className="h-5 w-5 text-cyan-200" />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-100/70">
                  Total Posts
                </p>
                <p className="text-sm font-extrabold text-cyan-100">
                  {announcements.length} Active
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAnnouncementModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
            >
              <Plus className="h-4 w-4" />
              Create Announcement
            </button>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.3, ease: "easeOut" }}
        className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-fuchsia-200">
              <Sparkles className="h-3.5 w-3.5" />
              Campus Feed
            </span>

            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
              Recent Announcements
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Announcements automatically refresh their time labels every
              minute.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="relative z-10 grid min-h-[26rem] place-items-center text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
                <Loader2 className="h-7 w-7 animate-spin text-violet-200" />
              </div>

              <p className="mt-4 text-sm font-extrabold text-slate-300">
                Loading announcements...
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Fetching latest campus updates.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {announcements.length > 0 ? (
              <motion.div
                key="announcements-grid"
                className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                layout
              >
                {announcements.map((announcement, index) => (
                  <motion.article
                    key={announcement.id || index}
                    layout
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.98 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      delay: index * 0.04,
                    }}
                    className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/[0.055]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-80 transition duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />

                    <button
                      type="button"
                      onClick={() => setSelectedAnnouncement(announcement)}
                      className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-300 opacity-100 transition duration-300 hover:bg-red-500/20 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Delete announcement"
                    >
                      <Trash className="h-4 w-4" />
                    </button>

                    <div className="relative z-10 flex h-full min-h-0 flex-col">
                      <div className="mb-4 flex items-start gap-3 pr-11">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                          <Megaphone className="h-4 w-4 text-violet-200" />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="line-clamp-2 text-lg font-extrabold tracking-tight text-white"
                            title={announcement.title}
                          >
                            {announcement.title}
                          </h3>

                          <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600">
                            Campus announcement
                          </p>
                        </div>
                      </div>

                      <p className="min-h-0 flex-1 overflow-hidden text-sm leading-6 text-slate-400 line-clamp-4">
                        {announcement.message}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <div className="flex min-w-0 items-center gap-2">
                          <UserRound className="h-4 w-4 shrink-0 text-slate-600" />
                          <span
                            className="truncate text-xs font-extrabold text-slate-400"
                            title={announcement.authorName}
                          >
                            {announcement.authorName}
                          </span>
                        </div>

                        <span className="shrink-0 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-200">
                          {getTimeAgo(announcement.createdAt)}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-announcements"
                className="relative z-10 grid min-h-[26rem] place-items-center rounded-[1.75rem] border border-dashed border-white/10 bg-[#08080C]/45 p-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
                    <Megaphone className="h-7 w-7 text-violet-200" />
                  </div>

                  <p className="mt-4 text-sm font-extrabold text-slate-300">
                    No announcements available
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Create your first announcement to publish campus updates.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.section>

      <button
        type="button"
        onClick={() => setAnnouncementModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/20 text-violet-100 shadow-2xl shadow-black/40 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-violet-500/30 lg:hidden"
        aria-label="Create announcement"
      >
        <Plus className="h-6 w-6" />
      </button>

      <CreateAnnouncementModal
        isOpen={!!announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        mode="create"
        onSuccess={fetchAnnouncements}
        initialData={null}
      />

      <ConfirmModal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        onConfirm={() => {
          handleDelete(selectedAnnouncement.id);
        }}
        message="Are you sure you want to delete this announcement?"
      />
    </motion.div>
  );
};

export default Page;