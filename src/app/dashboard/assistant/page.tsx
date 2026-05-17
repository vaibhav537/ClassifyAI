"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Radio,
  ShieldCheck,
  TicketCheck,
  Users,
  UserRoundCheck,
} from "lucide-react";
import AttendanceGraph from "@/components/assistant/AttendanceGraph";
import RecentActivity from "@/components/assistant/RecentActivity";
import BottomStrip from "@/components/assistant/BottomStrip";
import styles from "./admin.module.css";


function VerificationGatekeeper({
  status,
  onRedirect,
}: {
  status: "verifying" | "needs_setup" | "error";
  onRedirect: () => void;
}) {
  const messages = {
    verifying: {
      title: "Verifying Assistant Setup",
      text: "Please wait while we check your campus configuration.",
    },
    needs_setup: {
      title: "Campus Setup Required",
      text: "Welcome! Complete your campus setup before accessing the assistant dashboard.",
    },
    error: {
      title: "Verification Failed",
      text: "We couldn't verify your account status. Please try again later.",
    },
  };

  const currentMessage = messages[status] || messages.error;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-[#08080C]/95 p-4 text-center text-white backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.07),transparent_30%),radial-gradient(circle_at_center,rgba(217,70,239,0.05),transparent_38%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 p-6 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-7"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/6" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent" />

        <div className="relative z-10">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border ${
              status === "error"
                ? "border-red-300/20 bg-red-500/10"
                : status === "needs_setup"
                  ? "border-amber-300/20 bg-amber-500/10"
                  : "border-violet-300/20 bg-violet-500/10"
            }`}
          >
            {status === "verifying" && (
              <Loader2 className="h-8 w-8 animate-spin text-violet-200" />
            )}

            {status === "needs_setup" && (
              <ShieldCheck className="h-8 w-8 text-amber-200" />
            )}

            {status === "error" && (
              <AlertTriangle className="h-8 w-8 text-red-300" />
            )}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
            Assistant Console
          </div>

          <h2
            className="mt-4 text-2xl font-extrabold tracking-tight text-white"
          >
            {currentMessage.title}
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
            {currentMessage.text}
          </p>

          {status === "needs_setup" && (
            <button
              onClick={onRedirect}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
            >
              Setup Assistant
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {status === "error" && (
            <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm font-bold text-red-200">
                Please refresh the page or contact support.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const DashboardContent = () => {
  const [summary, setSummary] = useState<{
    totalStudents: number;
    totalTeachers: number;
    totalAttendance: number;
    tokensToday: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const campusId = localStorage.getItem("CampusID");
        const res = await fetch(`/api/assistant/summary?campusId=${campusId}`);
        const data = await res.json();
        if (!data.error) {
          setSummary(data);
        }
      } catch (err) {
        console.error("Failed to fetch assistant summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading || !summary) {
    return (
      <div className="grid min-h-[70vh] place-items-center text-white">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-8 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-violet-200" />
            </div>

            <p className="mt-5 text-sm font-extrabold text-white">
              Loading dashboard data...
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Preparing assistant analytics and campus activity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Students",
      value: summary.totalStudents,
      icon: <GraduationCap className="h-5 w-5 text-violet-200" />,
      shell: "border-violet-300/20 bg-violet-500/10 text-violet-200",
    },
    {
      label: "Total Teachers",
      value: summary.totalTeachers,
      icon: <Users className="h-5 w-5 text-cyan-200" />,
      shell: "border-cyan-300/20 bg-cyan-500/10 text-cyan-200",
    },
    {
      label: "Attendance Today",
      value: summary.totalAttendance,
      icon: <UserRoundCheck className="h-5 w-5 text-emerald-300" />,
      shell: "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
    },
    {
      label: "Tokens Today",
      value: summary.tokensToday,
      icon: <TicketCheck className="h-5 w-5 text-fuchsia-200" />,
      shell: "border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-200",
    },
  ];

  return (
    <div className={`${styles.scrollbarHide} flex flex-col gap-6 text-white`}>
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
              <Radio className="h-3.5 w-3.5" />
              Classify Assistant
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Assistant Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Monitor campus users, attendance activity, token flow, and
              assistant-driven updates from one secure control center.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
                System Status
              </p>
              <p className="text-sm font-extrabold text-emerald-100">Online</p>
            </div>
          </div>
        </div>
      </motion.header>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: index * 0.05,
            }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.055]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10 flex items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${stat.shell}`}
              >
                {stat.icon}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <div className="relative min-h-[25rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10 h-full min-h-[22rem]">
            <AttendanceGraph />
          </div>
        </div>

        <div className="relative min-h-[25rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-violet-400/5" />

          <div className="relative z-10 h-full">
            <RecentActivity />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8" />

        <div className="relative z-10">
          <BottomStrip />
        </div>
      </section>
    </div>
  );
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "needs_setup" | "complete" | "error"
  >("verifying");

  useEffect(() => {
    const assistantID = localStorage.getItem("assistantId");

    if (!assistantID) {
      router.replace("/auth/login");
      return;
    }

    const checkAssistantSetup = async () => {
      try {
        const response = await fetch(
          `/api/assistant/details?assistantId=${assistantID}`,
        );
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.replace("/auth/login");
            return;
          }
          throw new Error(data.error || "Failed to verify admin status.");
        }
        const isNotConfigured = !data?.campus?.logoUrl;
        if (!data?.campusId || isNotConfigured) {
          setVerificationStatus("needs_setup");
        } else {
          localStorage.setItem("CampusID", data.campusId);
          setVerificationStatus("complete");
        }
      } catch (err: any) {
        setVerificationStatus("error");
        console.error(err.message);
      }
    };

    checkAssistantSetup();
  }, [router]);

  return (
    <>
      {verificationStatus === "complete" && <DashboardContent />}

      <AnimatePresence>
        {verificationStatus !== "complete" && (
          <VerificationGatekeeper
            status={verificationStatus}
            onRedirect={() => router.push("/setup/assistant")}
          />
        )}
      </AnimatePresence>
    </>
  );
}