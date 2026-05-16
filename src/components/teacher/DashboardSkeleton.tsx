export default function DashboardSkeleton() {
  return (
    <div className="relative min-h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

      <div className="relative z-10 flex animate-pulse flex-col gap-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 space-y-4">
              <div className="h-7 w-44 rounded-full bg-white/10" />
              <div className="h-10 w-72 rounded-2xl bg-white/10 sm:w-96" />
              <div className="h-5 w-64 rounded-full bg-white/10 sm:w-[32rem]" />

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="h-10 w-44 rounded-2xl bg-white/10" />
                <div className="h-10 w-32 rounded-2xl bg-white/10" />
                <div className="h-10 w-40 rounded-2xl bg-white/10" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-12 w-40 rounded-2xl bg-white/10" />
              <div className="h-12 w-44 rounded-2xl bg-white/10" />
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/10" />

                <div className="space-y-3">
                  <div className="h-3 w-32 rounded-full bg-white/10" />
                  <div className="h-7 w-16 rounded-xl bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
          <div className="min-w-0 space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded-full bg-white/10" />
                  <div className="h-3 w-52 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-28 rounded-[1.5rem] bg-white/10" />
                <div className="h-28 rounded-[1.5rem] bg-white/10" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded-full bg-white/10" />
                  <div className="h-3 w-56 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="grid gap-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-16 rounded-[1.25rem] bg-white/10"
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="min-w-0">
            <div className="rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded-full bg-white/10" />
                  <div className="h-3 w-48 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="space-y-3">
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 rounded-[1.5rem] bg-white/10"
                  />
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-48 rounded-full bg-white/10" />
              <div className="h-3 w-64 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="h-24 rounded-[1.5rem] bg-white/10" />
        </section>
      </div>
    </div>
  );
}