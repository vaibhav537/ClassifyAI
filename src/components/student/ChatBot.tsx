"use client";

import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bot, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ChatBot = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard/student/chat")}
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-2xl border border-violet-300/25 bg-[#14141B]/90 px-4 py-3 text-white shadow-2xl shadow-violet-950/35 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/45 hover:bg-[#1B1B24]/95"
      aria-label="Chat with AI"
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/18 via-fuchsia-500/10 to-cyan-400/10 opacity-0 transition duration-300 group-hover:opacity-100" />

      <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-violet-500/15">
        <Bot className="h-5 w-5 text-violet-100" />
      </span>

      <span className="relative z-10 hidden flex-col items-start sm:flex">
        <span className="flex items-center gap-1.5 text-sm font-extrabold">
          Chat AI
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
        </span>
        <span className="text-xs font-medium text-slate-400">
          Ask your study assistant
        </span>
      </span>

      <FontAwesomeIcon icon={faComment} className="hidden" />
    </button>
  );
};

export default ChatBot;