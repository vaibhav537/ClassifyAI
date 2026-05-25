"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ActivityIcon, AlertTriangle, Clock3, Loader2 } from "lucide-react";

interface Activity {
  id: string;
  user: {
    name: string;
    role: string;
  };
  action: string;
  timestamp: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const campusId = localStorage.getItem("CampusID");
        const res = await fetch(
          `/api/assistant/recent-activity?campusId=${campusId}`,
        );
        const data = await res.json();

        if (data.success) {
          setActivities(data.activities);
        } else {
          setError(data.error || "Failed to fetch recent activities.");
        }
      } catch (err) {
        setError("Error fetching recent activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="grid h-full min-h-[22rem] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
            <Loader2 className="h-7 w-7 animate-spin text-violet-200" />
          </div>

          <p className="mt-4 text-sm font-bold text-slate-400 animate-pulse">
            Loading recent activities…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid h-full min-h-[22rem] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-red-300/20 bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-300" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-red-200">
            Unable to load activity
          </p>

          <p className="mt-2 text-xs leading-5 text-red-100/70">{error}</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="grid h-full min-h-[22rem] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
            <ActivityIcon className="h-7 w-7 text-violet-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            No recent activities
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Assistant activity logs will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full max-h-[22rem] min-h-[22rem] flex-col overflow-hidden scrollbar-hide">
      <div className="shrink-0 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-fuchsia-200">
              <ActivityIcon className="h-3.5 w-3.5" />
              Live Logs
            </span>

            <h3
              className="mt-3 text-xl font-extrabold tracking-tight text-white"
            >
              Recent Activity
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Latest campus actions recorded by the assistant console.
            </p>
          </div>

          <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-extrabold text-slate-400 sm:block">
            {activities.length} logs
          </div>
        </div>
      </div>

      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
        {activities.map((activity, idx) => (
          <motion.li
            key={activity.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: idx * 0.04,
              duration: 0.3,
              ease: "easeOut",
            }}
            className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#08080C]/45 p-3 text-sm text-slate-200 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:bg-white/[0.055]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-violet-400/5 opacity-70 transition duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-300/20 bg-fuchsia-500/10">
                <Clock3 className="h-4 w-4 text-fuchsia-200" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-slate-300">
                  <span className="font-extrabold text-white">
                    {activity.user.name}
                  </span>{" "}
                  <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-200">
                    {activity.user.role}
                  </span>
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {activity.action}
                </p>

                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;