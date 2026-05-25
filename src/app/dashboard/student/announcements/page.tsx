"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Megaphone,
  Download,
  ChevronLeft,
  Loader2,
  Sparkles,
  Paperclip,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StudentAnnouncementsPage() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setStudentId(localStorage.getItem("studentId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const { data, error, isLoading } = useSWR(
    studentId && campusId
      ? `/api/student/announcements?studentId=${studentId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const announcements = data?.announcements || [];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Campus Updates
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Announcements
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Important updates, notices and messages from your teachers and
                  campus management.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Total
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {isLoading ? "..." : announcements.length}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/70">
                  Status
                </p>
                <p className="mt-1 text-sm font-extrabold text-violet-100">
                  {isLoading ? "Loading" : error ? "Error" : "Ready"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <Megaphone className="h-5 w-5 text-violet-200" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-white">
                Announcement Feed
              </h2>
              <p className="text-xs text-slate-500">
                Latest updates shared with you
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="grid min-h-[360px] place-items-center px-5 py-12">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
                </div>

                <p className="mt-5 text-lg font-extrabold text-white">
                  Loading announcements
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Fetching latest campus updates...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="grid min-h-[320px] place-items-center px-5 py-12 text-center">
              <div className="max-w-md rounded-[1.5rem] border border-red-300/20 bg-red-500/10 p-6">
                <p className="text-lg font-extrabold text-red-200">
                  Failed to load announcements
                </p>
                <p className="mt-2 text-sm leading-6 text-red-100/70">
                  Please refresh and try again.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && announcements.length === 0 && (
            <div className="grid min-h-[360px] place-items-center px-5 py-12 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Bell className="h-7 w-7 text-slate-500" />
                </div>

                <p className="mt-5 text-xl font-extrabold text-white">
                  No new announcements
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You are all caught up. New updates from teachers and campus
                  management will appear here.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && announcements.length > 0 && (
            <div className="grid gap-4 p-4 sm:p-5">
              {announcements.map((announcement: any) => (
                <article
                  key={announcement.id}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-white/[0.065]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-200">
                          <Megaphone className="h-3.5 w-3.5" />
                          Notice
                        </div>

                        <h3 className="text-xl font-extrabold tracking-tight text-white">
                          {announcement.title}
                        </h3>

                        <p className="mt-2 text-xs font-semibold text-slate-500">
                          By {announcement.author.user.name} on{" "}
                          {new Date(
                            announcement.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="w-fit shrink-0 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-cyan-200">
                        {announcement.targetAll ? "General" : "For Your Class"}
                      </span>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                      {announcement.message}
                    </p>

                    {announcement.attachments.length > 0 && (
                      <div className="mt-5 border-t border-white/10 pt-5">
                        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-white">
                          <Paperclip className="h-4 w-4 text-violet-300" />
                          Attachments
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {announcement.attachments.map((file: any) => (
                            <a
                              key={file.url}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/file flex items-center gap-3 rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-3 text-sm font-bold text-slate-300 transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/10 hover:text-white"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-500/10">
                                <Download className="h-4 w-4 text-violet-200" />
                              </span>

                              <span className="min-w-0 truncate">
                                {file.title}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}