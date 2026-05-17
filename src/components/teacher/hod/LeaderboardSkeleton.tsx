"use client";

import React from "react";

const LeaderboardSkeleton = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-pulse">
          <div className="h-6 w-44 rounded-full bg-white/10" />
          <div className="mt-3 h-6 w-52 rounded-2xl bg-white/10" />
          <div className="mt-2 h-3 w-72 max-w-full rounded-full bg-white/10" />
        </div>

        <div className="h-11 w-40 animate-pulse rounded-2xl bg-white/10" />
      </div>

      <div className="relative h-72 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-violet-500/8" />

        <div className="relative z-10 flex h-full animate-pulse items-end gap-4 rounded-[1.35rem] border border-white/10 bg-[#14141B]/60 p-4">
          {[58, 82, 45, 70, 62, 88].map((height, index) => (
            <div
              key={index}
              className="flex flex-1 items-end rounded-full bg-white/5"
            >
              <div
                className="w-full rounded-t-2xl bg-white/10"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/8 via-transparent to-violet-500/8" />

            <div className="relative z-10 flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/10" />

                <div className="min-w-0">
                  <div className="h-4 w-40 rounded-full bg-white/10" />
                  <div className="mt-2 h-3 w-52 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="h-8 w-20 rounded-full bg-white/10" />
                <div className="h-8 w-24 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;