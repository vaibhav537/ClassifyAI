"use client";

import { useState } from "react";
import CreateAssistantDialog from "@/components/admin/CreateAssistantDialog";
import CampusList from "@/components/admin/CampusList";
import { mutate } from "swr";

export default function SuperAdminDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActionComplete = () => {
    mutate("/api/campus");
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#08080C] p-4 text-white sm:p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6">
          <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  Super Admin Console
                </div>

                <h1
                  className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
                >
                  Admin Dashboard
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Manage colleges, onboard campus assistants, and control
                  platform-wide administrative access from one secure workspace.
                </p>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("adminId");
                  localStorage.clear();
                  window.location.href = "/auth/login";
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-extrabold text-red-200 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20"
              >
                ⎋ Logout
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055] sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-extrabold text-emerald-300">
                    New Campus Setup
                  </div>

                  <h2 className="text-2xl font-extrabold tracking-tight text-white">
                    Onboard a New College
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Create the first administrator account for a new college.
                    This account will be assigned the{" "}
                    <span className="font-extrabold text-violet-200">
                      'ASSISTANT'
                    </span>{" "}
                    role.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                    Assistant Access
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    The created assistant will manage the college workspace,
                    campus data, and institution-level controls.
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                >
                  + Create New Assistant
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-400/5" />

              <div className="relative z-10 flex h-full flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-extrabold text-cyan-200">
                      Campus Registry
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight text-white">
                      Manage Campuses
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                      View, edit, or remove existing campuses linked to the
                      platform.
                    </p>
                  </div>
                </div>

                <div className="min-h-[420px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08080C]/55 p-4 shadow-2xl shadow-black/20">
                  <CampusList />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <CreateAssistantDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onActionComplete={handleActionComplete}
      />
    </>
  );
}
