"use client";

import { User } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  GraduationCap,
  Loader2,
  Mail,
  UserRoundCog,
  Users,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type UserRole = "STUDENT" | "TEACHER";

const getPlanLabel = (user: any) => {
  if (!user.isPremium || !user.premiumFeatures?.length) return "Starter";

  const premiumSet = new Set(user.premiumFeatures.map((f: any) => f.name));
  const allFeatures = ["AI_CHATBOT", "STUDY_PLAN", "CALENDAR_SYNC"];
  const hasAll = allFeatures.every((f) => premiumSet.has(f));

  if (hasAll) return "Ultimate";
  return "Pro";
};

const UserTable = ({
  role: controlledRole,
  campusId: controlledCampusId,
}: {
  role?: UserRole;
  campusId?: string;
}) => {
  const [localCampusId, setLocalCampusId] = useState("");
  const role = controlledRole || "STUDENT";
  const campusId = controlledCampusId || localCampusId;

  useEffect(() => {
    if (controlledCampusId) return;

    const CampusID = localStorage.getItem("CampusID");
    if (CampusID) {
      setLocalCampusId(CampusID);
    }
  }, [controlledCampusId]);

  const { data, isLoading, error } = useSWR<{ users: User[] }>(
    campusId ? `/api/assistant/users?role=${role}&campusId=${campusId}` : null,
    fetcher,
  );

  const users = data?.users || [];

  return (
    <div className="flex h-full min-h-0 flex-col text-white">
      <div className="mb-4 shrink-0">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
          <Users className="h-3.5 w-3.5" />
          User Directory
        </span>

        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
          {role === "STUDENT" ? "Student Records" : "Teacher Records"}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Showing campus users for{" "}
          <span className="font-extrabold text-violet-200">{role}</span>.
        </p>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        {isLoading ? (
          <div className="relative z-10 grid h-full min-h-[26rem] place-items-center text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
                <Loader2 className="h-7 w-7 animate-spin text-violet-200" />
              </div>

              <p className="mt-4 text-sm font-extrabold text-slate-300">
                Loading {role.toLowerCase()} records...
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Fetching campus directory data.
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="relative z-10 grid h-full min-h-[26rem] place-items-center text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-red-300/20 bg-red-500/10">
                <AlertTriangle className="h-7 w-7 text-red-300" />
              </div>

              <p className="mt-4 text-sm font-extrabold text-red-200">
                Failed to load users
              </p>

              <p className="mt-1 text-xs leading-5 text-red-100/70">
                Please refresh and try again.
              </p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="relative z-10 grid h-full min-h-[26rem] place-items-center text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
                <Users className="h-7 w-7 text-violet-200" />
              </div>

              <p className="mt-4 text-sm font-extrabold text-slate-300">
                No {role.toLowerCase()}s found
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Generated onboarding links can be used to add users.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 h-full min-h-[26rem] overflow-hidden"
          >
            <div className="hidden h-full overflow-auto scrollbar-hide lg:block">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="sticky top-0 z-20 border-b border-white/10 bg-[#14141B]/95 backdrop-blur-2xl">
                  <tr className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Created At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  <AnimatePresence>
                    {users.map((user, index) => {
                      const plan = getPlanLabel(user);

                      return (
                        <motion.tr
                          key={user.id}
                          layout
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -14 }}
                          transition={{
                            duration: 0.3,
                            ease: "easeOut",
                            delay: index * 0.025,
                          }}
                          className="group transition duration-300 hover:bg-white/[0.045]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                                  role === "STUDENT"
                                    ? "border-violet-300/20 bg-violet-500/10 text-violet-200"
                                    : "border-cyan-300/20 bg-cyan-500/10 text-cyan-200"
                                }`}
                              >
                                {role === "STUDENT" ? (
                                  <GraduationCap className="h-4 w-4" />
                                ) : (
                                  <UserRoundCog className="h-4 w-4" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-extrabold text-white">
                                  {user.name}
                                </p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                  {role}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-400">
                              <Mail className="h-4 w-4 shrink-0 text-slate-600" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                                plan === "Ultimate"
                                  ? "border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-200"
                                  : plan === "Pro"
                                    ? "border-cyan-300/20 bg-cyan-500/10 text-cyan-200"
                                    : "border-slate-300/20 bg-slate-500/10 text-slate-300"
                              }`}
                            >
                              {plan}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                              <CalendarDays className="h-4 w-4 text-slate-600" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="h-full overflow-y-auto p-3 scrollbar-hide lg:hidden">
              <div className="space-y-3">
                <AnimatePresence>
                  {users.map((user, index) => {
                    const plan = getPlanLabel(user);

                    return (
                      <motion.article
                        key={user.id}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                          delay: index * 0.025,
                        }}
                        className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#14141B]/75 p-4 shadow-xl shadow-black/20"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-extrabold text-white">
                                {user.name}
                              </p>

                              <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                                {user.email}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
                                plan === "Ultimate"
                                  ? "border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-200"
                                  : plan === "Pro"
                                    ? "border-cyan-300/20 bg-cyan-500/10 text-cyan-200"
                                    : "border-slate-300/20 bg-slate-500/10 text-slate-300"
                              }`}
                            >
                              {plan}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                              Created
                            </span>

                            <span className="text-xs font-extrabold text-slate-300">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserTable;