"use client";

import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";
import {
  ArrowRight,
  AtSign,
  GraduationCap,
  LockKeyhole,
  Sparkles,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const defaultCampus = {
  name: "CLASSIFY AI",
  logoUrl: "/only-logo.png",
  hindiName: "AI Smart Attendance & Analytics System and Campus Community App",
};

const Page = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [campusData, setCampusData] = useState(defaultCampus);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleLogin = async () => {
    showLoadingMessage("Verifying Credentials...");

    if (!email || !name) {
      showErrorMessage("Please fill in both fields");
      return;
    }
    const payload = JSON.stringify({ email, name });
    console.log("LOGIN PAYLOAD BEFORE FETCH:", payload);
    console.log("LOGIN PAYLOAD LENGTH:", payload.length);
    const res = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("sessionToken", data.sessionToken);
      localStorage.setItem(`${data.user.role.toLowerCase()}Id`, data.user.id);
      localStorage.setItem("CampusID", data.user.campusId || "");
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userId", data.user.id);
      showSuccessMessage("Login Successful");
      router.push(`/dashboard/${data.user.role.toLowerCase()}`);
    } else {
      showErrorMessage(data.message || "Login Failed!");
    }
  };

  useEffect(() => {
    const loadCampusBranding = async () => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }

          return prev + Math.floor(Math.random() * 5) + 2;
        });
      }, 150);

      const campusID = localStorage.getItem("CampusID");

      if (campusID) {
        try {
          const response = await fetch(
            `/api/campus/details?campusID=${campusID}`,
          );

          if (response.ok) {
            const data = await response.json();

            if (data && data.length > 0) {
              const info = data[0];

              setCampusData({
                name: info.name || defaultCampus.name,
                logoUrl: info.logoUrl || defaultCampus.logoUrl,
                hindiName: info.hindiName || defaultCampus.hindiName,
              });
            } else {
              console.warn("No campus data found, using default branding.");
            }
          }
        } catch (error) {
          console.error("Failed to fetch campus data:", error);
        }
      }

      setProgress(100);

      setTimeout(() => {
        setIsLoading(false);
      }, 250);
    };

    loadCampusBranding();
  }, []);

  if (isLoading) {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08080C] px-4 text-white">
        <div className="pointer-events-none absolute inset-0 app-shell-bg" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 144 144"
            >
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="url(#loginLoaderGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 62}`}
                strokeDashoffset={`${
                  2 * Math.PI * 62 - (progress / 100) * (2 * Math.PI * 62)
                }`}
              />

              <defs>
                <linearGradient
                  id="loginLoaderGradient"
                  x1="0"
                  y1="0"
                  x2="144"
                  y2="144"
                >
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="55%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>

            <Image
              src="/only-logo.png"
              alt="Classify AI"
              width={72}
              height={72}
              priority
              className="h-16 w-16 object-contain drop-shadow-[0_0_28px_rgba(34,211,238,0.24)]"
            />
          </div>

          <p className="mt-7 text-lg font-bold tracking-tight text-white">
            Loading Campus Details
          </p>
          <p className="mt-2 text-sm font-medium text-slate-400">
            Preparing your workspace · {Math.min(progress, 100)}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative isolate grid min-h-screen overflow-hidden bg-[#08080C] px-4 py-8 text-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="pointer-events-none absolute inset-0 -z-10 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 -z-10 h-80 w-80 rounded-full bg-violet-500/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-10 -z-10 h-72 w-72 rounded-full bg-cyan-400/8 blur-3xl" />

      <div className="hidden items-center justify-center p-8 lg:flex">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            Smart Campus Workspace
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
            One intelligent platform for{" "}
            <span className="text-brand-gradient">every campus role</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
            Classify AI connects admins, campus assistants, teachers and
            students through attendance, exams, resources, analytics and
            AI-powered learning tools.
          </p>

          <div className="mt-8 grid max-w-lg gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <GraduationCap className="mb-4 h-6 w-6 text-violet-300" />
              <p className="font-bold text-white">For Learning</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Students and teachers get attendance, exams, assignments,
                resources and smart AI assistance.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <LockKeyhole className="mb-4 h-6 w-6 text-cyan-300" />
              <p className="font-bold text-white">For Operations</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Admins and campus assistants manage campus workflows with secure
                role-based access.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-6 shadow-2xl shadow-black/45 backdrop-blur-2xl sm:p-8">
          <div className="mb-8 text-center">
            {campusData.logoUrl && (
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-violet-950/30">
                <Image
                  src={campusData.logoUrl}
                  alt={`${campusData.name} Logo`}
                  width={150}
                  height={150}
                  className="h-full w-full object-contain drop-shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                  priority
                />
              </div>
            )}

            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-300">
              Welcome Back
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
              {campusData.name.toUpperCase()}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
              {campusData.hindiName}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-left">
              <span className="mb-2 block text-sm font-semibold text-slate-300">
                Email Address
              </span>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 transition focus-within:border-violet-400/60 focus-within:ring-4 focus-within:ring-violet-500/15">
                <AtSign className="h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  autoComplete="off"
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </label>

            <label className="block text-left">
              <span className="mb-2 block text-sm font-semibold text-slate-300">
                User Name
              </span>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 transition focus-within:border-violet-400/60 focus-within:ring-4 focus-within:ring-violet-500/15">
                <UserRound className="h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={name}
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </label>

            <button
              onClick={handleLogin}
              className="group mt-2 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
            >
              Login to Workspace
              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Login is available for admins, campus assistants, teachers and
            students using their registered credentials.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Page;
