"use client";

import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative min-w-0 overflow-hidden  rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.055] sm:p-7"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition duration-300 group-hover:bg-violet-500/15" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;