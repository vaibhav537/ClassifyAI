"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorState = ({ message }: { message: string }) => {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-red-300/20 bg-red-500/10 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-violet-500/8" />

      <div className="relative z-10 mx-auto max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-red-300/20 bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-300" />
        </div>

        <p className="mt-4 text-lg font-extrabold tracking-tight text-red-200">
          Unable to Load Data
        </p>

        <p className="mt-2 text-sm leading-6 text-red-100/70">
          {message || "An error occurred while loading data."}
        </p>
      </div>
    </div>
  );
};

export default ErrorState;
