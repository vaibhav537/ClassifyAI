"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function DashboardLoader() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] px-4 text-white">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] top-[18%] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-sm flex-col items-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 px-8 py-8 text-center shadow-2xl shadow-black/45 backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-cyan-400/8" />

        <div className="relative z-10">
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-white/10 border-t-violet-300 border-r-fuchsia-300"
            />

            <motion.div
              initial={{ opacity: 0.45, scale: 0.9 }}
              animate={{ opacity: [0.45, 0.9, 0.45], scale: [0.9, 1.08, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute h-28 w-28 rounded-full bg-violet-500/20 blur-2xl"
            />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.05] shadow-2xl shadow-violet-950/35">
              <Image
                src="/only-logo.png"
                alt="Classify AI"
                width={58}
                height={58}
                priority
                className="h-14 w-14 object-contain drop-shadow-[0_0_24px_rgba(34,211,238,0.22)]"
              />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="mt-7 text-lg font-extrabold tracking-tight text-white"
          >
            Loading dashboard...
          </motion.p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Preparing your Classify AI workspace.
          </p>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: ["-100%", "120%"] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-300"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}