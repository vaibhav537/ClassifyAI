"use client";

import React from "react";

const ChartSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/8" />

      <div className="relative z-10 animate-pulse">
        <div className="mb-5">
          <div className="h-6 w-36 rounded-full bg-white/10" />
          <div className="mt-3 h-6 w-56 rounded-2xl bg-white/10" />
          <div className="mt-2 h-3 w-80 max-w-full rounded-full bg-white/10" />
        </div>

        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-white/10 bg-[#14141B]/70 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="h-4 w-40 rounded-full bg-white/10" />
                <div className="h-6 w-16 rounded-full bg-white/10" />
              </div>

              <div className="flex h-44 items-end gap-3 rounded-2xl border border-white/10 bg-[#08080C]/45 p-4">
                {[50, 70, 45, 90, 62, 76, 58].map((height, index) => (
                  <div
                    key={index}
                    className="flex flex-1 items-end rounded-full bg-white/5"
                  >
                    <div
                      className="w-full rounded-full bg-white/10"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;