import { Check, Loader2, Search, Sparkles } from "lucide-react";

export default function AIAssistantSection({
  analysisResult,
  isAnalyzing,
  runAIAnalysis,
  getPlagiarismColor,
}: any) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-violet-300/20 bg-violet-500/10 p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/14 via-fuchsia-500/7 to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
              <Sparkles className="h-5 w-5 text-violet-200" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-white">
                Classify AI Assistant
              </h4>
              <p className="text-xs leading-5 text-slate-500">
                Analyze writing quality and possible AI-generated content.
              </p>
            </div>
          </div>

          {!analysisResult ? (
            <button
              type="button"
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-violet-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Run Analysis
                </>
              )}
            </button>
          ) : (
            <span className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-extrabold text-emerald-300">
              <Check className="h-4 w-4" />
              Analysis Complete
            </span>
          )}
        </div>

        {analysisResult ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px]">
            <div className="space-y-2.5">
              {analysisResult.summary.map((point: string, index: number) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-[#08080C]/45 px-4 py-3 text-sm leading-6 text-slate-300"
                >
                  <span className="mr-2 font-extrabold text-violet-300">
                    {index + 1}.
                  </span>
                  {point}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-5 text-center">
              <div
                className={`rounded-2xl border px-4 py-3 text-4xl font-extrabold ${getPlagiarismColor(
                  analysisResult.aiProbability,
                )}`}
              >
                {analysisResult.aiProbability}%
              </div>

              <div className="mt-3 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                AI Probability
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-[180px] place-items-center rounded-[1.5rem] border border-dashed border-violet-300/20 bg-[#08080C]/35 p-6 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                <Sparkles className="h-6 w-6 text-violet-200" />
              </div>

              <p className="mt-4 text-sm font-extrabold text-white">
                Ready to analyze this submission?
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Run AI analysis to generate summary points and AI probability.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
