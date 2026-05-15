"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ArrowRight, Crown, Sparkles, CheckCircle2 } from "lucide-react";

type PremiumStatusResponse = {
  isPremium: boolean;
  plan: "Starter" | "Pro" | "Ultimate" | null;
  features: string[];
};

const PremiumFeaturesCard = ({
  studentId,
  CampusId,
}: {
  studentId: string;
  CampusId: string;
}) => {
  const router = useRouter();
  const [premiumStatus, setPremiumStatus] =
    useState<PremiumStatusResponse | null>(null);

  const fetchPremiumStatus = async () => {
    try {
      const res = await fetch(
        `/api/student/status?studentId=${studentId}&campusId=${CampusId}`,
      );
      const data: PremiumStatusResponse = await res.json();
      setPremiumStatus(data);
    } catch (error) {
      console.error("Error fetching premium status:", error);
    }
  };

  useEffect(() => {
    fetchPremiumStatus();
  }, []);

  const planLabel = premiumStatus?.plan || "Premium";

  const planBadgeClass =
    premiumStatus?.plan === "Ultimate"
      ? "border-amber-300/25 bg-amber-400/10 text-amber-200"
      : premiumStatus?.plan === "Pro"
        ? "border-violet-300/25 bg-violet-500/10 text-violet-200"
        : "border-cyan-300/25 bg-cyan-400/10 text-cyan-200";

  const planGlowClass =
    premiumStatus?.plan === "Ultimate"
      ? "from-amber-400/18 via-yellow-500/8 to-violet-500/10"
      : premiumStatus?.plan === "Pro"
        ? "from-violet-500/20 via-fuchsia-500/10 to-cyan-400/8"
        : "from-cyan-400/14 via-violet-500/10 to-fuchsia-500/8";

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/90 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${planGlowClass}`}
      />
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg shadow-black/20">
              <Crown className="h-6 w-6 text-violet-200" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Premium Access
              </p>

              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-white">
                {premiumStatus?.isPremium
                  ? `${planLabel} Plan Active`
                  : "Unlock Premium"}
              </h2>
            </div>
          </div>

          {premiumStatus?.isPremium && (
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] ${planBadgeClass}`}
            >
              {planLabel}
            </span>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="mb-4 flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <Image
                src="/logo-nobg.png"
                alt="Classify AI"
                width={180}
                height={64}
                className="h-auto w-full max-w-[180px] object-contain drop-shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                priority
              />
            </div>

            <p className="text-sm leading-6 text-slate-400">
              {premiumStatus?.isPremium
                ? "Your premium tools are enabled for smarter attendance, planning and AI-powered study workflows."
                : "Upgrade your workspace to access smarter study tools, advanced insights and premium features."}
            </p>

            {!premiumStatus?.isPremium && (
              <button
                onClick={() => router.push("/dashboard/student/premium")}
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
              >
                Upgrade Now
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </div>

          <div className="min-w-0">
            {premiumStatus?.isPremium ? (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-300" />
                  <p className="text-sm font-bold text-white">
                    Enabled Features
                  </p>
                </div>

                <ul className="max-h-44 space-y-2 overflow-y-auto pr-1">
                  {premiumStatus.features.map((feature) => (
                    <li
                      className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-medium text-slate-300"
                      key={feature}
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <span className="capitalize">
                        {feature.replaceAll("_", " ").toLowerCase()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center">
                <Image
                  src="/books.png"
                  alt="Premium learning tools"
                  width={120}
                  height={120}
                  className="h-24 w-24 object-contain opacity-90"
                />

                <p className="mt-4 text-sm font-bold text-white">
                  Premium tools waiting
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Unlock advanced student features and AI assistance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeaturesCard;