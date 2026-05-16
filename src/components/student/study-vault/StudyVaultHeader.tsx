"use client";

import { BookOpen, Search } from "lucide-react";

export default function StudyVaultHeader({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
          <BookOpen className="h-3.5 w-3.5" />
          Smart Learning Hub
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Study Vault
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Search notes, PYQs, videos and shared academic resources.
        </p>
      </div>

      <div className="relative w-full md:max-w-sm">
        <Search
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes, PYQs..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 pl-11 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
        />
      </div>
    </div>
  );
}