"use client";

import { Activity } from "@/lib/types";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ActivityIcon,
  AlertTriangle,
  Clock3,
  Loader2,
  Sparkles,
} from "lucide-react";

const RecentPremiumActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const campusId = localStorage.getItem("CampusID");

        if (!campusId) {
          throw new Error("Campus ID not found. Please log in again.");
        }

        const res = await fetch(
          `/api/users/recent-activity?campusId=${campusId}`,
        );
        const data = await res.json();

        if (data.success) {
          setActivities(data.activities);
        } else {
          throw new Error(data.message || "Failed to fetch activities.");
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  function removeIdFromText(text: string): string {
    const parts = text.split(" ");
    parts.shift();
    return parts.join(" ").trim();
  }

  if (loading) {
    return (
      <div className="grid min-h-[18rem] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-fuchsia-300/20 bg-fuchsia-500/10">
            <Loader2 className="h-7 w-7 animate-spin text-fuchsia-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            Loading activity...
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Fetching recent premium updates.
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
            Failed to load activity
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
        <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-fuchsia-200">
          <Sparkles className="h-3.5 w-3.5" />
          Premium Logs
        </span>

        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
          Recent Premium Activity
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Latest subscription changes and premium actions.
        </p>
      </div>

      {activities.length > 0 ? (
        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-hide">
          <AnimatePresence>
            {activities.map((activity, index) => (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-3 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:bg-white/[0.055]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-violet-400/5 opacity-80 transition duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-300/20 bg-fuchsia-500/10">
                    <ActivityIcon className="h-4 w-4 text-fuchsia-200" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-slate-300">
                      <span className="font-extrabold capitalize text-white">
                        {activity.username}
                      </span>{" "}
                      <span className="text-slate-500">
                        {removeIdFromText(activity.text)}
                      </span>
                    </p>

                    <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600">
                      <Clock3 className="h-3.5 w-3.5" />
                      {activity.date}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="grid min-h-[12rem] flex-1 place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-[#08080C]/45 p-4 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1.35rem] border border-fuchsia-300/20 bg-fuchsia-500/10">
              <ActivityIcon className="h-6 w-6 text-fuchsia-200" />
            </div>

            <p className="mt-4 text-sm font-extrabold text-slate-300">
              No recent premium activity
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              New premium changes will appear here.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecentPremiumActivity;
