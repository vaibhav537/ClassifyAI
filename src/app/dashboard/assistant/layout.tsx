"use client";

import styles from "../assistant/admin.module.css";
import ProfileCard from "@/components/assistant/ProfileCard";
import UpComingEvents from "@/components/assistant/UpComingEvents";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Clock3, CalendarDays } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/assistant/AdminSidebar";
import Logo from "@/components/assistant/Logo";
import RecentAttendancePage from "@/components/assistant/RecentAttendance";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState<"upcoming" | "recent" | null>(null);
  const pathname = usePathname();

  const isChatPage =
    pathname.includes("/dashboard/assistant/chat") ||
    pathname.includes("/dashboard/assistant/messages") ||
    pathname.includes("/dashboard/assistant/conversations");

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden bg-[#08080C] text-white ${styles.scrollbarHide}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%),radial-gradient(circle_at_center,rgba(217,70,239,0.04),transparent_38%)]" />
      <div className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-16 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-white/10 bg-[#101014]/80 backdrop-blur-2xl lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex h-full min-w-0 flex-row items-center justify-between gap-4 p-4 lg:flex-col lg:items-stretch lg:justify-start lg:p-5">
            <div className="relative min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-3 shadow-2xl shadow-black/20 backdrop-blur-2xl lg:w-full lg:p-4">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
              <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl" />

              <div className="relative z-10 min-w-0">
                <Logo />
              </div>
            </div>

            <div className="min-w-0 flex-1 lg:mt-5 lg:w-full">
              <AdminSidebar />
            </div>
          </div>
        </aside>

        <main
          className={`${styles.scrollbarHide} min-w-0 flex-1 overflow-hidden ${
            isChatPage
              ? "p-0 lg:h-screen"
              : "p-4 sm:p-6 lg:h-screen lg:overflow-y-auto lg:p-7"
          }`}
        >
          {isChatPage ? (
            <div className="h-full min-h-0 w-full overflow-hidden">
              {children}
            </div>
          ) : (
            <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col">
              <div className="relative min-h-full flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/55 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5 lg:p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />
                <div className="relative z-10 min-h-full">{children}</div>
              </div>
            </div>
          )}
        </main>

        {!isChatPage && (
          <aside className="w-full shrink-0 border-t border-white/10 bg-[#101014]/80 backdrop-blur-2xl lg:h-screen lg:w-96 lg:border-l lg:border-t-0">
            <div className="flex h-full min-w-0 flex-col gap-4 overflow-hidden p-4 sm:p-5">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                      AI Desk
                    </span>
                    <p className="mt-2 text-sm font-extrabold text-white">
                      Assistant Panel
                    </p>
                  </div>

                  <ProfileCard />
                </div>
              </div>

              <div className="grid min-h-0 flex-1 grid-rows-2 gap-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  {expanded !== "upcoming" && (
                    <motion.section
                      key="recent"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        gridRow:
                          expanded === "recent"
                            ? "span 2 / span 2"
                            : "span 1 / span 1",
                      }}
                      exit={{ opacity: 0, y: 14 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="min-h-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/25 backdrop-blur-2xl"
                    >
                      <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                              <Clock3 className="h-5 w-5 text-violet-200" />
                            </div>

                            <div className="min-w-0">
                              <h2 className="truncate text-base font-extrabold tracking-tight text-white">
                                Recent Attendance
                              </h2>
                              <p className="text-xs text-slate-500">
                                Latest attendance activity
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setExpanded(
                                expanded === "recent" ? null : "recent",
                              )
                            }
                            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition duration-300 ${
                              expanded === "recent"
                                ? "border-violet-300/35 bg-violet-500/20 text-violet-100"
                                : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-violet-300/30 hover:bg-violet-500/10 hover:text-violet-100"
                            }`}
                            aria-label="Toggle recent attendance"
                          >
                            {expanded === "recent" ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        <div
                          className={`${styles.scrollbarHide} relative z-10 min-h-0 flex-1 overflow-hidden px-4 py-4`}
                        >
                          <RecentAttendancePage
                            expanded={expanded === "recent"}
                          />
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {expanded !== "recent" && (
                    <motion.section
                      key="upcoming"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        gridRow:
                          expanded === "upcoming"
                            ? "span 2 / span 2"
                            : "span 1 / span 1",
                      }}
                      exit={{ opacity: 0, y: 14 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="min-h-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/25 backdrop-blur-2xl"
                    >
                      <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-violet-400/5" />

                        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-300/20 bg-fuchsia-500/10">
                              <CalendarDays className="h-5 w-5 text-fuchsia-200" />
                            </div>

                            <div className="min-w-0">
                              <h2 className="truncate text-base font-extrabold tracking-tight text-white">
                                Upcoming Events
                              </h2>
                              <p className="text-xs text-slate-500">
                                Scheduled assistant reminders
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setExpanded(
                                expanded === "upcoming" ? null : "upcoming",
                              )
                            }
                            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition duration-300 ${
                              expanded === "upcoming"
                                ? "border-fuchsia-300/35 bg-fuchsia-500/20 text-fuchsia-100"
                                : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-fuchsia-300/30 hover:bg-fuchsia-500/10 hover:text-fuchsia-100"
                            }`}
                            aria-label="Toggle upcoming events"
                          >
                            {expanded === "upcoming" ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        <div
                          className={`${styles.scrollbarHide} relative z-10 min-h-0 flex-1 overflow-hidden px-4 py-4`}
                        >
                          <UpComingEvents expanded={expanded === "upcoming"} />
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}