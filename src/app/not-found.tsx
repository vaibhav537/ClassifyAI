"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080C] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* Floating particles */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1.2 }}
      >
        <Sparkles className="h-full w-full animate-pulse text-violet-300" />
      </motion.div>

      <section className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
            Page Not Found
          </div>

          {/* 404 text */}
          <motion.h1
            initial={{ scale: 0.88, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-center gap-2 drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent sm:text-9xl">
              4
            </span>
            <span className="text-6xl font-extrabold tracking-tight text-white sm:text-8xl">
              0
            </span>
            <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-violet-400 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent sm:text-9xl">
              4
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.3, ease: "easeOut" }}
            className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:text-base"
          >
            Oops! The page you’re looking for doesn’t exist in{" "}
            <span className="font-extrabold uppercase text-violet-200">
              ClassifyAI
            </span>
            .
          </motion.p>

          {/* Call to action */}
          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            className="mt-8 flex justify-center"
          >
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/login"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
              >
                <ArrowLeft size={20} />
                Go Back Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}