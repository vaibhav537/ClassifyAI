"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, X, Smile, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { EMOJI_SHORTCUTS } from "@/lib/helper";

interface MessageInputProps {
  onSend: (text: string, attachmentIds?: string[]) => Promise<void>;
  onTypingStart: () => void;
  onTypingStop: () => void;
  userId: string;
}

function replaceEmojiShortcuts(value: string) {
  return value.replace(/:([a-zA-Z0-9_+-]+):/g, (match, shortcut) => {
    const emoji = EMOJI_SHORTCUTS[shortcut.toLowerCase()];
    return emoji ?? match;
  });
}

export default function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
  userId,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<
    { id: string; name: string }[]
  >([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isImproving, setIsImproving] = useState<boolean>(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const handleTyping = useCallback(
    (value: string) => {
      const parsedValue = replaceEmojiShortcuts(value);
      setText(parsedValue);

      if (!isTypingRef.current) {
        isTypingRef.current = true;
        onTypingStart();
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        onTypingStop();
      }, 2000);
    },
    [onTypingStart, onTypingStop],
  );

  const handleEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImproveWithAI = async () => {
    const trimmed = text.trim();

    if (!trimmed || isImproving) return;

    setIsImproving(true);

    try {
      const res = await fetch("/api/chat/ai/improve-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Improve failed:", data.error);
        return;
      }

      if (data.improved) {
        setText(data.improved);
      }
    } catch (error) {
      console.error("Improve with AI error:", error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();

    if (!trimmed && attachments.length === 0) return;

    setIsSending(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    isTypingRef.current = false;
    onTypingStop();

    try {
      await onSend(
        trimmed,
        attachments.map((a) => a.id),
      );

      setText("");
      setAttachments([]);
    } catch (error: any) {
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!,
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: "POST", body: formData },
      );

      const data = await res.json();

      const resourceRes = await fetch("/api/chat/attachments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          url: data.secure_url,
          fileExtension: file.name.split(".").pop(),
          uploadedBy: userId,
        }),
      });

      const resource = await resourceRes.json();

      setAttachments((prev) => [...prev, { id: resource.id, name: file.name }]);
    } catch (err) {
      console.error("Upload failed:", err);
    }

    e.target.value = "";
  };

  return (
    <motion.div
      initial={{ y: 28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-[#14141B]/85 p-4 backdrop-blur-2xl"
    >
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-3 flex flex-wrap gap-2"
          >
            {attachments.map((att) => (
              <motion.div
                key={att.id}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="group flex max-w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-bold text-slate-300"
              >
                <span className="max-w-[220px] truncate">📎 {att.name}</span>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setAttachments((prev) =>
                      prev.filter((a) => a.id !== att.id),
                    )
                  }
                  className="text-slate-500 transition hover:text-red-300"
                  aria-label="Remove attachment"
                >
                  <X size={13} />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 sm:gap-3">
        <motion.label
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.94 }}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-400 transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
          title="Attach file"
        >
          <Paperclip size={18} />

          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          />
        </motion.label>

        <div className="relative min-w-0 flex-1">
          <textarea
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... Enter to send"
            rows={1}
            className="max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 pr-4 text-sm leading-5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
          />
        </div>

        <div className="relative shrink-0">
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-400 transition duration-300 hover:border-amber-300/35 hover:bg-amber-500/10 hover:text-amber-200"
            title="Emoji"
          >
            <Smile size={18} />
          </motion.button>

          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-14 right-0 z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#08080C]/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={Theme.DARK}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={handleImproveWithAI}
          disabled={isImproving || !text.trim()}
          title="Improve with AI"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-400 transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isImproving ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin text-violet-300" />
          ) : (
            <Sparkles size={18} />
          )}
        </motion.button>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={handleSend}
          disabled={isSending || (!text.trim() && attachments.length === 0)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 text-white shadow-lg shadow-violet-950/35 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-40"
          title="Send message"
        >
          {isSending ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}