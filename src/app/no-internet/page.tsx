import { Unplug } from "lucide-react";
import React from "react";

const NoInternetPage = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080C] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[1.5rem] border border-red-300/20 bg-red-500/10 shadow-xl shadow-black/25">
            <Unplug size={42} className="text-red-300" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-300">
            Connection Lost
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            No Internet Connection
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
            Please check your network. You’ll be redirected automatically once
            your connection is restored.
          </p>

          <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold text-violet-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-300" />
            Waiting for connection
          </div>
        </div>
      </section>
    </main>
  );
};

export default NoInternetPage;