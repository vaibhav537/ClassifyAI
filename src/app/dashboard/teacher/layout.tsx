import Sidebar from "@/components/teacher/Sidebar";
import Image from "next/image";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen overflow-hidden bg-[#08080C] text-white">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 flex h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-[#14141B]/70 px-5 shadow-xl shadow-black/20 backdrop-blur-2xl lg:px-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                Teacher Workspace
              </div>

              <h1 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Mentor Desk
              </h1>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-200">
                Active Session
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045]">
                <Image
                  src="/only-logo.png"
                  alt="Classify AI"
                  width={34}
                  height={34}
                  className="h-8 w-8 object-contain"
                  priority
                />
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1800px] p-4 sm:p-5 lg:p-6">
              <div className="min-h-[calc(100vh-8rem)] rounded-[2rem] border border-white/10 bg-[#14141B]/75 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-5 lg:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}