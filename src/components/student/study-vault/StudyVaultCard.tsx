"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function StudyVaultCard({ res, getIcon, onClick }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onClick={() => onClick(res)}
      className="group relative min-h-[210px] cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.065] hover:shadow-2xl hover:shadow-violet-950/20"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/6 opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/12 blur-3xl" />

      {res.aiSummary?.length > 0 && (
        <div className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-violet-200">
          <Sparkles size={16} className="animate-pulse" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#08080C]/45 transition duration-300 group-hover:border-violet-300/30 group-hover:bg-violet-500/10">
            {getIcon(res.resourceType)}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
              {res.resourceType}
            </p>

            <p className="mt-1 truncate text-xs font-bold text-violet-300">
              {res.subject?.name || "No Subject"}
            </p>
          </div>
        </div>

        <h3 className="line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-white transition duration-300 group-hover:text-violet-100">
          {res.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {res.description || "Click to preview this resource."}
        </p>

        <div className="mt-auto pt-5">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 transition duration-300 group-hover:border-violet-300/25 group-hover:bg-violet-500/10 group-hover:text-violet-200">
            Open Resource
          </div>
        </div>
      </div>
    </motion.div>
  );
}