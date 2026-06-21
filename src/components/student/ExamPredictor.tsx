"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  FileText,
  Loader2,
  BookOpen,
  X,
  Flame,
  Zap,
  Leaf,
  FileSearch,
  WifiOff,
  AlignLeft,
  List,
  CheckCircle2,
} from "lucide-react";
import { Answer, Prediction } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const weightageConfig = {
  High: {
    icon: <Flame size={12} />,
    badge: "bg-red-500/15 text-red-400 border-red-500/25",
    border: "hover:border-red-500/25",
    bar: "from-red-500 to-orange-400",
    glow: "group-hover:shadow-[0_0_24px_rgba(239,68,68,0.08)]",
  },
  Medium: {
    icon: <Zap size={12} />,
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    border: "hover:border-amber-500/25",
    bar: "from-amber-400 to-yellow-300",
    glow: "group-hover:shadow-[0_0_24px_rgba(245,158,11,0.08)]",
  },
  Low: {
    icon: <Leaf size={12} />,
    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    border: "hover:border-cyan-500/25",
    bar: "from-cyan-400 to-teal-300",
    glow: "group-hover:shadow-[0_0_24px_rgba(34,211,238,0.08)]",
  },
};

function AnswerModal({
  topic,
  subjectId,
  onClose,
}: {
  topic: string;
  subjectId: string;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"summary" | "detailed" | "keys">(
    "summary",
  );

  const { data, error, isLoading } = useSWR(
    `/api/student/answer?subjectId=${subjectId}&topic=${encodeURIComponent(topic)}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const answer: Answer | null = data?.answer ?? null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="relative bg-slate-900/95 border border-cyan-500/20 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-[0_0_60px_rgba(34,211,238,0.08)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 p-6 pb-4 border-b border-white/5 bg-slate-900/95 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-0.5">
                AI Answer
              </p>
              <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                {topic}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center flex-1 py-16 gap-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <div className="text-center">
              <p className="text-white font-semibold mb-1">
                Generating Answer...
              </p>
              <p className="text-gray-400 text-sm">
                Scanning notes for
                <span className="text-cyan-400">&quot;{topic}&quot;</span>
              </p>
            </div>
          </div>
        )}

        {!isLoading && (error || !data?.success) && (
          <div className="flex flex-col items-center justify-center flex-1 py-16 gap-3">
            <AlertTriangle className="w-10 h-10 text-red-400" />
            <p className="text-red-300 font-medium text-center px-6">
              {data?.error || "Failed to generate answer."}
            </p>
          </div>
        )}

        {!isLoading && answer && (
          <>
            <div className="px-6 pt-4 shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border-t ${
                  answer.sourcedFromNotes
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {answer.sourcedFromNotes ? (
                  <>
                    <FileSearch size={12} /> Notes Used
                  </>
                ) : (
                  <>
                    <WifiOff size={12} /> AI Generated
                  </>
                )}
              </span>
            </div>

            <div className="sticky top-[72px] z-10 flex gap-2 px-6 pt-4 pb-3 bg-slate-900/95 backdrop-blur-xl">
              {[
                {
                  key: "summary",
                  icon: <AlignLeft size={13} />,
                  label: "Summary",
                },
                {
                  key: "detailed",
                  icon: <FileText size={13} />,
                  label: "Detailed",
                },
                { key: "keys", icon: <List size={13} />, label: "Key Points" },
              ].map((tab: any) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <AnimatePresence mode="wait">
                {activeTab === "summary" && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/5 rounded-2xl p-5"
                  >
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {answer.summary}
                    </p>
                  </motion.div>
                )}

                {activeTab === "detailed" && (
                  <div className="space-y-4">
                    {answer.sections.map((sec, i) => (
                      <div key={i} className="bg-white/5 rounded-2xl p-5">
                        <h4 className="text-cyan-400 font-bold text-sm mb-2">
                          {sec.heading}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {sec.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "keys" && (
                  <div className="space-y-3">
                    {answer.keyPoints.map((p, i) => (
                      <div
                        key={i}
                        className="flex gap-3 bg-white/5 rounded-xl p-4"
                      >
                        <CheckCircle2 size={16} className="text-cyan-400" />
                        <p className="text-gray-300 text-sm">{p}</p>
                      </div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="sticky bottom-0 px-6 py-4 border-t border-white/5 bg-slate-900/95">
              <p className="text-xs text-gray-500 text-center">
                {data.notesUsed > 0 ? `${data.notesUsed} note(s) used · ` : ""}
                AI can make mistakes. Please verify with your class materials!
              </p>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
export default function ExamPredictor({
  subjectId,
  subjectName,
}: {
  subjectId: string;
  subjectName: string;
}) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(
    subjectId ? `/api/student/predict?subjectId=${subjectId}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const predictions: Prediction[] = data?.predictions || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-slate-900/50 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          <Loader2 className="relative w-12 h-12 text-cyan-400 animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Analyzing Past Papers...
        </h3>
        <p className="text-gray-400 text-sm">
          Classify AI is finding patterns in{" "}
          <span className="text-cyan-400 font-medium">{subjectName}</span> PYQs.
        </p>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-3xl border border-red-500/20 backdrop-blur-xl">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-red-300 font-medium text-center">
          {data?.error ||
            "Failed to generate predictions. Tell your teacher to upload more PYQs!"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
          <Sparkles className="w-7 h-7 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            AI Exam Predictor
          </h2>
          <p className="text-sm text-cyan-400 font-medium flex items-center gap-2 mt-0.5">
            <TrendingUp size={14} />
            Based on{" "}
            <span className="font-bold">{data.totalPapersAnalyzed}</span> past
            papers of {subjectName}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((item, index) => {
          const config = weightageConfig[item.weightage] ?? weightageConfig.Low;
          const circumference = 2 * Math.PI * 26;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 120,
              }}
              className={`group relative bg-slate-900/70 backdrop-blur-xl border border-white/5 ${config.border} ${config.glow} rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-500 pointer-events-none" />

              {/* Top: badge + ring */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badge}`}
                >
                  {config.icon}
                  {item.weightage} Weightage
                </span>
                <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      stroke="url(#ringGrad)"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={
                        circumference - (item.probability / 100) * circumference
                      }
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient
                        id="ringGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-xs font-bold text-white">
                    {item.probability}%
                  </span>
                </div>
              </div>

              {/* Topic + reason */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-1.5">
                  {item.topic}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {item.reason}
                </p>
              </div>

              {/* Probability bar */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                    Chance of appearing
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {item.probability}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.probability}%` }}
                    transition={{
                      delay: index * 0.08 + 0.3,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full bg-gradient-to-r ${config.bar}`}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setSelectedTopic(item.topic)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/8 hover:border-cyan-500/40 text-gray-400 hover:text-cyan-300 transition-all duration-200 text-sm font-semibold"
              >
                <FileText size={14} />
                Get Answer
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Answer Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <AnswerModal
            topic={selectedTopic}
            subjectId={subjectId}
            onClose={() => setSelectedTopic(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
