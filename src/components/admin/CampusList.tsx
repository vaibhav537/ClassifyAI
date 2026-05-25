"use client";

import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
type Campus = {
  id: string;
  name: string;
  city: string;
  logoUrl?: string | null;
};

export default function CampusList() {
  const {
    data: campuses,
    error,
    isLoading,
  } = useSWR<Campus[]>("/api/campus", fetcher);

  if (isLoading) {
    return (
      <div className="grid min-h-[260px] place-items-center text-center">
        <div>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-300/20 border-t-violet-300" />
          <p className="mt-4 text-sm font-bold text-slate-400">
            Loading Campuses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-[260px] place-items-center text-center">
        <div className="rounded-[1.5rem] border border-red-300/20 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-300">
          Failed to load campus list.
        </div>
      </div>
    );
  }

  if (!campuses || campuses.length === 0) {
    return (
      <div className="grid min-h-[260px] place-items-center text-center">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
          <div className="relative z-10">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-lg font-extrabold text-violet-200">
              0
            </div>
            <p className="text-sm font-bold text-slate-300">
              No campuses have been created yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-96 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
      {campuses.map((campus) => (
        <div
          key={campus.id}
          className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-xl shadow-black/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-white/[0.055]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-70" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[#08080C]/55">
                <Image
                  src={campus.logoUrl || "/only-logo.png"}
                  alt={`${campus.name} Logo`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-xl object-contain"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate font-extrabold text-white transition group-hover:text-violet-100">
                  {campus.name}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                  {campus.city}
                </p>
              </div>
            </div>
            <Link href={`/dashboard/admin/campuses/${campus.id}`}>
              <div className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-sm font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20">
                Manage
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}