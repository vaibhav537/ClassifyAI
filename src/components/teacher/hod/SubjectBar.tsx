"use client";

import React from "react";

const SubjectBar = ({ sub }: { sub: any }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="min-w-0 truncate font-bold text-slate-300">
          {sub.subjectName}{" "}
          <span className="font-semibold text-slate-500">
            ({sub.subjectCode})
          </span>
        </span>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${
            sub.percentage < 50
              ? "border-red-300/20 bg-red-500/10 text-red-300"
              : sub.percentage < 75
                ? "border-amber-300/20 bg-amber-500/10 text-amber-300"
                : "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {sub.percentage}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            sub.percentage < 50
              ? "bg-gradient-to-r from-red-500 to-rose-400"
              : sub.percentage < 75
                ? "bg-gradient-to-r from-amber-500 to-yellow-300"
                : "bg-gradient-to-r from-emerald-500 to-green-300"
          }`}
          style={{ width: `${sub.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SubjectBar;
