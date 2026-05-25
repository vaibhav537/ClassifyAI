"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { formatDistanceToNow } from "date-fns";
import { secureGet } from "@/lib/tauri-store";
import { AnimatePresence, motion } from "framer-motion";
import {
  Pin,
  X,
  Reply,
  Trash2,
  Check,
  Pencil,
  Smile,
  Sparkles,
} from "lucide-react";

interface MessageThreadProps {
  userId: string;
  conversationId: string;
  privateKey: string;
}

export default function MessageThread({
  userId,
  conversationId,
  privateKey,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const reactionPickerRef = useRef<HTMLDivElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(
    null,
  );

  const {
    messages,
    isLoading,
    typingUsers,
    readByUsers,
    chatError,
    setChatError,
    sendMessage,
    loadMore,
    hasMore,
    sendTypingStart,
    sendTypingStop,
    markAsRead,
    pinMessage,
    pinnedMessage,
    unpinMessage,
    replyingTo,
    setReplyingTo,
    deleteMessage,
    editMessage,
    reactToMessage,
    missedSummary,
    setMissedSummary,
    isSummarizing,
    summarizeMissedMessage,
  } = useChat({ userId, conversationId, privateKey });

  useEffect(() => {
    const registerKey = async () => {
      const publicKey = await secureGet(`publicKey_${userId}`);
      if (!publicKey) return;

      await fetch("/api/chat/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, conversationId, publicKey }),
      });
    };

    registerKey();
  }, [userId, conversationId]);

  useEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: messages.length < 5 ? "smooth" : "auto",
    });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(event.target as Node)
      ) {
        setReactionPickerFor(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    markAsRead();
  }, [conversationId]);

  const startEditing = (msg: any) => {
    setEditingId(msg.id);
    setEditText(msg.decryptedContent || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return;

    await editMessage(editingId, editText);

    cancelEditing();
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm bg-[#08080C]/30">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative bg-[#08080C]/30">
      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center py-3 border-b border-white/10">
          <button
            onClick={loadMore}
            className="rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold text-violet-200 transition hover:border-violet-300/40 hover:bg-violet-500/20"
          >
            Load older messages
          </button>
        </div>
      )}

      {pinnedMessage && (
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-4 mt-3 flex items-center gap-3 rounded-[1.5rem] border border-amber-300/20 bg-amber-400/10 px-4 py-3 backdrop-blur-xl shadow-lg shadow-black/20"
        >
          {/* Pin Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400/10 text-amber-200">
            <Pin size={18} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-200/80">
              Pinned Message
            </p>

            <p className="mt-0.5 truncate text-sm text-white/90">
              {pinnedMessage.decryptedContent}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={unpinMessage}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}

      {/*AI Missed  Summary Button*/}
      <div className="flex items-center justify-center border-b border-white/10 px-4 py-3">
        <button
          onClick={summarizeMissedMessage}
          disabled={isSummarizing || messages.length === 0}
          className="flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold text-violet-200 transition hover:border-violet-300/40 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSummarizing ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-300 border-t-transparent" />
          ) : (
            <Sparkles size={14} />
          )}
          {isSummarizing ? "Summarizing..." : "What did I miss?"}
        </button>
      </div>

      <AnimatePresence>
        {missedSummary && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-3 rounded-[1.5rem] border border-violet-300/20 bg-[#14141B]/90 p-4 shadow-lg shadow-black/25 backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-violet-200">
                <Sparkles size={16} />
                <p className="text-xs font-extrabold uppercase tracking-[0.18em]">
                  AI Summary
                </p>
              </div>

              <button
                onClick={() => setMissedSummary(null)}
                className="flex h-7 w-7 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <X size={14} />
              </button>
            </div>

            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {missedSummary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide px-6 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isOwn = msg.senderId === userId;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col gap-1 ${
                  isOwn ? "items-end" : "items-start"
                }`}
              >
                {/* Sender */}
                {!isOwn && (
                  <span className="text-xs font-bold text-slate-500 px-1">
                    {msg.sender.name}
                  </span>
                )}

                <div className="group relative flex max-w-[85%] items-center overflow-visible">
                  {/* Bubble */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`w-fit max-w-full break-words px-4 py-2.5 rounded-[1.35rem] text-sm leading-relaxed shadow-lg ${
                      isOwn
                        ? "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-500 text-white rounded-br-md shadow-violet-950/25"
                        : "bg-[#14141B]/90 border border-white/10 text-slate-100 rounded-bl-md backdrop-blur-md shadow-black/20"
                    }`}
                  >
                    {msg.replyTo && (
                      <div
                        className={`mb-2 rounded-xl border-l-2 px-3 py-2 text-xs ${
                          isOwn
                            ? "border-white/40 bg-white/10"
                            : "border-violet-300/50 bg-black/20"
                        }`}
                      >
                        <p className="font-semibold text-violet-200">
                          {msg.replyTo.sender?.name}
                        </p>

                        <p className="truncate text-white/70">
                          {msg.replyTo.decryptedContent}
                        </p>
                      </div>
                    )}

                    {editingId === msg.id ? (
                      <div className="flex flex-col gap-2 min-w-[220px]">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="resize-none rounded-xl bg-black/20 px-3 py-2 text-sm outline-none border border-white/10 focus:border-violet-300/40"
                          rows={3}
                          autoFocus
                        />

                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={cancelEditing}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 transition"
                          >
                            <X size={14} />
                          </button>

                          <button
                            onClick={saveEdit}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 transition"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {msg.decryptedContent ?? (
                          <span className="text-gray-400 italic text-xs">
                            Encrypted message
                          </span>
                        )}
                      </>
                    )}
                  </motion.div>

                  <div
                    className={`absolute top-1/2 z-30 flex -translate-y-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#08080C]/90 px-2 py-1 shadow-xl backdrop-blur-xl opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 ${
                      isOwn
                        ? "-left-3 -translate-x-full"
                        : "-right-3 translate-x-full"
                    }`}
                  >
                    {/* React */}
                    <button
                      type="button"
                      title="React"
                      onClick={() =>
                        setReactionPickerFor((prev) =>
                          prev === msg.id ? null : msg.id,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-orange-500/15 hover:text-orange-300"
                    >
                      <Smile size={14} />
                    </button>

                    {/* Reply */}
                    <button
                      type="button"
                      title="Reply"
                      onClick={() => setReplyingTo(msg)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-violet-500/15 hover:text-violet-200"
                    >
                      <Reply size={14} />
                    </button>

                    {/* Pin */}
                    <button
                      type="button"
                      title="Pin"
                      onClick={() => pinMessage(msg.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-yellow-500/15 hover:text-yellow-300"
                    >
                      <Pin size={14} />
                    </button>

                    {/* Edit + Delete only for own messages */}
                    {isOwn && (
                      <>
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => startEditing(msg)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-pink-500/15 hover:text-pink-300"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() => deleteMessage(msg.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-500/15 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Reaction Picker */}
                  {reactionPickerFor === msg.id && (
                    <div
                      ref={reactionPickerRef}
                      className={`absolute bottom-12 z-50 ${
                        isOwn ? "right-full mr-3" : "left-full ml-3"
                      }`}
                    >
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080C]/95 shadow-2xl backdrop-blur-xl">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            reactToMessage(msg.id, emojiData.emoji);
                            setReactionPickerFor(null);
                          }}
                          theme={Theme.DARK}
                          width={280}
                          height={350}
                          autoFocusSearch={false}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                {msg.attachments?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.attachments.map((att: any) => (
                      <motion.a
                        key={att.id}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="text-xs text-violet-200 hover:text-white bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-violet-300/35 transition"
                      >
                        📎 {att.title}
                      </motion.a>
                    ))}
                  </div>
                )}

                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(
                      msg.reactions.reduce((acc: any, reaction: any) => {
                        if (!reaction?.emoji) return acc;
                        if (!acc[reaction.emoji]) {
                          acc[reaction.emoji] = {
                            count: 0,
                            reacted: false,
                          };
                        }

                        acc[reaction.emoji].count++;
                        if (reaction.userId === userId) {
                          acc[reaction.emoji].reacted = true;
                        }
                        return acc;
                      }, {}),
                    ).map(([emoji, data]: any) => (
                      <button
                        key={emoji}
                        onClick={() => reactToMessage(msg.id, emoji)}
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition ${
                          data.reacted
                            ? "bg-violet-500/20 border-violet-300/40 text-violet-100"
                            : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{data.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center gap-1 px-1">
                  <span className="text-[10px] text-slate-600">
                    {formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                    })}
                  </span>

                  {msg.editedAt && (
                    <span className="text-[10px] italic text-slate-500">
                      edited
                    </span>
                  )}

                  {isOwn && (
                    <span className="text-[10px]">
                      {Object.entries(readByUsers).some(
                        ([readerId]) => readerId !== userId,
                      ) ? (
                        <span className="text-violet-300">✓✓</span>
                      ) : (
                        <span className="text-slate-500">✓</span>
                      )}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing */}
        {typingUsers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TypingIndicator typingUsers={typingUsers} />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error popup */}
      <AnimatePresence>
        {chatError && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"
          >
            <div className="flex items-start gap-3 p-4 bg-amber-400/10 border border-amber-300/25 rounded-2xl backdrop-blur-xl shadow-xl">
              <span className="text-amber-300 text-xl shrink-0">🔐</span>

              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-200">
                  Encryption Not Ready
                </p>
                <p className="text-xs text-amber-100/70 mt-1">{chatError}</p>
              </div>

              <button
                onClick={() => setChatError(null)}
                className="text-amber-300 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {replyingTo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mx-4 mb-2 flex items-start gap-3 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3 backdrop-blur-xl"
        >
          <div className="mt-1 h-10 w-1 rounded-full bg-violet-300" />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-violet-200">
              Replying to {replyingTo.sender?.name || "message"}
            </p>

            <p className="truncate text-sm text-white/80">
              {replyingTo.decryptedContent}
            </p>
          </div>

          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-400 hover:text-red-400 transition"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* Input */}
      <MessageInput
        onSend={(text, attachments) =>
          sendMessage(text, attachments, replyingTo?.id)
        }
        onTypingStart={sendTypingStart}
        onTypingStop={sendTypingStop}
        userId={userId}
      />
    </div>
  );
}