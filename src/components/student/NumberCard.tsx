"use client";

import { NumberCardsProps } from "@/lib/types";
import React from "react";

const NumberCard: React.FC<NumberCardsProps> = ({ title, value }) => {
  return (
    <div className="relative flex min-h-[130px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-[#1B1B24]/90">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/8" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-violet-400/15 blur-2xl" />

      <div className="relative z-10 flex w-full flex-col justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>

        <div className="mt-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white 2xl:text-5xl">
            {value}
          </h1>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-300" />
        </div>
      </div>
    </div>
  );
};

export default NumberCard;