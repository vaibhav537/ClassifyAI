"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronLeft,
  GraduationCap,
  SendHorizonal,
  Sparkles,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";
import { useRouter } from "next/navigation";
import ClassifyNexusUnderDevelopment from "@/components/ui/ClassifyNexusUnderDevelopment";

const Page = () => {
  const isClassifyNexusUnderDev =
    process.env.NEXT_PUBLIC_CLASSIFY_NEXUS_UNDER_DEV === "true";

  if (isClassifyNexusUnderDev) {
    return <ClassifyNexusUnderDevelopment />;
  }
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm here to help with your doubts." },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<"openai" | "claude">("openai");
  const [isBotTyping, setIsBotTyping] = useState(false);

  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsBotTyping(true);

    try {
      const res = await fetch(`/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, model }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong." },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#08080C] px-3 py-4 text-white sm:px-5 lg:px-6">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute left-10 top-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-[calc(100vh-2rem)] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/85 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <header className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/student")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 shadow-lg shadow-violet-950/20">
              <Image
                src="/only-logo.png"
                alt="Classify AI"
                width={34}
                height={34}
                className="h-8 w-8 object-contain drop-shadow-[0_0_18px_rgba(34,211,238,0.2)]"
                priority
              />
            </div>

            <div className="min-w-0">
              <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                <Sparkles className="h-3 w-3" />
                AI Study Assistant
              </div>

              <h1 className="truncate text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Classify AI Chat
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-slate-300 sm:flex">
              <GraduationCap className="h-4 w-4 text-violet-300" />
              Doubt Solver
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2">
              <Bot className="h-4 w-4 text-violet-300" />

              <select
                value={model}
                onChange={(e) =>
                  setModel(e.target.value as "openai" | "claude")
                }
                className="appearance-none bg-transparent text-sm font-bold text-white outline-none"
              >
                <option className="bg-[#14141B] text-white">GPT-3.5</option>
                <option className="bg-[#14141B] text-white">Claude</option>
              </select>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-5">
              {messages.map((msg, index) => {
                const isUser = msg.sender === "user";

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                        <Image
                          src="/only-logo.png"
                          alt="Bot"
                          width={28}
                          height={28}
                          className="h-7 w-7 object-contain"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] overflow-hidden rounded-[1.5rem] border px-4 py-3 text-sm leading-7 shadow-lg sm:max-w-[72%] ${
                        isUser
                          ? "border-violet-300/25 bg-violet-500/15 text-white shadow-violet-950/20"
                          : "border-white/10 bg-white/[0.06] text-slate-100 shadow-black/20"
                      }`}
                    >
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#08080C] prose-code:text-violet-200">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {isUser && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                        <UserRound className="h-5 w-5 text-slate-200" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isBotTyping && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <Image
                      src="/only-logo.png"
                      alt="Bot"
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-4 py-3 shadow-lg shadow-black/20">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-violet-300" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#101014]/70 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-5xl items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-3 py-3 shadow-xl shadow-black/25 transition focus-within:border-violet-300/35 focus-within:ring-4 focus-within:ring-violet-500/10">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your doubt..."
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={handleSend}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 text-white shadow-lg shadow-violet-950/35 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30"
              >
                <SendHorizonal className="h-5 w-5" />
              </button>
            </div>

            <p className="mx-auto mt-3 max-w-5xl text-center text-xs text-slate-600">
              AI can make mistakes. Verify important academic information.
            </p>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Page;
