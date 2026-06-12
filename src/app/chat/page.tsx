"use client";

import { useEffect, useState } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import { initUserKeys } from "@/lib/init-keys";
import { motion } from "framer-motion";
import { Loader2, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";
import { CurrentUser } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get("conversationId");

  useEffect(() => {
    const init = async () => {
      try {
        setError("");
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !data.success || !data.user?.id) {
          router.push("/auth/login");
          return;
        }
        const user = data.user as CurrentUser;
        const key = await initUserKeys(user.id);
        setCurrentUser(user);
        setPrivateKey(key);
        setIsReady(true);
      } catch (error) {
        console.error("Chat init error:", error);
        setError("Unable to initialize chat session.");
      }
    };
    init();
  }, [router]);

  if (!isReady || !currentUser) {
    return (
      <section className="relative grid h-[100dvh] place-items-center overflow-hidden bg-[#08080C] px-4 text-white">
        <div className="pointer-events-none absolute inset-0 app-shell-bg" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-[12%] top-[18%] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-7 text-center shadow-2xl shadow-black/45 backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-cyan-400/8" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-violet-950/30">
              <MessageCircle className="h-8 w-8 text-violet-200" />
            </div>

            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-violet-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Campus Chat
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Initializing secure session
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Setting up encrypted keys and preparing your real-time campus
              conversations.
            </p>

            <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-center gap-3 text-sm font-bold text-slate-300">
                <Loader2 className="h-5 w-5 animate-spin text-violet-300" />
                Preparing chat workspace...
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: ["-100%", "120%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-300"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <LockKeyhole className="h-3.5 w-3.5 text-emerald-300" />
              Encryption keys are being configured
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-[100dvh] bg-[#08080C] text-white"
    >
      <ChatLayout
        userId={currentUser.id}
        privateKey={privateKey}
        campusId={currentUser.campusId || ""}
        currentUser={currentUser}
        initialConversationId={initialConversationId}
      />
    </motion.div>
  );
}
