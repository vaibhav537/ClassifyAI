"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const defaultCampus = {
  name: "CLASSIFYAI",
  logoUrl: "/only-logo.png",
  hindiName: "AI Smart Attendance & Analytics System and Campus Community App",
};

export default function Home() {
  const [campusData, setCampusData] = useState(defaultCampus);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampusBranding = async () => {
      const savedSlug = localStorage.getItem("lastCampusSlug");

      if (savedSlug) {
        try {
          const response = await fetch(`/api/campus/${savedSlug}`);

          if (response.ok) {
            const data = await response.json();

            setCampusData({
              name: data.name,
              logoUrl: data.logoUrl || defaultCampus.logoUrl,
              hindiName: data.hindiName || defaultCampus.hindiName,
            });
          }
        } catch (error) {
          console.error("Failed to fetch campus data:", error);
        }
      }

      setIsLoading(false);
    };

    loadCampusBranding();
  }, []);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#08080C]">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
      </div>
    );
  }

  const isDefaultBrand = campusData.name.toUpperCase() === "CLASSIFYAI";

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 app-shell-bg" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[16%] -z-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="w-full max-w-5xl">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          Smart Campus Platform
        </div>

        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#14141B]/80 px-6 py-8 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:px-10 sm:py-12">
          <div className="mx-auto mb-7 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-violet-950/30 sm:h-32 sm:w-32">
            <Image
              src={campusData.logoUrl}
              alt={`${campusData.name} Logo`}
              width={150}
              height={150}
              priority
              className="h-full w-full object-contain drop-shadow-[0_0_28px_rgba(34,211,238,0.20)]"
            />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            {isDefaultBrand ? (
              <span>
                CLASSIFY
                <span className="text-brand-gradient">AI</span>
              </span>
            ) : (
              campusData.name.toUpperCase()
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {campusData.hindiName}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left">
              <GraduationCap className="mb-2 h-5 w-5 text-violet-300" />
              <p className="text-sm font-semibold text-white">Attendance</p>
              <p className="mt-1 text-xs text-slate-400">Smart tracking</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left">
              <Sparkles className="mb-2 h-5 w-5 text-fuchsia-300" />
              <p className="text-sm font-semibold text-white">AI Tools</p>
              <p className="mt-1 text-xs text-slate-400">Study assistance</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left">
              <ShieldCheck className="mb-2 h-5 w-5 text-cyan-300" />
              <p className="text-sm font-semibold text-white">Secure</p>
              <p className="mt-1 text-xs text-slate-400">Campus ready</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/auth/login"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-8 text-sm font-bold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 sm:h-14 sm:px-10 sm:text-base"
            >
              Continue to Login
              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-xs leading-6 text-slate-500">
          Built for modern campuses with attendance, exams, analytics, resources
          and AI-powered learning workflows.
        </p>
      </div>
    </section>
  );
}