"use client";

import { Expiration } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CalendarClock,
  Clock3,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const UpcomingExpirations = () => {
  const [expirations, setExpirations] = useState<Expiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpirations = async () => {
      try {
        const campusId = localStorage.getItem("CampusID");

        if (!campusId) {
          throw new Error("Campus ID not found.");
        }

        const res = await fetch(`/api/users/expirations?campusId=${campusId}`);
        const data = await res.json();

        if (data.success) {
          setExpirations(data.users || []);
        } else {
          throw new Error(data.message || "Failed to fetch expirations.");
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpirations();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[18rem] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-cyan-300/20 bg-cyan-500/10">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            Loading expirations...
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Checking upcoming premium plan end dates.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-[18rem] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-red-300/20 bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-300" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-red-200">
            Failed to load expirations
          </p>

          <p className="mt-1 text-xs leading-5 text-red-100/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex min-h-[18rem] flex-col text-white"
    >
      <div className="mb-4 shrink-0">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
          <CalendarClock className="h-3.5 w-3.5" />
          Expiration Watch
        </span>

        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
          Upcoming Expirations
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Premium plans nearing their end date.
        </p>
      </div>

      {expirations.length > 0 ? (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.04,
              },
            },
          }}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-hide"
        >
          <AnimatePresence>
            {expirations.map((user) => (
              <motion.li
                key={user.id}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-3 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.055]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-400/5 opacity-80 transition duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                      <Clock3 className="h-4 w-4 text-cyan-200" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-extrabold text-white"
                        title={user.name}
                      >
                        {user.name}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                        Premium expiry
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-cyan-200">
                    {user.endDate}
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="grid min-h-[12rem] flex-1 place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-[#08080C]/45 p-4 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1.35rem] border border-emerald-300/20 bg-emerald-500/10">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </div>

            <p className="mt-4 text-sm font-extrabold text-slate-300">
              No upcoming expirations
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Premium subscriptions are currently safe.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingExpirations;
