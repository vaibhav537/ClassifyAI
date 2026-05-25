"use client";

import React from "react";

const StatusBadge = ({ status }: { status: string }) => {
  const isPending = status === "PENDING";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
        isPending
          ? "border-red-300/20 bg-red-500/10 text-red-300"
          : "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      {isPending ? "Pending" : "Active"}
    </span>
  );
};

export default StatusBadge;