"use client";

import { useEffect, useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendarDays,
  faCrown,
  faGear,
  faArrowRightFromBracket,
  faChartSimple,
  faBullhorn,
  faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

// --- NAVIGATION LINKS ---
const links = [
  { href: "/dashboard/assistant", icon: faChartSimple, label: "Dashboard" },
  { href: "/dashboard/assistant/users", icon: faUsers, label: "Manage Users" },
  {
    href: "/dashboard/assistant/events",
    icon: faCalendarDays,
    label: "Events",
  },
  { href: "/dashboard/assistant/premium", icon: faCrown, label: "Premium" },
  {
    href: "/dashboard/assistant/announcements",
    icon: faBullhorn,
    label: "Announcements",
  },
  { href: "/dashboard/assistant/settings", icon: faGear, label: "Settings" },
  {
    href: "/dashboard/assistant/support-center",
    icon: faHandshakeAngle,
    label: "Support Center",
  },
  {
    href: "/dashboard/assistant/logout",
    icon: faArrowRightFromBracket,
    label: "Logout",
  },
];

const AssistantSidebar = () => {
  const [pathname, setPathname] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-3 text-slate-300 shadow-2xl shadow-black/25 backdrop-blur-2xl lg:min-h-[calc(100vh-10rem)] lg:p-4"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 flex min-w-0 flex-row items-center gap-3 lg:flex-col lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.25 }}
          className="hidden rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 px-4 py-4 text-center lg:block"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-violet-200/70">
            Classify AI
          </p>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight text-white">
            Assistant Panel
          </h1>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Control center
          </p>
        </motion.div>

        <nav className="relative flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-hide lg:mt-5 lg:flex-col lg:items-stretch lg:overflow-visible">
          {links.map((link, index) => {
            const isActive = pathname === link.href;

            return (
              <div
                key={link.href}
                className="relative shrink-0 lg:w-full"
                onMouseEnter={() => setHovered(link.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <a
                  href={link.href}
                  className={`group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border text-lg transition duration-300 lg:h-auto lg:w-full lg:justify-start lg:gap-3 lg:px-4 lg:py-3 ${
                    isActive
                      ? "border-violet-300/35 bg-violet-500/15 text-violet-100 shadow-xl shadow-violet-950/20"
                      : "border-white/10 bg-white/[0.035] text-slate-500 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-500/10 hover:text-violet-100"
                  }`}
                >
                  <span
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 transition duration-300 ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                    <FontAwesomeIcon icon={link.icon} />
                  </span>

                  <span className="relative z-10 hidden min-w-0 truncate text-sm font-extrabold lg:block">
                    {link.label}
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="assistant-sidebar-active"
                      className="absolute inset-y-2 left-0 hidden w-1 rounded-r-full bg-gradient-to-b from-violet-400 to-fuchsia-400 lg:block"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  )}
                </a>

                <AnimatePresence>
                  {hovered === link.label && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: 4 }}
                      transition={{ duration: 0.18 }}
                      className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max -translate-x-1/2 rounded-2xl border border-white/10 bg-[#14141B]/95 px-3 py-2 text-xs font-extrabold text-violet-100 shadow-2xl shadow-black/35 backdrop-blur-2xl lg:hidden"
                    >
                      {link.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
};

export default AssistantSidebar;
