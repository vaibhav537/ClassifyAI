"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown, Search, Sparkles, XCircle } from "lucide-react";

const SearchFilterBar = ({
  onSearch,
  onFilter,
  currentFilter,
}: {
  onSearch: (term: string) => void;
  onFilter: (plan: string) => void;
  currentFilter: string;
}) => {
  const filters = [
    {
      label: "All",
      icon: <Sparkles className="h-3.5 w-3.5" />,
      activeClass: "border-violet-300/35 bg-violet-500/20 text-violet-100",
      hoverClass:
        "hover:border-violet-300/30 hover:bg-violet-500/10 hover:text-violet-100",
    },
    {
      label: "Pro",
      icon: <Crown className="h-3.5 w-3.5" />,
      activeClass: "border-cyan-300/35 bg-cyan-500/20 text-cyan-100",
      hoverClass:
        "hover:border-cyan-300/30 hover:bg-cyan-500/10 hover:text-cyan-100",
    },
    {
      label: "Ultimate",
      icon: <Crown className="h-3.5 w-3.5" />,
      activeClass: "border-fuchsia-300/35 bg-fuchsia-500/20 text-fuchsia-100",
      hoverClass:
        "hover:border-fuchsia-300/30 hover:bg-fuchsia-500/10 hover:text-fuchsia-100",
    },
    {
      label: "Expired",
      icon: <XCircle className="h-3.5 w-3.5" />,
      activeClass: "border-red-300/35 bg-red-500/20 text-red-200",
      hoverClass:
        "hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="relative w-full lg:max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

        <input
          type="text"
          placeholder="Search by name or email..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#08080C]/65 px-4 py-3 pl-11 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:bg-[#08080C]/85"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.label;

          return (
            <motion.button
              key={filter.label}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onFilter(filter.label)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-extrabold transition duration-300 ${
                isActive
                  ? filter.activeClass
                  : `border-white/10 bg-white/[0.04] text-slate-400 ${filter.hoverClass}`
              }`}
            >
              {filter.icon}
              {filter.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SearchFilterBar;