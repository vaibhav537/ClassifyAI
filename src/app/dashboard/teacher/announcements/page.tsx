"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  AlertCircle,
  Bot,
  Edit,
  Megaphone,
  PlusCircle,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CreateAnnouncementModal from "@/components/teacher/CreateAnnouncementModal";
import { AnnouncementsLoadingSkeleton } from "@/components/teacher/SkeletonLoaders";
import { showErrorMessage, showSuccessMessage } from "@/lib/helper";
import TConfirmModal from "@/components/ui/TConfirmModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnnouncementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<any | null>(
    null,
  );
  const [announcementToEdit, setAnnouncementToEdit] = useState<any | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);

  useEffect(() => {
    setTeacherId(localStorage.getItem("teacherId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    teacherId && campusId
      ? `/api/teacher/announcements?teacherId=${teacherId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const announcements = data?.announcements || [];

  const handleDelete = async () => {
    if (!announcementToDelete || !teacherId) {
      showErrorMessage("An error occurred. Please refresh.");
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch("/api/teacher/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcementId: announcementToDelete.id,
          teacherId: teacherId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete.");

      showSuccessMessage("Announcement deleted successfully.");
      mutate();
      setAnnouncementToDelete(null);
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 flex min-h-full flex-col gap-6">
          <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/12 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Broadcast Center
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Announcements
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Broadcast important updates, notices and reminders to your
                  students.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                    Total
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">
                    {isLoading ? "..." : announcements.length}
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:shadow-violet-800/30"
                >
                  <PlusCircle size={18} />
                  New Announcement
                </motion.button>
              </div>
            </div>
          </header>

          <section className="min-h-0 flex-1">
            {isLoading && <AnnouncementsLoadingSkeleton />}

            {error && (
              <div className="grid min-h-[320px] place-items-center rounded-[2rem] border border-red-300/20 bg-red-500/10 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
                <div>
                  <AlertCircle className="mx-auto h-10 w-10 text-red-300" />
                  <p className="mt-4 text-lg font-extrabold text-red-200">
                    Failed to load announcements
                  </p>
                  <p className="mt-2 text-sm text-red-100/70">
                    Please refresh and try again.
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !error && (
              <AnimatePresence>
                {announcements.length === 0 ? (
                  <motion.div
                    className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="max-w-md">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                        <Megaphone className="h-7 w-7 text-violet-200" />
                      </div>

                      <h2 className="mt-5 text-2xl font-extrabold text-white">
                        No announcements yet
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Create your first announcement to share updates with
                        your students.
                      </p>

                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                      >
                        <PlusCircle size={18} />
                        New Announcement
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-5">
                    {announcements.map((announcement: any, index: number) => {
                      const isAssistant =
                        announcement.authorName.includes("Classify");

                      return (
                        <motion.article
                          key={announcement.id}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055]"
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />
                          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

                          <div className="relative z-10">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0">
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                                  <Megaphone className="h-5 w-5 text-violet-200" />
                                </div>

                                <h3 className="text-xl font-extrabold text-white">
                                  {announcement.title}
                                </h3>

                                <p className="mt-2 text-xs font-medium text-slate-500">
                                  Posted on{" "}
                                  <span className="font-bold text-violet-200">
                                    {new Date(
                                      announcement.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-extrabold text-cyan-200">
                                  <Target className="h-3.5 w-3.5" />
                                  {announcement.targetAll
                                    ? "All Students"
                                    : `Sem ${announcement.targetSemester} • Sec ${announcement.targetSection}`}
                                </span>

                                {isAssistant && (
                                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-extrabold text-emerald-200">
                                    <Bot className="h-3.5 w-3.5" />
                                    ClassifyAI Assistant
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="mt-5 whitespace-pre-wrap rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4 text-sm leading-7 text-slate-300">
                              {announcement.message}
                            </p>

                            {!isAssistant && (
                              <div className="mt-5 flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAnnouncementToEdit(announcement)
                                  }
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-violet-200 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
                                  aria-label="Edit announcement"
                                >
                                  <Edit size={16} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setAnnouncementToDelete(announcement)
                                  }
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition duration-300 hover:-translate-y-0.5 hover:border-red-300/45 hover:bg-red-500/20"
                                  aria-label="Delete announcement"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            )}
          </section>
        </div>
      </main>

      <CreateAnnouncementModal
        isOpen={isModalOpen || !!announcementToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setAnnouncementToEdit(null);
        }}
        onSuccess={() => mutate()}
        mode={announcementToEdit ? "edit" : "create"}
        initialData={announcementToEdit}
      />

      <TConfirmModal
        isOpen={!!announcementToDelete}
        onClose={() => setAnnouncementToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message="Are you sure you want to permanently delete this announcement? This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
}