"use client";

import { HorizontalBarProps } from "@/lib/types";
import { ArrowUpRight, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props extends HorizontalBarProps {
  locked?: boolean;
}

const HorizontalBar: React.FC<Props> = ({
  title,
  content,
  linkRef,
  locked = false,
}) => {
  const cardContent = (
    <div
      className={`group relative flex min-h-[112px] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#14141B]/85 p-4 shadow-xl shadow-black/25 backdrop-blur-xl transition duration-300 ${
        locked
          ? "cursor-not-allowed opacity-70"
          : "cursor-pointer hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-[#1B1B24]/90 hover:shadow-2xl hover:shadow-violet-950/20"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-1 flex-col justify-between pr-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${
                locked
                  ? "border-slate-500/20 bg-slate-500/10"
                  : "border-violet-300/20 bg-violet-500/10"
              }`}
            >
              {locked ? (
                <Lock className="h-4 w-4 text-slate-400" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-violet-300" />
              )}
            </span>

            {locked && (
              <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-200">
                Premium
              </span>
            )}
          </div>

          <h3 className="text-base font-extrabold tracking-tight text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">{content}</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition duration-300 ${
            locked
              ? "border-slate-500/20 bg-slate-500/10 text-slate-500"
              : "border-white/10 bg-white/[0.06] text-violet-200 group-hover:border-violet-300/35 group-hover:bg-violet-500/15"
          }`}
        >
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-5 w-5 transition duration-300 group-hover:translate-x-0.5" />
          )}
        </div>
      </div>

      {locked && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 translate-y-2 rounded-2xl border border-white/10 bg-[#08080C]/90 px-3 py-2 text-center text-xs font-bold text-slate-300 opacity-0 shadow-xl shadow-black/30 backdrop-blur-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Upgrade to unlock this feature
        </div>
      )}
    </div>
  );

  if (locked) {
    return cardContent;
  }

  return (
    <Link href={linkRef} className="block w-full">
      {cardContent}
    </Link>
  );
};

export default HorizontalBar;