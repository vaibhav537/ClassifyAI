"use client";

import { useRouter } from "next/navigation";
import React, { use } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: campusId } = use(params);

  const { data: dashboard, isLoading: loadingDashboard } = useSWR(
    `/api/admin/campus/dashboard?id=${campusId}`,
    fetcher,
  );

  const { data: campus } = useSWR(`/api/admin/campus?id=${campusId}`, fetcher);

  const { data: students } = useSWR(
    `/api/admin/campus/student?campusId=${campusId}`,
    fetcher,
  );

  const { data: teachers } = useSWR(
    `/api/admin/campus/teacher?campusId=${campusId}`,
    fetcher,
  );

  const { data: subjects } = useSWR(
    `/api/admin/campus/subject?campusId=${campusId}`,
    fetcher,
  );

  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08080C] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

      <main className="relative z-10 flex flex-col gap-6 p-4 sm:p-6 md:p-10">
        <button
          onClick={() => router.push("/dashboard/admin")}
          className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-extrabold text-slate-200 shadow-xl shadow-black/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-white/[0.08] hover:text-white"
        >
          ← Back
        </button>

        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/25 sm:h-28 sm:w-28">
                <img
                  src={campus?.logoUrl || "/default-campus-logo.png"}
                  alt="Campus Logo"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/default-campus-logo.png";
                  }}
                />
              </div>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  Campus Command
                </div>

                <h1 className="truncate text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {campus?.name || "Campus Dashboard"}
                </h1>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
                  {campus?.hindiName || ""}
                </p>
              </div>
            </div>

            <button className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30">
              Edit Campus
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {loadingDashboard ? (
            <>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
                >
                  <div className="h-4 w-24 rounded-full bg-white/10" />
                  <div className="mt-4 h-9 w-16 rounded-full bg-white/10" />
                  <div className="mt-3 h-4 w-32 rounded-full bg-white/10" />
                </div>
              ))}
            </>
          ) : (
            [
              { title: "Students", value: students?.length || 0 },
              { title: "Teachers", value: teachers?.length || 0 },
              { title: "Subjects", value: subjects?.length || 0 },
            ].map((card, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                <div className="relative z-10">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                    {card.title}
                  </p>
                  <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white">
                    {card.value}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Total active {card.title.toLowerCase()} in this campus.
                  </p>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-violet-300/20 bg-violet-500/10 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/45 hover:bg-violet-500/20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10">
              <h3 className="text-lg font-extrabold text-violet-100">
                Manage Students
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                Total: {students?.length || 0}
              </p>
            </div>
          </div>

          <div className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-emerald-300/20 bg-emerald-500/10 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/45 hover:bg-emerald-500/20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-400/5" />

            <div className="relative z-10">
              <h3 className="text-lg font-extrabold text-emerald-200">
                Manage Teachers
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                Total: {teachers?.length || 0}
              </p>
            </div>
          </div>

          <div className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-amber-300/20 bg-amber-500/10 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-amber-300/45 hover:bg-amber-500/20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-violet-400/5" />

            <div className="relative z-10">
              <h3 className="text-lg font-extrabold text-amber-200">
                Subjects
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                Total: {subjects?.length || 0}
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-400/5" />

          <div className="relative z-10">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-200">
                  Live Audit Feed
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-white">
                  Recent Activity
                </h3>
              </div>
            </div>

            {dashboard?.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentActivity.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-3 text-sm leading-6 text-slate-300 transition hover:bg-white/[0.045]"
                  >
                    <span className="font-extrabold text-violet-200">
                      {item.userName || "User"}
                    </span>{" "}
                    - {item.action}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-5 text-sm font-semibold text-slate-400">
                No recent activity yet...
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;