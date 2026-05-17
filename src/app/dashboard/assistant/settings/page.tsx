"use client";

import React, { useState } from "react";
import { SECTIONS } from "@/lib/helper";
import { AnimatePresence, motion } from "framer-motion";
import ChangeEmailSection from "@/components/assistant/settings/ChangeEmailSection";
import ContactRequestsSection from "@/components/assistant/settings/ContactRequestsSection";
import ManageLogsSection from "@/components/assistant/settings/ManageLogsSection";
import ManagePlansSection from "@/components/assistant/settings/ManagePlansSection";
import ExportLogsSection from "@/components/assistant/settings/ExportLogsSection";
import {
  Download,
  FileClock,
  Mail,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const sectionIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  contact: <MessageCircle className="h-4 w-4" />,
  logs: <FileClock className="h-4 w-4" />,
  plans: <ShieldCheck className="h-4 w-4" />,
  export: <Download className="h-4 w-4" />,
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("email");

  const activeLabel =
    SECTIONS.find((section) => section.key === activeSection)?.label ||
    "Settings";

  return (
    <motion.div
      className="relative flex min-h-full flex-col gap-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
              <Settings className="h-3.5 w-3.5" />
              Assistant Settings
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Settings Center
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage assistant account settings, contact requests, logs, plans,
              and exports from one control panel.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-cyan-300/20 bg-cyan-500/10 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-100/70">
                Active Section
              </p>
              <p className="text-sm font-extrabold text-cyan-100">
                {activeLabel}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        <div className="relative z-10">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-fuchsia-200">
              <Sparkles className="h-3.5 w-3.5" />
              Settings Navigation
            </span>

            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
              Choose Settings Area
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Switch between assistant settings modules without leaving the
              page.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`group relative overflow-hidden rounded-[1.5rem] border px-4 py-4 text-left transition duration-300 ${
                    isActive
                      ? "border-violet-300/35 bg-violet-500/20 text-violet-100 shadow-xl shadow-violet-950/20"
                      : "border-white/10 bg-white/[0.04] text-slate-400 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-500/10 hover:text-violet-100"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="relative z-10 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                        isActive
                          ? "border-violet-300/25 bg-violet-500/20 text-violet-100"
                          : "border-white/10 bg-white/[0.04] text-slate-500 group-hover:border-violet-300/25 group-hover:bg-violet-500/10 group-hover:text-violet-100"
                      }`}
                    >
                      {sectionIcons[section.key] || (
                        <Settings className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold">
                        {section.label}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                        {isActive ? "Selected" : "Open"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3, ease: "easeOut" }}
        className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-400/5" />

        <div className="relative z-10 mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
            {sectionIcons[activeSection] || (
              <Settings className="h-3.5 w-3.5" />
            )}
            {activeLabel}
          </span>

          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
            {activeLabel}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Update and review this settings module below.
          </p>
        </div>

        <div className="relative z-10 min-h-0">
          <AnimatePresence mode="wait">
            {activeSection === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ChangeEmailSection />
              </motion.div>
            )}

            {activeSection === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ContactRequestsSection />
              </motion.div>
            )}

            {activeSection === "logs" && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ManageLogsSection />
              </motion.div>
            )}

            {activeSection === "plans" && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ManagePlansSection />
              </motion.div>
            )}

            {activeSection === "export" && (
              <motion.div
                key="export"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ExportLogsSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default SettingsPage;
