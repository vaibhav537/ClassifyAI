"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Loader2,
  ShieldAlert,
  Sparkles,
  Trophy,
  UserCheck,
} from "lucide-react";

interface Student {
  name: string;
  percentage: number;
}

interface Teacher {
  name: string;
  count: number;
}

interface BottomStripData {
  success: boolean;
  topStudents: Student[];
  atRiskStudents: Student[];
  teacherActivity: Teacher[];
}

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="grid min-h-[130px] place-items-center rounded-[1.35rem] border border-dashed border-white/10 bg-white/[0.03] p-4 text-center">
      <p className="text-sm font-semibold leading-6 text-slate-500">
        {message}
      </p>
    </div>
  );
};

const MetricRow = ({
  name,
  value,
  tone,
}: {
  name: string;
  value: string;
  tone: "emerald" | "red" | "cyan";
}) => {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
      : tone === "red"
        ? "border-red-300/20 bg-red-500/10 text-red-300"
        : "border-cyan-300/20 bg-cyan-500/10 text-cyan-200";

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#08080C]/45 px-3 py-2.5 transition duration-300 hover:bg-white/[0.055]">
      <span className="min-w-0 truncate text-sm font-bold text-slate-300">
        {name}
      </span>

      <span
        className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${toneClass}`}
      >
        {value}
      </span>
    </div>
  );
};

const BottomStrip = () => {
  const [data, setData] = useState<BottomStripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. First, get the logged-in admin's session to find their campusId
        const campusId = localStorage.getItem("CampusID");
        if (!campusId) {
          throw new Error("Admin is not associated with a campus.");
        }

        // 2. Then, use that campusId to fetch the campus-specific analytics
        // Note: The API endpoint path should match your analytics API
        const analyticsRes = await fetch(
          `/api/assistant/bottom-strip?campusId=${campusId}`,
        );
        const analyticsJson = await analyticsRes.json();

        if (!analyticsJson.success) {
          throw new Error("Failed to load dashboard data.");
        }

        setData(analyticsJson);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        console.error("Failed to fetch bottom strip data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[220px] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-cyan-300/20 bg-cyan-500/10">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            Loading Analytics...
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Preparing campus performance insights.
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid min-h-[220px] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-red-300/20 bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-300" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-red-200">
            Failed to load dashboard data.
          </p>

          <p className="mt-1 text-xs leading-5 text-red-100/70">
            {error || "Failed to load dashboard data."}
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Top Attending Students",
      subtitle: "Best attendance performers",
      icon: <Trophy className="h-5 w-5 text-emerald-300" />,
      badge: "Top Students",
      tone: "emerald" as const,
      shell: "from-emerald-500/10 via-transparent to-violet-500/6",
      badgeClass:
        "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
      empty: "No attendance data yet.",
      rows: data.topStudents.map((student) => ({
        name: student.name,
        value: `${student.percentage}%`,
      })),
    },
    {
      title: "At-Risk Students",
      subtitle: "Students below attendance threshold",
      icon: <ShieldAlert className="h-5 w-5 text-red-300" />,
      badge: "<75% Risk",
      tone: "red" as const,
      shell: "from-red-500/10 via-transparent to-violet-500/6",
      badgeClass: "border-red-300/20 bg-red-500/10 text-red-300",
      empty: "No students are currently at risk.",
      rows: data.atRiskStudents.map((student) => ({
        name: student.name,
        value: `${student.percentage}%`,
      })),
    },
    {
      title: "Teacher Activity Today",
      subtitle: "Classes handled by faculty",
      icon: <UserCheck className="h-5 w-5 text-cyan-200" />,
      badge: "Faculty Logs",
      tone: "cyan" as const,
      shell: "from-cyan-500/10 via-transparent to-violet-500/6",
      badgeClass: "border-cyan-300/20 bg-cyan-500/10 text-cyan-200",
      empty: "No teacher activity today.",
      rows: data.teacherActivity.map((teacher) => ({
        name: teacher.name,
        value: `${teacher.count} classes`,
      })),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            Campus Insights
          </span>

          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
            Assistant Intelligence Strip
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Quick snapshot of attendance health, risk signals, and teacher
            activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.3,
              ease: "easeOut",
            }}
            whileHover={{ y: -4 }}
            className="group relative flex h-[300px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-violet-300/30 hover:bg-white/[0.055]"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.shell} opacity-80 transition duration-300 group-hover:opacity-100`}
            />

            <div className="relative z-10 flex h-full min-h-0 flex-col">
              <div className="mb-4 shrink-0">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ${card.badgeClass}`}
                >
                  {card.icon}
                  {card.badge}
                </span>

                <h3 className="mt-3 truncate text-lg font-extrabold tracking-tight text-white">
                  {card.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {card.subtitle}
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {card.rows.length === 0 ? (
                  <EmptyState message={card.empty} />
                ) : (
                  <div className="space-y-2.5">
                    {card.rows.map((row) => (
                      <MetricRow
                        key={row.name}
                        name={row.name}
                        value={row.value}
                        tone={card.tone}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BottomStrip;