"use client";

import React from "react";

const PulseSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative h-40 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10 animate-pulse">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="h-3 w-28 rounded-full bg-white/10" />
                <div className="mt-3 h-4 w-36 rounded-full bg-white/10" />
              </div>

              <div className="h-11 w-11 rounded-2xl bg-white/10" />
            </div>

            <div className="h-8 w-20 rounded-2xl bg-white/10" />

            <div className="mt-4 flex gap-2">
              <div className="h-7 w-20 rounded-full bg-white/10" />
              <div className="h-7 w-24 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PulseSkeleton;
