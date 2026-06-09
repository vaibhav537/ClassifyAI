"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Building2 } from "lucide-react";
import { createPortal } from "react-dom";

const Logo = () => {
  const [assistantName, setAssistantName] = useState("");
  const [campusName, setCampusName] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const chipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAssistantProfile = async () => {
      try {
        const assistantId = localStorage.getItem("assistantId");
        const campusId = localStorage.getItem("CampusID");

        const query = assistantId
          ? `assistantId=${assistantId}`
          : campusId
            ? `campusId=${campusId}`
            : "";

        if (!query) return;

        const res = await fetch(`/api/assistant/profile?${query}`);
        const data = await res.json();

        if (data.success) {
          setAssistantName(data.assistant?.name || "");
          setCampusName(data.assistant?.campus?.name || "");
        }
      } catch (error) {
        console.error("Failed to fetch assistant profile:", error);
      }
    };

    fetchAssistantProfile();
  }, []);

  const displayName = campusName || assistantName || "Assistant";

  const openTooltip = () => {
    if (!chipRef.current) return;

    const rect = chipRef.current.getBoundingClientRect();

    setTooltipPos({
      top: rect.bottom + 10,
      left: rect.left,
    });

    setShowTooltip(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden"
      >
        <motion.div
          initial={{ rotate: -8, scale: 0.92 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-black/25 transition duration-300 group-hover:border-violet-300/40 group-hover:bg-violet-500/20"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-400/10" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-violet-400/20 blur-xl" />

          <Image
            src="/only-logo.png"
            width={48}
            height={48}
            className="relative z-10 h-8 w-auto object-contain"
            alt="Classify AI Logo"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.25, ease: "easeOut" }}
          className="group flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden"
        >
          <div
            ref={chipRef}
            onMouseEnter={openTooltip}
            onMouseLeave={() => setShowTooltip(false)}
            className="flex w-full max-w-full cursor-default items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 shadow-lg shadow-black/10 backdrop-blur-xl transition duration-300 group-hover:border-violet-300/25 group-hover:bg-violet-500/10"
          >
            <Building2 className="h-4 w-4 shrink-0 text-violet-300" />

            <p className="block min-w-0 flex-1 overflow-hidden truncate whitespace-nowrap text-sm font-extrabold tracking-tight text-white">
              {displayName}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: tooltipPos.top,
                  left: tooltipPos.left,
                }}
                className="z-[99999] w-72 overflow-hidden rounded-2xl border border-violet-300/20 bg-[#14141B]/95 p-3 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-cyan-400/6" />
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />

                <div className="relative z-10 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-500/10">
                    <Building2 className="h-4 w-4 text-violet-200" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200/80">
                      Current Campus
                    </p>

                    <p className="mt-1 whitespace-normal break-words text-sm font-extrabold leading-5 text-white">
                      {displayName}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default Logo;
