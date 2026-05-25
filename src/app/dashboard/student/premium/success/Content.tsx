"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, Crown, Loader2, Sparkles } from "lucide-react";
import { showErrorMessage, showSuccessMessage } from "@/lib/helper";

export default function Content() {
  const [progress, setProgress] = useState(10);
  const router = useRouter();
  const params = useSearchParams();

  const sessionId = params.get("session_id");

  useEffect(() => {
    const userId = localStorage.getItem("studentId");

    if (!sessionId || !userId) {
      toast.error("Missing session or user.");
      router.replace("/dashboard/student");
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 5 : prev));
    }, 300);

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/student/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            userId,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Verification failed");

        setProgress(100);
        showSuccessMessage("Premium features activated!");

        setTimeout(() => {
          router.replace("/dashboard/student");
        }, 1000);
      } catch (err) {
        showErrorMessage("Payment verification failed.");
        router.replace("/dashboard/student");
      } finally {
        clearInterval(interval);
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  const isCompleted = progress >= 100;

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] top-[18%] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-6 text-center shadow-2xl shadow-black/45 backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-cyan-400/8" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.05] shadow-2xl shadow-violet-950/35">
            {isCompleted ? (
              <CheckCircle2 className="h-10 w-10 text-emerald-300" />
            ) : (
              <Crown className="h-10 w-10 text-violet-200" />
            )}
          </div>

          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Activation
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {isCompleted
              ? "Premium Activated"
              : "Activating Premium Features"}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            Please wait while we verify your payment and unlock your premium
            tools for Classify AI.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-300">
                Verification Progress
              </span>

              <span className="font-extrabold text-violet-200">
                {progress}%
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-300 shadow-lg shadow-violet-950/40 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
              {!isCompleted && (
                <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
              )}
              {isCompleted
                ? "Redirecting to your dashboard..."
                : "Confirming your subscription..."}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}