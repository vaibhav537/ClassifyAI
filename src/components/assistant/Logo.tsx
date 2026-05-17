"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const Logo = () => {
  const [assistantName, setAssistantName] = useState("");
  const [campusName, setCampusName] = useState("");

  useEffect(() => {
    const fetchAssistantProfile = async () => {
      try {
        const assistantId = localStorage.getItem("assistantId");
        const campusId = localStorage.getItem("CampusID");

        const query = assistantId
          ? `assistantId=${assistantId}`
          : campusId
            ? `campusId=${campusId}`
            : "";

        if (!query) return;

        const res = await fetch(`/api/assistant/profile?${query}`);
        const data = await res.json();

        if (data.success) {
          setAssistantName(data.assistant?.name || "");
          setCampusName(data.assistant?.campus?.name || "");
        }
      } catch (error) {
        console.error("Failed to fetch assistant profile:", error);
      }
    };

    fetchAssistantProfile();
  }, []);

  const displayName = campusName || assistantName || "Assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex min-w-0 items-center gap-3"
    >
      <motion.div
        initial={{ rotate: -8, scale: 0.92 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-black/20 lg:h-12 lg:w-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-400/10" />

        <Image
          src="/only-logo.png"
          width={48}
          height={48}
          className="relative z-10 h-7 w-auto invert lg:h-8"
          alt="Classify AI Logo"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.12, duration: 0.25, ease: "easeOut" }}
        className="hidden min-w-0 flex-1 lg:block"
      >
        <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-500/10 px-2.5 py-1">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-violet-200" />

          <p className="max-w-[8.5rem] truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-violet-200/80">
            {displayName}
          </p>
        </div>

        <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
          Classify AI Assistant
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Logo;