import { Suspense } from "react";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

function ChatFallback() {
  return (
    <section className="grid min-h-dvh place-items-center bg-[#08080C] px-4 text-white">
      <div className="rounded-3xl border border-white/10 bg-[#14141B]/85 px-7 py-6 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
        <p className="text-sm font-semibold text-slate-200">
          Initializing secure chat...
        </p>
      </div>
    </section>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatFallback />}>
      <ChatClient />
    </Suspense>
  );
}