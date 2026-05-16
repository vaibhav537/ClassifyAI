"use client";

import { motion } from "framer-motion";

interface TypingIndicatorProps {
  typingUsers: Map<string, string>;
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.size === 0) return null;

  const label =
    typingUsers.size === 1
      ? "Someone is typing"
      : `${typingUsers.size} people are typing`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 px-1"
    >
      <div className="flex items-center gap-1.5 rounded-[1.25rem] rounded-bl-md border border-white/10 bg-[#14141B]/90 px-4 py-2 shadow-lg shadow-black/20 backdrop-blur-xl">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-violet-300"
            animate={{
              y: [0, -5, 0],
              opacity: [0.45, 1, 0.45],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 0.2 }}
        className="text-xs font-medium text-slate-500"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}