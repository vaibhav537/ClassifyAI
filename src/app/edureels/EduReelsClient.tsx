"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark, BookOpen, CheckCircle2, ChevronLeft, Flag, Loader2, Plus, ShieldCheck, Video } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReelCard from "@/components/edureels/ReelCard";
import UploadForm from "@/components/edureels/UploadForm";
import { CourseOption, Reel } from "@/components/edureels/types";

type Tab = "feed" | "saved" | "mine" | "create" | "review" | "reports";
type Viewer = { id: string; role: string; name: string; campusId: string };
type Report = { id: string; reason: string; reporter: string; reel: Reel };

export default function EduReelsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const queryTab = params.get("tab") || "feed";
  const [tab, setTab] = useState<Tab>(
    ["feed", "saved", "mine", "create", "review", "reports"].includes(queryTab) ? queryTab as Tab : "feed",
  );
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.user?.id) { router.replace("/auth/login"); return; }
        if (!data.user.campusId || data.user.role === "ADMIN") {
          setError("EduReels is available to campus members.");
          setLoading(false);
          return;
        }
        if (mounted) {
          setViewer(data.user);
          setTab((current) =>
            (data.user.role === "STUDENT" && ["review", "reports"].includes(current)) ||
            (data.user.role === "TEACHER" && current === "reports") ||
            (data.user.role === "ASSISTANT" && ["create", "mine"].includes(current))
              ? "feed" : current,
          );
        }
        if (["STUDENT", "TEACHER"].includes(data.user.role)) {
          const optionsResponse = await fetch("/api/edureels/options");
          if (optionsResponse.ok && mounted) setCourses((await optionsResponse.json()).courses || []);
        }
      } catch {
        if (mounted) { setError("Could not open EduReels. Please refresh."); setLoading(false); }
      }
    };
    void init();
    return () => { mounted = false; };
  }, [router]);

  const loadContent = useCallback(async (nextOffset = 0) => {
    if (!viewer || tab === "create") return;
    const append = nextOffset > 0;
    setError("");
    if (append) setMoreLoading(true);
    else { setLoading(true); setOffset(0); }
    try {
      const url = tab === "review" ? "/api/edureels/review"
        : tab === "reports" ? "/api/edureels/reports"
        : `/api/edureels?mode=${tab}&offset=${nextOffset}`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load reels");
      if (tab === "reports") setReports(data.reports || []);
      else if (tab === "review") setReels(data.reels || []);
      else {
        setReels((current) => append ? [...current, ...data.reels] : data.reels);
        setHasMore(data.hasMore);
        setOffset(nextOffset + data.reels.length);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load reels");
    } finally { setLoading(false); setMoreLoading(false); }
  }, [viewer, tab]);

  useEffect(() => { void loadContent(); }, [loadContent]);

  const review = async (reelId: string, action: "APPROVE" | "REJECT") => {
    setActionId(reelId);
    setError("");
    try {
      const response = await fetch("/api/edureels/review", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId, action, reason: action === "REJECT" ? rejectReason : undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not review reel");
      setReels((current) => current.filter((reel) => reel.id !== reelId));
      setRejectId(null); setRejectReason("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not review reel"); }
    finally { setActionId(null); }
  };

  const handleReport = async (reportId: string, action: "HIDE" | "DISMISS") => {
    setActionId(reportId); setError("");
    try {
      const response = await fetch("/api/edureels/reports", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not handle report");
      const handled = reports.find((report) => report.id === reportId);
      setReports((current) => current.filter((report) => action === "HIDE" ? report.reel.id !== handled?.reel.id : report.id !== reportId));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not handle report"); }
    finally { setActionId(null); }
  };

  const onSaved = (id: string, saved: boolean) => {
    if (tab === "saved" && !saved) setOffset((current) => Math.max(0, current - 1));
    setReels((current) => current
      .map((reel) => reel.id === id ? { ...reel, saved, saves: Math.max(0, reel.saves + (saved ? 1 : -1)) } : reel)
      .filter((reel) => tab !== "saved" || reel.saved));
  };

  const dashboard = viewer?.role === "STUDENT" ? "/dashboard/student"
    : viewer?.role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/assistant";
  const tabs: { id: Tab; label: string; icon: typeof Video }[] = [
    { id: "feed", label: "For you", icon: Video },
    { id: "saved", label: "Saved", icon: Bookmark },
    ...(viewer?.role === "STUDENT" || viewer?.role === "TEACHER" ? [
      { id: "mine" as Tab, label: "My reels", icon: BookOpen },
      { id: "create" as Tab, label: "Create", icon: Plus },
    ] : []),
    ...(viewer?.role === "ASSISTANT" || viewer?.role === "TEACHER" ? [
      { id: "review" as Tab, label: "Review", icon: CheckCircle2 },
    ] : []),
    ...(viewer?.role === "ASSISTANT" ? [{ id: "reports" as Tab, label: "Reports", icon: Flag }] : []),
  ];

  if (!viewer && loading) return <div className="grid min-h-dvh place-items-center bg-[#08080C] text-violet-200"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#08080C] px-3 py-5 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="relative mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-[#14141B]/85 p-4 shadow-xl backdrop-blur-xl sm:p-5">
          <div className="flex items-center gap-3">
            <Link href={dashboard} aria-label="Back to dashboard" className="rounded-xl border border-white/10 p-2 text-slate-300 hover:text-white"><ChevronLeft size={21} /></Link>
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 p-2"><Video size={21} /></div>
            <div><h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">EduReels</h1>
              <p className="text-xs text-slate-400">Short lessons from your campus</p></div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-200"><ShieldCheck size={15} /> Campus learning</span>
        </header>

        <nav aria-label="EduReels sections" className="my-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setTab(id)}
            aria-current={tab === id ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${tab === id ? "border-violet-300/40 bg-violet-500/20 text-white" : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"}`}>
            <Icon size={17} />{label}
          </button>)}
        </nav>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

        {tab === "create" && viewer && <UploadForm courses={courses} role={viewer.role} onCreated={() => setTab("mine")} />}

        {(tab === "feed" || tab === "saved" || tab === "mine") && (
          <div className="space-y-5">
            {tab === "feed" && <p className="text-center text-sm text-slate-400">Your class first · Your subjects next · Campus discoveries after that</p>}
            {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-violet-300" /></div>
              : reels.length ? <div className="max-h-[82dvh] snap-y snap-mandatory space-y-4 overflow-y-auto py-2">
                {reels.map((reel) => <ReelCard key={reel.id} reel={reel} viewerId={viewer?.id || ""}
                  interactive={reel.status === "APPROVED"} onSaved={onSaved} />)}
                {hasMore && <div className="flex justify-center pb-5"><button type="button" disabled={moreLoading} onClick={() => loadContent(offset)}
                  className="rounded-xl border border-violet-300/30 bg-violet-500/10 px-5 py-3 text-sm font-bold text-violet-200 disabled:opacity-50">
                  {moreLoading ? "Loading..." : "Load more reels"}</button></div>}
              </div> : <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-slate-400">
                {tab === "mine" ? "Your reels will appear here after you upload." : tab === "saved" ? "Save a reel to find it here." : "No approved reels on your campus yet."}
              </div>}
          </div>
        )}

        {tab === "review" && <section className="space-y-4">
          <h2 className="text-xl font-bold">Student reels awaiting approval</h2>
          {loading ? <Loader2 className="mx-auto animate-spin" /> : reels.length ? reels.map((reel) => <article key={reel.id}
            className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[180px_1fr]">
            <video src={reel.videoUrl} controls preload="metadata" className="aspect-[9/16] max-h-80 w-full rounded-xl bg-black object-contain" />
            <div className="space-y-3">
              <p className="text-xs font-semibold text-violet-200">{reel.subject} · {reel.semester} · {reel.section}</p>
              <h3 className="text-lg font-bold">{reel.title}</h3>
              <p className="text-sm text-slate-400">By {reel.author.name} · Learn: {reel.learningOutcome}</p>
              {reel.description && <p className="text-sm text-slate-300">{reel.description}</p>}
              <div className="flex flex-wrap gap-3">
                <button type="button" disabled={actionId === reel.id} onClick={() => review(reel.id, "APPROVE")}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold disabled:opacity-50">Approve</button>
                <button type="button" onClick={() => { setRejectId(reel.id); setRejectReason(""); }}
                  className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-bold text-red-200">Request changes</button>
              </div>
              {rejectId === reel.id && <div className="space-y-2">
                <textarea aria-label="Reason for rejection" placeholder="Tell the student what to fix" value={rejectReason}
                  maxLength={300} onChange={(event) => setRejectReason(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white" />
                <button type="button" disabled={actionId === reel.id || rejectReason.trim().length < 5}
                  onClick={() => review(reel.id, "REJECT")} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold disabled:opacity-50">Send feedback</button>
              </div>}
            </div>
          </article>) : <p className="rounded-xl bg-white/5 p-8 text-center text-slate-400">Review queue is clear.</p>}
        </section>}

        {tab === "reports" && <section className="space-y-4">
          <h2 className="text-xl font-bold">Reported reels</h2>
          {loading ? <Loader2 className="mx-auto animate-spin" /> : reports.length ? reports.map((report) => <article key={report.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="min-w-0"><p className="font-bold">{report.reel.title} · {report.reel.subject}</p>
              <p className="mt-1 text-sm text-slate-400">Reported by {report.reporter}: {report.reason}</p>
              <a href={report.reel.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-violet-300 underline">View video</a>
            </div>
            <div className="flex gap-2"><button type="button" disabled={actionId === report.id} onClick={() => handleReport(report.id, "DISMISS")}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm font-bold disabled:opacity-50">Dismiss</button>
              <button type="button" disabled={actionId === report.id} onClick={() => handleReport(report.id, "HIDE")}
                className="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold disabled:opacity-50">Hide reel</button></div>
          </article>) : <p className="rounded-xl bg-white/5 p-8 text-center text-slate-400">No open reports.</p>}
        </section>}
      </div>
    </main>
  );
}
