"use client";

import React from "react";

const RiskBadge = ({ value }: { value: number }) => {
  let color = "border-emerald-300/20 bg-emerald-500/10 text-emerald-300";
  let text = "Safe";

  if (value < 50) {
    color = "border-red-300/20 bg-red-500/10 text-red-300";
    text = "Critical";
  } else if (value < 75) {
    color = "border-amber-300/20 bg-amber-500/10 text-amber-300";
    text = "Warning";
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ${color}`}
    >
      {text}
    </span>
  );
};

export default RiskBadge;
