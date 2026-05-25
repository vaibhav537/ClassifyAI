"use client";

import React from "react";

const RadarSkeleton = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-pulse">
          <div className="h-6 w-36 rounded-full bg-white/10" />
          <div className="mt-3 h-6 w-44 rounded-2xl bg-white/10" />
          <div className="mt-2 h-3 w-64 max-w-full rounded-full bg-white/10" />
        </div>

        <div className="h-11 w-32 animate-pulse rounded-2xl bg-white/10" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-violet-500/8" />

            <div className="relative z-10 animate-pulse">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-40 rounded-2xl bg-white/10" />
                  <div className="mt-2 h-3 w-24 rounded-full bg-white/10" />
                </div>

                <div className="h-7 w-20 rounded-full bg-white/10" />
              </div>

              <div className="space-y-3 rounded-[1.35rem] border border-white/10 bg-[#14141B]/60 p-3">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-3 w-32 rounded-full bg-white/10" />
                      <div className="h-5 w-12 rounded-full bg-white/10" />
                    </div>

                    <div className="h-2 w-full rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarSkeleton;
