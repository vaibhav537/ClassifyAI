"use client";

import React, { useState } from "react";
import { PremiumUser } from "@/lib/types";
import PremiumCancelModal from "../ui/PremiumCancelModal";
import { showSuccessMessage } from "@/lib/helper";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Crown,
  Mail,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRound,
  XCircle,
} from "lucide-react";

const PremiumUsersTable = ({
  users,
  onRefresh,
}: {
  users: PremiumUser[];
  onRefresh: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PremiumUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [action, setAction] = useState<"cancel" | "downgrade" | null>(null);

  const handleConfirm = async (reason: string) => {
    if (!selectedUser || !action) return;

    setLoading(true);

    try {
      const endpoint =
        action === "cancel"
          ? `/api/admin/remove-premium`
          : `/api/admin/downgrade-premium`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          reason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showSuccessMessage(
          action === "cancel" ? "Premium removed" : "Premium downgraded",
        );
        onRefresh();
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedUser(null);
      setAction(null);
      setLoading(false);
    }
  };

  const getPlanClass = (plan: string) => {
    if (plan === "ULTIMATE") {
      return "border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-200";
    }

    if (plan === "PRO") {
      return "border-cyan-300/20 bg-cyan-500/10 text-cyan-200";
    }

    return "border-violet-300/20 bg-violet-500/10 text-violet-200";
  };

  const getStatusClass = (status: string) => {
    if (status === "ACTIVE") {
      return "border-emerald-300/20 bg-emerald-500/10 text-emerald-300";
    }

    return "border-red-300/20 bg-red-500/10 text-red-300";
  };

  if (users.length === 0) {
    return (
      <div className="grid h-full min-h-[28rem] place-items-center rounded-[1.75rem] border border-dashed border-white/10 bg-[#08080C]/45 p-6 text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
            <Crown className="h-7 w-7 text-violet-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            No premium users found
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Try changing the search term or selected subscription filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[28rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

      <div className="relative z-10 hidden h-full overflow-auto scrollbar-hide xl:block">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className="sticky top-0 z-20 border-b border-white/10 bg-[#14141B]/95 backdrop-blur-2xl">
            <tr className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Plan</th>
              <th className="px-5 py-4">Start Date</th>
              <th className="px-5 py-4">End Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            <AnimatePresence>
              {users.map((user, index) => (
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
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                        <UserRound className="h-4 w-4 text-violet-200" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-white">
                          {user.name}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                          Premium Member
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
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ${getPlanClass(
                        user.plan,
                      )}`}
                    >
                      <Crown className="h-3.5 w-3.5" />
                      {user.plan}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                      <CalendarDays className="h-4 w-4 text-slate-600" />
                      {new Date(user.startDate).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                      <CalendarDays className="h-4 w-4 text-slate-600" />
                      {new Date(user.endDate).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ${getStatusClass(
                        user.status,
                      )}`}
                    >
                      {user.status === "ACTIVE" ? (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setAction("downgrade");
                          setShowModal(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-4 py-2.5 text-xs font-extrabold text-cyan-200 transition hover:bg-cyan-500/20"
                      >
                        <Sparkles className="h-4 w-4" />
                        Downgrade
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setAction("cancel");
                          setShowModal(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-2.5 text-xs font-extrabold text-red-300 transition hover:bg-red-500/20"
                      >
                        <TriangleAlert className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="relative z-10 h-full overflow-y-auto p-3 scrollbar-hide xl:hidden">
        <div className="space-y-3">
          <AnimatePresence>
            {users.map((user, index) => (
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
                      <div className="flex min-w-0 items-center gap-2">
                        <UserRound className="h-4 w-4 shrink-0 text-violet-200" />
                        <p className="truncate text-sm font-extrabold text-white">
                          {user.name}
                        </p>
                      </div>

                      <p className="mt-2 truncate text-xs font-semibold text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${getPlanClass(
                        user.plan,
                      )}`}
                    >
                      {user.plan}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Start
                      </p>
                      <p className="mt-1 text-xs font-extrabold text-slate-300">
                        {new Date(user.startDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        End
                      </p>
                      <p className="mt-1 text-xs font-extrabold text-slate-300">
                        {new Date(user.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Status
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${getStatusClass(
                        user.status,
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setAction("downgrade");
                        setShowModal(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-4 py-3 text-xs font-extrabold text-cyan-200 transition hover:bg-cyan-500/20"
                    >
                      <Sparkles className="h-4 w-4" />
                      Downgrade
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setAction("cancel");
                        setShowModal(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-xs font-extrabold text-red-300 transition hover:bg-red-500/20"
                    >
                      <TriangleAlert className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <PremiumCancelModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setAction(null);
          setSelectedUser(null);
        }}
        loading={loading}
        onConfirm={handleConfirm}
        message={`Are you sure you want to ${
          action === "cancel" ? "cancel" : "downgrade"
        } premium for ${selectedUser?.name}?`}
      />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-10 bg-gradient-to-t from-[#08080C] to-transparent" />
    </div>
  );
};

export default PremiumUsersTable;