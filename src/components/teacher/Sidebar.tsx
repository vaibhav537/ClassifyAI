"use client";

import { teacherNavLinks } from "@/lib/helper";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    localStorage.removeItem("studentId");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("adminId");
    localStorage.removeItem("assistantId");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("lastCampusSlug");

    router.push("/auth/login");
  };

  return (
    <aside className="hidden h-screen w-[280px] shrink-0 border-r border-white/10 bg-[#101014]/85 shadow-2xl shadow-black/35 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <Image
              src="/only-logo.png"
              alt="Classify AI"
              width={34}
              height={34}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-white">
              Classify AI
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Mentor Desk
            </p>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-5">
        {teacherNavLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-sm font-bold transition duration-300 ${
                isActive
                  ? "border-violet-300/35 bg-violet-500/20 text-violet-100 shadow-lg shadow-violet-950/25"
                  : "border-transparent text-slate-400 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.055] hover:text-white"
              }`}
            >
              <span
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-fuchsia-500/6 to-cyan-400/5 transition ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              />

              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition ${
                  isActive
                    ? "border-violet-300/30 bg-violet-500/20"
                    : "border-white/10 bg-white/[0.04] group-hover:border-violet-300/25 group-hover:bg-violet-500/10"
                }`}
              >
                <Icon size={20} />
              </span>

              <span className="relative z-10 truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-extrabold text-red-100 transition duration-300 hover:-translate-y-0.5 hover:border-red-300/45 hover:bg-red-500/20"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
            <LogOut className="h-5 w-5 text-red-200 transition group-hover:translate-x-0.5" />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}