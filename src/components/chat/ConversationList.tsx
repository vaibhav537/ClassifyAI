"use client";

import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Users, User } from "lucide-react";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ConversationListProps {
  userId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  userId,
  selectedId,
  onSelect,
}: ConversationListProps) {
  const { data: conversations, isLoading } = useSWR(
    `/api/chat/conversations?userId=${userId}`,
    fetcher,
    { refreshInterval: 10000 },
  );

  if (isLoading) {
    return (
      <div className="space-y-3 p-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[76px] animate-pulse rounded-[1.5rem] border border-white/10 bg-white/[0.045]"
          />
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="grid min-h-[320px] place-items-center px-4 text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
            <MessageCircle className="h-6 w-6 text-slate-500" />
          </div>

          <p className="mt-4 text-sm font-extrabold text-slate-300">
            No conversations yet
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Start a new chat to begin secure campus messaging.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {conversations.map((conv: any, index: number) => {
        const isSelected = conv.id === selectedId;
        const isGroup = conv.type === "GROUP";
        const lastMessage = conv.messages?.[0];

        const otherParticipant = conv.participants?.find(
          (p: any) => p.userId !== userId,
        );

        const displayName = isGroup
          ? conv.name
          : (otherParticipant?.user?.name ?? "Unknown");

        return (
          <motion.li
            key={conv.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025 }}
          >
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(conv.id)}
              className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-[1.5rem] border px-3 py-3 text-left transition duration-300 ${
                isSelected
                  ? "border-violet-300/35 bg-violet-500/15 shadow-lg shadow-violet-950/20"
                  : "border-white/10 bg-white/[0.04] hover:border-violet-300/25 hover:bg-white/[0.065]"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" />

              <div
                className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                  isSelected
                    ? "border-violet-300/30 bg-violet-500/20"
                    : "border-white/10 bg-[#08080C]/45"
                }`}
              >
                {isGroup ? (
                  <Users className="h-5 w-5 text-violet-200" />
                ) : (
                  <User className="h-5 w-5 text-violet-200" />
                )}

                {isSelected && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-violet-500/20 blur-lg" />
                )}
              </div>

              <div className="relative z-10 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-extrabold text-white">
                    {displayName}
                  </span>

                  {lastMessage && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                      {formatDistanceToNow(new Date(lastMessage.createdAt), {
                        addSuffix: false,
                      })}
                    </span>
                  )}
                </div>

                <p className="mt-1 truncate text-xs font-medium text-slate-500">
                  {lastMessage ? "Encrypted message" : "No messages yet"}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-1.5 text-[10px] font-extrabold text-white shadow-lg shadow-violet-950/35"
                >
                  {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                </motion.span>
              )}
            </motion.button>
          </motion.li>
        );
      })}
    </ul>
  );
}