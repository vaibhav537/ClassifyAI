"use client";

import React, { useEffect, useState } from "react";
import { RecentAttendance } from "@/lib/types";
import { motion } from "framer-motion";
import { Clock3, Loader2, UserCheck, UserX, Timer } from "lucide-react";

const RecentAttendancePage = ({ expanded }: { expanded: boolean }) => {
  const [recent, setRecent] = useState<RecentAttendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const campusID = localStorage.getItem("CampusID");
        const res = await fetch(
          `/api/assistant/recent-attendance?campusId=${campusID}`,
        );
        const data = await res.json();
        if (data.success) {
          console.log({ data });
          setRecent(data.recent);
        }
      } catch (error) {
        console.error("Failed to fetch recent attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const getStatusMeta = (status: string) => {
    const normalizedStatus = status?.toUpperCase();

    if (normalizedStatus === "PRESENT") {
      return {
        label: "Present",
        icon: <UserCheck className="h-3.5 w-3.5" />,
        className: "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
      };
    }

    if (normalizedStatus === "LATE") {
      return {
        label: "Late",
        icon: <Timer className="h-3.5 w-3.5" />,
        className: "border-amber-300/20 bg-amber-500/10 text-amber-300",
      };
    }

    if (normalizedStatus === "ABSENT") {
      return {
        label: "Absent",
        icon: <UserX className="h-3.5 w-3.5" />,
        className: "border-red-300/20 bg-red-500/10 text-red-300",
      };
    }

    return {
      label: normalizedStatus || "Unknown",
      icon: <Clock3 className="h-3.5 w-3.5" />,
      className: "border-slate-300/20 bg-slate-500/10 text-slate-300",
    };
  };

  if (loading) {
    return (
      <div className="grid h-full min-h-[10rem] w-full place-items-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1.25rem] border border-violet-300/20 bg-violet-500/10">
            <Loader2 className="h-6 w-6 animate-spin text-violet-200" />
          </div>

          <p className="mt-4 text-sm font-bold text-slate-400 animate-pulse">
            Loading recent activity…
          </p>
        </div>
      </div>
    );
  }

  if (recent.length === 0) {
    return (
      <div className="grid h-full min-h-[10rem] w-full place-items-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1.25rem] border border-violet-300/20 bg-violet-500/10">
            <Clock3 className="h-6 w-6 text-violet-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            No attendance marked today
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Recent attendance activity will appear here.
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
        {recent.map((rec, index) => {
          const statusMeta = getStatusMeta(rec.status);

          return (
            <motion.li
              key={rec.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: index * 0.04,
              }}
              className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-3 text-slate-200 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-white/[0.055]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-70 transition duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <article className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <Clock3 className="h-4 w-4 text-violet-200" />
                  </div>

                  <div className="min-w-0">
                    <span
                      className="block truncate text-sm font-extrabold tracking-tight text-white lg:text-base"
                      title={rec.studentName}
                    >
                      {rec.studentName}
                    </span>

                    <span className="mt-1 block truncate text-xs leading-5 text-slate-500">
                      {rec.subjectName}
                    </span>
                  </div>
                </article>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${statusMeta.className}`}
                >
                  {statusMeta.icon}
                  {statusMeta.label}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
};

export default RecentAttendancePage;
