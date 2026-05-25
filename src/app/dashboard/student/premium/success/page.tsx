"use client";

export const dynamic = "force-dynamic";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import Content from "./Content";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] px-4 text-white">
          <div className="pointer-events-none absolute inset-0 app-shell-bg" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center rounded-[2rem] border border-white/10 bg-[#14141B]/85 px-8 py-7 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <Loader2 className="h-9 w-9 animate-spin text-violet-300" />

            <p className="mt-4 text-lg font-extrabold text-white">
              Verifying Payment
            </p>

            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
              Please wait while we confirm your premium subscription.
            </p>
          </div>
        </div>
      }
    >
      <Content />
    </Suspense>
  );
}