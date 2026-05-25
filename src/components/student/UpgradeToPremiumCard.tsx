"use client";

import { ArrowRight, Crown, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const UpgradeToPremiumCard = () => {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/90 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-400/10" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 grid gap-5 sm:grid-cols-[1fr_140px] lg:grid-cols-1 2xl:grid-cols-[1fr_170px]">
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg shadow-black/20">
              <Crown className="h-6 w-6 text-violet-200" />
            </div>

            <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-violet-200">
              Premium
            </span>
          </div>

          <Image
            src="/logo-nobg.png"
            alt="Classify AI"
            width={220}
            height={70}
            className="h-auto w-[170px] object-contain drop-shadow-[0_0_24px_rgba(34,211,238,0.18)] sm:w-[190px] 2xl:w-[220px]"
            priority
          />

          <div className="mt-5">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <Sparkles className="h-3 w-3 text-violet-300" />
              Upgrade Workspace
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Go Premium
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Unlock advanced study tools, AI assistance, smarter planning and
              premium student features.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/student/premium")}
            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
          >
            Upgrade Now
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="hidden items-end justify-center sm:flex lg:hidden 2xl:flex">
          <div className="relative flex h-full min-h-40 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
            <Image
              src="/books.png"
              alt="Premium learning tools"
              width={180}
              height={180}
              className="h-32 w-32 object-contain drop-shadow-2xl 2xl:h-40 2xl:w-40"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToPremiumCard;