"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserTable from "@/components/assistant/UserTable";
import LinkCards from "@/components/assistant/LinkCards";
import useSWR from "swr";
import { Users, GraduationCap, UserRoundCog } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ManageUsers = () => {
  const [campusId, setCampusId] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");

  useEffect(() => {
    const CampusID = localStorage.getItem("CampusID");
    if (CampusID) {
      setCampusId(CampusID);
    }
  }, []);

  const { mutate } = useSWR(
    campusId ? `/api/assistant/users?role=${role}&campusId=${campusId}` : null,
    fetcher,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex h-full min-h-0 flex-col gap-6 text-white"
    >
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
              <Users className="h-3.5 w-3.5" />
              Assistant Control
            </span>

            <h1
              className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl "
            >
              Manage Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review student and teacher records, generate onboarding links, and
              manage campus user access from one assistant workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-extrabold transition duration-300 ${
                role === "STUDENT"
                  ? "border-violet-300/35 bg-violet-500/20 text-violet-100"
                  : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-violet-300/30 hover:bg-violet-500/10 hover:text-violet-100"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Students
            </button>

            <button
              type="button"
              onClick={() => setRole("TEACHER")}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-extrabold transition duration-300 ${
                role === "TEACHER"
                  ? "border-cyan-300/35 bg-cyan-500/20 text-cyan-100"
                  : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-cyan-300/30 hover:bg-cyan-500/10 hover:text-cyan-100"
              }`}
            >
              <UserRoundCog className="h-4 w-4" />
              Teachers
            </button>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3, ease: "easeOut" }}
        className="relative min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-white">
                User Directory
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Current selected view:{" "}
                <span className="font-extrabold text-violet-200">{role}</span>
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide">
            <UserTable role={role} campusId={campusId} />
          </div>
        </div>
      </motion.section>

      <motion.section
        className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-w-0"
        >
          <LinkCards forRole="student" onActionComplete={() => mutate()} />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-w-0"
        >
          <LinkCards forRole="teacher" onActionComplete={() => mutate()} />
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default ManageUsers;