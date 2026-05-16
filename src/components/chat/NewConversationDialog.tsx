"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  Lock,
  MessageCircle,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import useSWR from "swr";
import { mutate } from "swr";
import { NewConversationDialogProps } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function NewConversationDialog({
  isOpen,
  onClose,
  userId,
  campusId,
  onCreated,
}: NewConversationDialogProps) {
  const [mode, setMode] = useState<"DIRECT" | "GROUP">("DIRECT");
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isTeacherOnly, setIsTeacherOnly] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "");
  }, []);

  const usersUrl =
    campusId && userId
      ? `/api/users?campusId=${campusId}&requesterId=${userId}&forGroup=${
          mode === "GROUP"
        }${isTeacherOnly ? "&teacherOnly=true" : ""}`
      : null;

  const { data: users } = useSWR(usersUrl, fetcher);

  const filtered = users?.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelect = (id: string) => {
    if (mode === "DIRECT") {
      setSelectedIds([id]);
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleCreate = async () => {
    if (selectedIds.length === 0) return;
    if (mode === "GROUP" && !groupName.trim()) return;

    setIsCreating(true);

    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mode,
          name: mode === "GROUP" ? groupName : undefined,
          campusId,
          creatorId: userId,
          participantIds: selectedIds,
          isTeacherOnly: mode === "GROUP" ? isTeacherOnly : false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Create conversation error: ", data.error);
        return;
      }

      mutate(`/api/chat/conversations?userId=${userId}`);
      onCreated(data.id);
      handleClose();
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSearch("");
    setGroupName("");
    setSelectedIds([]);
    setMode("DIRECT");
    setIsTeacherOnly(false);
    onClose();
  };

  const canCreateTeacherOnly = userRole === "TEACHER";

  const canCreateGroup = ["STUDENT", "TEACHER", "ASSISTANT"].includes(userRole);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 18, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-cyan-400/6" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10 flex max-h-[90vh] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Chat
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  New Conversation
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Start a direct message or create a campus group.
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
              >
                <X size={18} />
              </motion.button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              <div className="relative mb-5 grid rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-1.5">
                <div
                  className={`absolute bottom-1.5 top-1.5 rounded-2xl bg-violet-500/20 ring-1 ring-violet-300/30 transition-all duration-300 ${
                    mode === "DIRECT"
                      ? "left-1.5 right-[calc(50%+0.1875rem)]"
                      : "left-[calc(50%+0.1875rem)] right-1.5"
                  }`}
                />

                <div className="relative z-10 grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("DIRECT");
                      setSelectedIds([]);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                      mode === "DIRECT"
                        ? "text-violet-100"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    <User size={16} />
                    Direct
                  </button>

                  {canCreateGroup ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("GROUP");
                        setSelectedIds([]);
                      }}
                      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                        mode === "GROUP"
                          ? "text-violet-100"
                          : "text-slate-500 hover:text-white"
                      }`}
                    >
                      <Users size={16} />
                      Group
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold text-slate-700"
                    >
                      <Users size={16} />
                      Group
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {mode === "GROUP" && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-5 space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Group name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    />

                    {canCreateTeacherOnly && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsTeacherOnly((prev) => !prev);
                          setSelectedIds([]);
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                          isTeacherOnly
                            ? "border-violet-300/35 bg-violet-500/15 text-violet-100"
                            : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-violet-300/25 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <Lock size={16} />
                        {isTeacherOnly
                          ? "Teacher-Only Group Enabled"
                          : "Make Teacher-Only Group"}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Search people..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 pl-11 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <ul className="mb-5 max-h-60 space-y-2 overflow-y-auto scrollbar-hide">
                {filtered?.map((user: any, i: number) => {
                  const isSelected = selectedIds.includes(user.id);

                  return (
                    <motion.li
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <motion.button
                        type="button"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSelect(user.id)}
                        className={`group flex w-full items-center gap-3 rounded-[1.25rem] border px-3 py-3 text-left transition duration-300 ${
                          isSelected
                            ? "border-violet-300/35 bg-violet-500/15"
                            : "border-white/10 bg-white/[0.04] hover:border-violet-300/25 hover:bg-white/[0.06]"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                            isSelected
                              ? "border-violet-300/30 bg-violet-500/20"
                              : "border-white/10 bg-[#08080C]/45"
                          }`}
                        >
                          <User size={16} className="text-violet-200" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-white">
                            {user.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
                            {user.role}
                          </p>
                        </div>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/30"
                            >
                              <Check size={14} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </motion.li>
                  );
                })}

                {filtered?.length === 0 && (
                  <li className="grid min-h-32 place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-5 text-center">
                    <div>
                      <MessageCircle className="mx-auto h-7 w-7 text-slate-600" />
                      <p className="mt-3 text-sm font-bold text-slate-400">
                        No users found
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="border-t border-white/10 px-5 py-5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                disabled={
                  isCreating ||
                  selectedIds.length === 0 ||
                  (mode === "GROUP" && !groupName.trim())
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                {isCreating ? "Creating..." : "Start Conversation"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}