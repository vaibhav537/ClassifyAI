"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

const TrendIndicator = ({
  value,
  threshold,
}: {
  value: number;
  threshold: number;
}) => {
  const isGood = value >= threshold;

  return (
    <div
      className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold ${
        isGood
          ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
          : "border-red-300/20 bg-red-500/10 text-red-300"
      }`}
    >
      {isGood ? (
        <>
          <TrendingUp size={14} />
          <span>Good</span>
        </>
      ) : (
        <>
          <TrendingDown size={14} />
          <span>Low</span>
        </>
      )}
    </div>
  );
};

export default TrendIndicator;