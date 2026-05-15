"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";

const SideButtons = ({
  faIcon,
  title,
  link,
}: {
  faIcon: any;
  title: string;
  link: string;
}) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(link)}
      title={title}
      className="group relative flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#14141B]/85 px-4 py-3 text-left shadow-lg shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-[#1B1B24]/90 hover:shadow-xl hover:shadow-violet-950/20 2xl:min-h-16 2xl:px-3"
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/8 opacity-0 transition duration-300 group-hover:opacity-100" />

      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 transition duration-300 group-hover:border-violet-300/35 group-hover:bg-violet-500/15">
        <FontAwesomeIcon
          icon={faIcon}
          className="h-4 w-4 text-violet-200 transition duration-300 group-hover:text-white"
        />
      </span>

      <span className="relative z-10 min-w-0 flex-1 truncate text-sm font-bold text-slate-300 transition duration-300 group-hover:text-white 2xl:hidden">
        {title}
      </span>
    </button>
  );
};

export default SideButtons;