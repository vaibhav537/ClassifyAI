"use client";

import React, { Suspense } from "react";
import { Loader2, ClipboardList } from "lucide-react";
import QuestionContent from "@/components/student/assignments/QuestionContent";

const QuestionPage = () => {
  return (
    <Suspense
      fallback={
        <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] px-4 text-white">
          <div className="pointer-events-none absolute inset-0 app-shell-bg" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="pointer-events-none absolute right-[12%] top-[18%] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center rounded-[2rem] border border-white/10 bg-[#14141B]/85 px-8 py-7 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <ClipboardList className="h-7 w-7 text-violet-200" />
            </div>

            <Loader2 className="mt-5 h-8 w-8 animate-spin text-violet-300" />

            <p className="mt-4 text-lg font-extrabold text-white">
              Loading Assignment
            </p>

            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
              Preparing questions and submission details...
            </p>
          </div>
        </section>
      }
    >
      <QuestionContent />
    </Suspense>
  );
};

export default QuestionPage;