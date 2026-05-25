"use client";

import { monthlyPlans, showErrorMessage } from "@/lib/helper";
import { Plan } from "@/lib/types";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Crown,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const yearlyPlans = monthlyPlans.map((plan) => ({
  ...plan,
  price: plan.price === 0 ? 0 : plan.price * 10,
}));

const Page = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchedPlan, setFetchedPlan] = useState<Plan[]>([]);

  const router = useRouter();

  const fetchPlans = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/settings/plans");
      const data = await res.json();

      if (res.ok) {
        setFetchedPlan(data.plans);
      } else {
        showErrorMessage(data.message || "Failed to fetch plans.");
      }
    } catch {
      showErrorMessage("Something went wrong while fetching plans.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (
    planName: string,
    price: number,
    billingCycle: string,
  ) => {
    if (price === 0) {
      showErrorMessage("Price Problem Occurs!");
      router.push("/dashboard/student");
      return;
    }

    const userId = localStorage.getItem("studentId");

    if (!userId) {
      showErrorMessage("Please login again.");
      router.push("/auth/login");
      return;
    }

    const res = await fetch(`/api/student/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        amount: price,
        planName,
        billingCycle,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      showErrorMessage("Failed to create payment session");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const mergedPlans = (isYearly ? yearlyPlans : monthlyPlans).map((plan) => {
    const key = `${
      isYearly ? "YEARLY" : "MONTHLY"
    }_${plan.title.toUpperCase()}`;
    const dbPlan = fetchedPlan.find((p) => p.name === key);

    return {
      ...plan,
      price: dbPlan ? dbPlan.price : plan.price,
    };
  });

  if (loading) {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] px-4 text-white">
        <div className="pointer-events-none absolute inset-0 app-shell-bg" />
        <div className="relative z-10 flex flex-col items-center rounded-[2rem] border border-white/10 bg-[#14141B]/85 px-8 py-7 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <Loader2 className="h-9 w-9 animate-spin text-violet-300" />
          <p className="mt-4 text-lg font-extrabold text-white">
            Loading plans
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Preparing premium options...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard/student")}
          className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-slate-200 shadow-lg shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Plans
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Upgrade your{" "}
            <span className="text-brand-gradient">Classify AI</span> workspace
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Choose the plan that fits your academic journey. Unlock advanced
            study tools, smarter planning, attendance insights and AI-powered
            student features.
          </p>

          <div className="mt-7 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-bold transition ${
                !isYearly ? "text-white" : "text-slate-500"
              }`}
            >
              Monthly
            </span>

            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className={`relative h-8 w-16 rounded-full border transition duration-300 ${
                isYearly
                  ? "border-violet-300/35 bg-violet-500/25"
                  : "border-white/10 bg-white/[0.08]"
              }`}
              aria-label="Toggle billing cycle"
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg transition duration-300 ${
                  isYearly ? "left-9" : "left-1"
                }`}
              />
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold transition ${
                  isYearly ? "text-white" : "text-slate-500"
                }`}
              >
                Yearly
              </span>

              <span className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-300">
                Save 2 months
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {mergedPlans.map((plan, index) => {
            const isFree = plan.price === 0;
            const isPopular = Boolean(plan.popular);

            return (
              <div
                key={`${plan.title}-${index}`}
                className={`group relative overflow-hidden rounded-[2rem] border bg-[#14141B]/85 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 ${
                  isPopular
                    ? "border-violet-300/35 shadow-violet-950/25"
                    : "border-white/10 hover:border-violet-300/25"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-fuchsia-500/6 to-cyan-400/6 opacity-80" />
                <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-violet-500/12 blur-3xl" />

                {isPopular && (
                  <div className="absolute right-5 top-5 z-20 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-200">
                    Most Popular
                  </div>
                )}

                <div className="relative z-10 flex min-h-[34rem] flex-col">
                  <div className="mb-6">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg shadow-black/20">
                      {isPopular ? (
                        <Crown className="h-7 w-7 text-amber-200" />
                      ) : (
                        <Sparkles className="h-7 w-7 text-violet-200" />
                      )}
                    </div>

                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-violet-300">
                      {plan.title}
                    </p>

                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-5xl font-extrabold tracking-tight text-white">
                        ₹{plan.price}
                      </span>
                      <span className="pb-2 text-sm font-semibold text-slate-500">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {isFree
                        ? "Start with the basic workspace and explore Classify AI."
                        : "Unlock premium tools designed for smarter student workflows."}
                    </p>
                  </div>

                  <div className="mb-6 h-px bg-white/10" />

                  <ul className="mb-6 space-y-3">
                    {monthlyPlans[0].features
                      .concat(monthlyPlans[0].extra)
                      .map((featureText, i) => {
                        const included = plan.features.includes(featureText);

                        return (
                          <li
                            key={`${featureText}-${i}`}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                included
                                  ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-300"
                                  : "border-red-300/20 bg-red-500/10 text-red-300"
                              }`}
                            >
                              {included ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
                            </span>

                            <span
                              className={
                                included ? "text-slate-300" : "text-slate-600"
                              }
                            >
                              {featureText}
                            </span>
                          </li>
                        );
                      })}
                  </ul>

                  <button
                    type="button"
                    className={`group/button mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold transition duration-300 ${
                      isFree
                        ? "border border-white/10 bg-white/[0.06] text-slate-200 hover:border-violet-300/35 hover:bg-violet-500/15"
                        : "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 text-white shadow-xl shadow-violet-950/40 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                    }`}
                    onClick={() =>
                      handlePayment(
                        plan.title,
                        plan.price,
                        isYearly ? "yearly" : "monthly",
                      )
                    }
                  >
                    {isFree ? "Get Started" : "Choose Plan"}
                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover/button:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Page;