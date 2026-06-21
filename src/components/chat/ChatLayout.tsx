"use client";

import { useState } from "react";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import NewConversationDialog from "./NewConversationDialog";
import {
  ChevronLeft,
  MessageCircle,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChatLayoutProps } from "@/lib/types";

export default function ChatLayout({
  userId,
  privateKey,
  campusId,
  currentUser,
  initialConversationId,
}: ChatLayoutProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversationId || null);

  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(
    Boolean(initialConversationId),
  );

  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const router = useRouter();

  const handleBack = () => {
    const rolePath = currentUser.role.toLowerCase();
    router.push(`/dashboard/${rolePath}`);
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsMobileThreadOpen(true);
  };

  const handleMobileBackToList = () => {
    setIsMobileThreadOpen(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="relative flex h-[100dvh] overflow-hidden bg-[#08080C] text-white"
    >
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <motion.aside
        initial={{ x: -32, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`relative z-10 w-full shrink-0 flex-col border-r border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl md:flex md:w-[340px] ${
          isMobileThreadOpen ? "hidden" : "flex"
        }`}
      >
        <div className="shrink-0 border-b border-white/10 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              aria-label="Back to dashboard"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsNewChatOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 text-white shadow-lg shadow-violet-950/35 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
              aria-label="Start new chat"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Campus Chat
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Messages
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Encrypted conversations for your campus workspace.
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <ConversationList
            userId={userId}
            selectedId={selectedConversationId}
            onSelect={handleConversationSelect}
          />
        </div>
      </motion.aside>

      <main
        className={`relative z-10 min-w-0 flex-1 flex-col md:flex ${
          isMobileThreadOpen ? "flex" : "hidden"
        }`}
      >
        {selectedConversationId && (
          <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#14141B]/90 px-3 py-3 backdrop-blur-2xl md:hidden">
            <button
              type="button"
              onClick={handleMobileBackToList}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300"
              aria-label="Back to conversations"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="text-sm font-extrabold text-white">Chat</p>
              <p className="truncate text-xs text-slate-500">
                Secure campus conversation
              </p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedConversationId ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-1 flex-col bg-[#08080C]/35 backdrop-blur-xl"
            >
              <MessageThread
                userId={userId}
                conversationId={selectedConversationId}
                privateKey={privateKey}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className="hidden h-full place-items-center p-6 md:grid"
            >
              <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-cyan-400/8" />
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl" />

                <div className="relative z-10">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-violet-950/30">
                    <Image
                      src="/chat-logo.png"
                      alt="No conversation selected"
                      width={58}
                      height={58}
                      className="h-14 w-14 object-contain"
                      priority
                    />
                  </div>

                  <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-violet-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Conversation Hub
                  </div>

                  <h2 className="text-2xl font-extrabold tracking-tight text-white">
                    No conversation selected
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                    Choose a chat from the left panel or start a new secure
                    conversation.
                  </p>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsNewChatOpen(true)}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Start New Chat
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <NewConversationDialog
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        userId={userId}
        campusId={campusId}
        onCreated={(id) => {
          setSelectedConversationId(id);
          setIsMobileThreadOpen(true);
          setIsNewChatOpen(false);
        }}
      />
    </motion.section>
  );
}