"use client";

import React from "react";

const CircularProgress = ({ value }: { value: number }) => {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const progressColor =
    value < 50
      ? "stroke-red-400"
      : value < 75
        ? "stroke-amber-300"
        : "stroke-emerald-300";

  return (
    <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-[#08080C]/55 shadow-xl shadow-black/20">
      <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

      <svg
        height={radius * 2}
        width={radius * 2}
        className="relative z-10 -rotate-90"
      >
        <circle
          stroke="rgba(255,255,255,0.10)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          className={`${progressColor} transition-all duration-700 ease-out`}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <span className="absolute z-20 text-[10px] font-extrabold text-white">
        {Math.round(value)}%
      </span>
    </div>
  );
};

export default CircularProgress;
