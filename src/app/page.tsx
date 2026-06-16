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
      <div className="grid min-h-dvh place-items-center bg-[#08080C] px-4">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-transparent" />
          <div className="relative h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-fuchsia-400" />
        </div>
      </div>
    );
  }

  const isDefaultBrand = campusData.name.toUpperCase() === "CLASSIFYAI";

  return (
    <section className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-[#08080C] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] text-center sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 app-shell-bg" />

      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px] sm:top-1/2 sm:h-[34rem] sm:w-[34rem] sm:-translate-y-1/2" />
      <div className="pointer-events-none absolute -right-28 top-1/3 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[110px] sm:right-[10%] sm:top-[16%]" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="w-full max-w-5xl">
        <div className="mx-auto mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:mb-6 sm:px-4 sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-fuchsia-300" />
          <span className="truncate">Smart Campus Platform</span>
        </div>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:rounded-[2.25rem]">
          <div className="relative px-5 py-7 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-transparent blur-3xl" />

            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-3.5 shadow-2xl shadow-black/30 sm:mb-7 sm:h-32 sm:w-32 sm:rounded-[2rem] sm:p-4">
              <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-white/[0.08] via-transparent to-violet-500/10 sm:rounded-[2rem]" />
              <Image
                src={campusData.logoUrl}
                alt={`${campusData.name} Logo`}
                width={150}
                height={150}
                priority
                className="relative h-full w-full object-contain drop-shadow-[0_0_28px_rgba(217,70,239,0.18)]"
              />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              {isDefaultBrand ? (
                <span>
                  CLASSIFY
                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
                    AI
                  </span>
                </span>
              ) : (
                campusData.name.toUpperCase()
              )}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:mt-5 sm:text-base">
              {campusData.hindiName}
            </p>

            <div className="mt-7 grid gap-3 text-left sm:mt-8 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/20 transition duration-300 hover:bg-white/[0.06] sm:rounded-2xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10">
                  <GraduationCap className="h-5 w-5 text-violet-300" />
                </div>
                <p className="text-sm font-bold text-white">Attendance</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Smart tracking for modern classrooms.
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/20 transition duration-300 hover:bg-white/[0.06] sm:rounded-2xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500/10">
                  <Sparkles className="h-5 w-5 text-fuchsia-300" />
                </div>
                <p className="text-sm font-bold text-white">AI Tools</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Study assistance and smarter workflows.
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/20 transition duration-300 hover:bg-white/[0.06] sm:rounded-2xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10">
                  <ShieldCheck className="h-5 w-5 text-violet-200" />
                </div>
                <p className="text-sm font-bold text-white">Secure</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Campus-ready login and role access.
                </p>
              </div>
            </div>

            <div className="mt-7 sm:mt-8">
              <Link
                href="/auth/login"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-6 text-sm font-bold text-white shadow-xl shadow-violet-950/40 transition duration-300 active:scale-[0.98] sm:h-14 sm:w-auto sm:px-10 sm:text-base sm:hover:-translate-y-0.5 sm:hover:shadow-violet-800/30"
              >
                Continue to Login
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-xl px-2 text-xs leading-6 text-slate-500 sm:mt-6">
          Built for modern campuses with attendance, exams, analytics, resources
          and AI-powered learning workflows.
        </p>
      </div>
    </section>
  );
}