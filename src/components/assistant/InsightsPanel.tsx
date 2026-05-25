"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  Lightbulb,
  Loader2,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

const InsightsPanel = () => {
  const [data, setData] = useState<{ risks: string[]; insights: string[] }>({
    risks: [],
    insights: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch(`/api/assistant/event/insights`);
        const json = await res.json();

        if (json.success) {
          setData({ risks: json.risks, insights: json.insights });
        }
      } catch (error) {
        console.error("Failed to fetch event insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const panelVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  if (loading) {
    return (
      <div className="grid min-h-[220px] place-items-center text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10">
            <Loader2 className="h-7 w-7 animate-spin text-violet-200" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            Loading event intelligence...
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Checking planning risks and assistant suggestions.
          </p>
        </div>
      </div>
    );
  }

  const panels = [
    {
      title: "Planning Risk Assessment",
      subtitle: "Potential issues in event scheduling",
      items: data.risks,
      emptyText: "No significant risks detected",
      emptyIcon: <ShieldCheck className="h-4 w-4" />,
      icon: <TriangleAlert className="h-5 w-5" />,
      badge: "Risk Scan",
      tone: "red",
      shell: "from-red-500/10 via-transparent to-violet-500/6",
      badgeClass: "border-red-300/20 bg-red-500/10 text-red-300",
    },
    {
      title: "Intelligent Suggestions",
      subtitle: "Smart recommendations for better planning",
      items: data.insights,
      emptyText: "All good — no suggestions at this time",
      emptyIcon: <CheckCheck className="h-4 w-4" />,
      icon: <Lightbulb className="h-5 w-5" />,
      badge: "AI Insights",
      tone: "cyan",
      shell: "from-cyan-500/10 via-transparent to-violet-500/6",
      badgeClass: "border-cyan-300/20 bg-cyan-500/10 text-cyan-200",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2"
    >
      {panels.map((panel) => (
        <motion.section
          key={panel.title}
          variants={panelVariants}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-violet-300/30 hover:bg-white/[0.055]"
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${panel.shell} opacity-80 transition duration-300 group-hover:opacity-100`}
          />

          <div className="relative z-10 flex h-full min-h-0 flex-col">
            <div className="mb-4 shrink-0">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ${panel.badgeClass}`}
              >
                {panel.icon}
                {panel.badge}
              </span>

              <h2 className="mt-3 text-lg font-extrabold tracking-tight text-white">
                {panel.title}
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {panel.subtitle}
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide">
              <AnimatePresence mode="wait">
                {panel.items.length > 0 ? (
                  <motion.ul
                    key="items"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2.5"
                  >
                    {panel.items.map((item, index) => (
                      <motion.li
                        key={`${panel.title}-${index}`}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={itemVariants}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#14141B]/70 px-3 py-3 text-sm leading-6 text-slate-300"
                      >
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            panel.tone === "red"
                              ? "bg-red-300"
                              : "bg-cyan-200"
                          }`}
                        />

                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="grid min-h-[140px] place-items-center rounded-[1.35rem] border border-dashed border-white/10 bg-white/[0.03] p-4 text-center"
                  >
                    <div>
                      <div
                        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border ${panel.badgeClass}`}
                      >
                        {panel.emptyIcon}
                      </div>

                      <p className="mt-3 text-sm font-extrabold text-slate-300">
                        {panel.emptyText}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
};

export default InsightsPanel;