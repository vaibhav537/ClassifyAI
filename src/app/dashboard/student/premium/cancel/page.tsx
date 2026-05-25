"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCcw, XCircle } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(50);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/dashboard/student/premium");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] top-[18%] h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-6 text-center shadow-2xl shadow-black/45 backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/12 via-violet-500/8 to-cyan-400/5" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-red-300/20 bg-red-500/10 shadow-2xl shadow-red-950/30">
            <XCircle className="h-11 w-11 text-red-300" />
          </div>

          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-red-200">
            Payment Failed
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            We couldn&apos;t process your payment
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            Your premium subscription was not activated. Please check your
            payment details or try again with another method.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Redirecting to premium plans in{" "}
              <span className="font-extrabold text-red-200">{countdown}</span>{" "}
              second{countdown !== 1 && "s"}...
            </p>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-fuchsia-500 to-violet-500 transition-all duration-500"
                style={{ width: `${((50 - countdown) / 50) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.push("/dashboard/student/premium")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/student")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;