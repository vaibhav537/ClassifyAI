import { motion } from "framer-motion";

export const AttendanceHistoryLoadingSkeleton = () => (
  <div className="relative min-h-full overflow-hidden text-white">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

    <div className="relative z-10 animate-pulse space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />

        <div className="relative z-10 space-y-4">
          <div className="h-7 w-44 rounded-full bg-white/10" />
          <div className="h-10 w-72 rounded-2xl bg-white/10 sm:w-96" />
          <div className="h-5 w-64 rounded-full bg-white/10 sm:w-[30rem]" />
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl md:grid-cols-2 lg:grid-cols-4">
        <div className="h-12 w-full rounded-2xl bg-white/10" />
        <div className="h-12 w-full rounded-2xl bg-white/10" />
        <div className="hidden h-12 w-full rounded-2xl bg-white/10 lg:block" />
        <div className="hidden h-12 w-full rounded-2xl bg-white/10 lg:block" />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/25 backdrop-blur-2xl">
        <div className="grid grid-cols-4 border-b border-white/10 bg-[#08080C]/45 px-6 py-4">
          <div className="h-4 w-28 rounded-full bg-white/10" />
          <div className="h-4 w-20 rounded-full bg-white/10" />
          <div className="h-4 w-16 rounded-full bg-white/10" />
          <div className="h-4 w-24 rounded-full bg-white/10" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 border-b border-white/10 px-6 py-5"
          >
            <div className="h-4 w-32 rounded-full bg-white/10" />
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="h-6 w-20 rounded-full bg-white/10" />
            <div className="h-4 w-32 rounded-full bg-white/10" />
          </div>
        ))}

        <div className="flex items-center justify-between gap-4 bg-[#08080C]/35 p-5">
          <div className="h-10 w-24 rounded-2xl bg-white/10" />
          <div className="h-4 w-32 rounded-full bg-white/10" />
          <div className="h-10 w-24 rounded-2xl bg-white/10" />
        </div>
      </section>
    </div>
  </div>
);

export const AttendanceHistoryTableLoadingSkeleton = () => (
  <div className="mt-6 animate-pulse overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
    <div className="h-56 w-full rounded-[1.5rem] bg-white/10" />
  </div>
);

export const ClassesLoadingSkeleton = () => (
  <div className="relative min-h-full overflow-hidden text-white">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

    <div className="relative z-10 animate-pulse space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-transparent to-cyan-400/6" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="h-7 w-40 rounded-full bg-white/10" />
            <div className="h-10 w-72 rounded-2xl bg-white/10 sm:w-96" />
            <div className="h-5 w-64 rounded-full bg-white/10 sm:w-[28rem]" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <div className="h-20 rounded-2xl bg-white/10" />
            <div className="h-20 rounded-2xl bg-white/10" />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/10" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 rounded-xl bg-white/10" />
                <div className="h-3 w-24 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-12 w-full rounded-2xl bg-white/10" />
              <div className="h-12 w-full rounded-2xl bg-white/10" />
              <div className="h-12 w-full rounded-2xl bg-white/10" />
            </div>

            <div className="mt-6 h-12 w-full rounded-2xl bg-white/10" />
          </div>
        ))}
      </section>
    </div>
  </div>
);

export const AnnouncementsLoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

        <div className="relative z-10 animate-pulse">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-5 w-44 rounded-full bg-white/10" />
              <div className="h-3 w-32 rounded-full bg-white/10" />
            </div>

            <div className="h-8 w-24 rounded-full bg-white/10" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-white/10" />
            <div className="h-3 w-5/6 rounded-full bg-white/10" />
            <div className="h-3 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);
