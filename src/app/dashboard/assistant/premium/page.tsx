"use client";

import PremiumHeader from "@/components/assistant/PremiumHeader";
import PremiumUsersTable from "@/components/assistant/PremiumUsersTable";
import RecentPremiumActivity from "@/components/assistant/RecentPremiumActivity";
import SearchFilterBar from "@/components/assistant/SearchFilterBar";
import StatsRow from "@/components/assistant/StatsRow";
import UpcomingExpirations from "@/components/assistant/UpcomingExpiration";
import { PremiumUser, Stats } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { titleArrayForPremiumPage } from "@/lib/helper";
import { Crown, Loader2, Sparkles, UsersRound } from "lucide-react";

const Page = () => {
  const [totalPremiumUsers, setTotalPremiumUsers] = useState<number>(0);
  const [allUsers, setAllUsers] = useState<PremiumUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchPremiumCount = async (id: string) => {
    try {
      const res = await fetch(`/api/users/premium-count?campusId=${id}`);
      const data = await res.json();

      if (data.success) {
        setTotalPremiumUsers(data.totalPremiums);
      }
    } catch (err) {
      console.error("Failed to fetch premium count", err);
    }
  };

  const fetchStats = async (id: string) => {
    const res = await fetch(`/api/users/stats?campusId=${id}`);
    const data = await res.json();

    if (data.success) {
      setStats(data.stats);
    }
  };

  const fetchPremiumUsers = async (id: string) => {
    const res = await fetch(`/api/users/premium-count/all?campusId=${id}`);
    const data = await res.json();

    if (data.success) {
      setAllUsers(data.users);
    }
  };

  useEffect(() => {
    const campusId = localStorage.getItem("CampusID") || "";

    fetchPremiumUsers(campusId);
    fetchStats(campusId);
    fetchPremiumCount(campusId);
  }, []);

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Pro" && user.plan === "PRO") ||
      (filter === "Ultimate" && user.plan === "ULTIMATE") ||
      (filter === "Expired" && user.status === "EXPIRED");

    return matchesSearch && matchesFilter;
  });

  if (!stats) {
    return (
      <div className="grid min-h-[70vh] place-items-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-8 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-violet-200" />
            </div>

            <p className="mt-5 text-sm font-extrabold text-white">
              Loading premium dashboard...
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Preparing premium users, subscriptions, and campus analytics.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative flex min-h-full flex-col gap-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <PremiumHeader totalPremiumStudents={totalPremiumUsers} />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        <div className="relative z-10">
          <StatsRow stats={stats} titleArray={titleArrayForPremiumPage} />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/8 via-transparent to-violet-500/5" />

        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-fuchsia-200">
                <Sparkles className="h-3.5 w-3.5" />
                Search & Filter
              </span>

              <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
                Premium Directory Controls
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Search by name/email and filter users by subscription plan.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-extrabold text-slate-400">
              <UsersRound className="h-4 w-4 text-violet-200" />
              {filteredUsers.length}/{allUsers.length} shown
            </div>
          </div>

          <SearchFilterBar
            onSearch={setSearchTerm}
            onFilter={setFilter}
            currentFilter={filter}
          />
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11, duration: 0.3, ease: "easeOut" }}
          className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

          <div className="relative z-10 flex h-full min-h-0 flex-col">
            <div className="mb-4 shrink-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
                <Crown className="h-3.5 w-3.5" />
                Premium Users
              </span>

              <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
                Subscription Records
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Filtered premium users based on current search and plan status.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={filter + searchTerm}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full min-h-0"
                >
                  <PremiumUsersTable
                    users={filteredUsers}
                    onRefresh={() => {
                      const campusId = localStorage.getItem("CampusID") || "";
                      fetchPremiumUsers(campusId);
                      fetchStats(campusId);
                      fetchPremiumCount(campusId);
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.3, ease: "easeOut" }}
          className="flex min-h-0 flex-col gap-6"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/8 via-transparent to-violet-500/5" />

            <div className="relative z-10">
              <RecentPremiumActivity />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/5" />

            <div className="relative z-10">
              <UpcomingExpirations />
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
};

export default Page;
