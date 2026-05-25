"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const RouteLoader = () => {
  const pathname = usePathname();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    setIsRouteChanging(true);
    const timeout = setTimeout(() => {
      setIsRouteChanging(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return isRouteChanging ? (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/70 backdrop-blur-md">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-300/20 border-t-violet-300" />
            <div className="absolute h-3 w-3 animate-pulse rounded-full bg-fuchsia-300" />
          </div>

          <div className="text-center">
            <p className="text-sm font-extrabold text-white">
              Loading Workspace
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Preparing your next page...
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default RouteLoader;