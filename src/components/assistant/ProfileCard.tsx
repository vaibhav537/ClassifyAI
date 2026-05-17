"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const ProfileCard = () => {
  return (
    <motion.div
      className="group relative flex min-w-[12rem] items-center justify-between gap-3 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#14141B]/80 px-3 py-2 text-white shadow-xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.055] lg:min-w-[13.5rem] lg:px-4 lg:py-3"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-500/15 blur-2xl transition duration-300 group-hover:bg-violet-500/25" />

      <div className="relative z-10 flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 lg:h-11 lg:w-11">
          <Image
            src="/only-logo.png"
            alt="App Logo"
            width={44}
            height={44}
            className="h-7 w-auto invert lg:h-8"
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold tracking-tight text-white lg:text-base">
            Classify AI
          </p>
          <p className="mt-0.5 truncate text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200/70">
            Assistant
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;