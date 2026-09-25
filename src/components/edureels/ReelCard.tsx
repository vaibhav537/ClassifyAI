"use client";

import { Bookmark, Flag, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reel } from "./types";

export default function ReelCard({ reel, viewerId, interactive, onSaved }: {
  reel: Reel;
  viewerId: string;
  interactive: boolean;
  onSaved: (id: string, saved: boolean) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card || !interactive) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        video.pause();
        setPlaying(false);
      }
    }, { threshold: 0.65 });
    observer.observe(card);
    return () => { observer.disconnect(); video.pause(); };
  }, [interactive]);

  const toggleSave = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/edureels/saves", {
        method: reel.saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId: reel.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save reel");
      onSaved(reel.id, result.saved);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save reel");
    } finally { setBusy(false); }
  };

  const report = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/edureels/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId: reel.id, reason }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not report reel");
      setReportOpen(false);
      setReason("");
      setMessage("Report sent to your campus assistant.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not report reel");
    } finally { setBusy(false); }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { video.pause(); setPlaying(false); }
  };

  return (
    <article ref={cardRef} className="relative mx-auto flex h-[min(78dvh,780px)] w-full max-w-[440px] snap-center overflow-hidden rounded-[1.75rem] border border-white/15 bg-black shadow-2xl shadow-black/40">
      <video ref={videoRef} src={reel.videoUrl} muted={muted} loop playsInline preload="metadata"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        className="h-full w-full object-contain" aria-label={reel.title} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black via-black/75 to-transparent" />
      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        {reel.relevance === "Campus" ? reel.subject : `${reel.relevance} · ${reel.subject}`}
      </div>
      <div className="absolute right-4 top-4 flex gap-2">
        <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause video" : "Play video"}
          className="rounded-full bg-black/65 p-2 text-white backdrop-blur-sm">{playing ? <Pause size={18} /> : <Play size={18} />}</button>
        <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Unmute" : "Mute"}
          className="rounded-full bg-black/65 p-2 text-white backdrop-blur-sm">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
      </div>
      <div className="absolute bottom-5 left-5 right-16 space-y-2 text-white">
        <p className="text-xs font-semibold text-violet-200">{reel.semester} · {reel.section} · {reel.author.name}</p>
        <h3 className="text-xl font-extrabold leading-tight">{reel.title}</h3>
        <p className="text-sm text-slate-200"><span className="font-bold text-white">Learn: </span>{reel.learningOutcome}</p>
        {reel.description && <p className="line-clamp-2 text-xs text-slate-300">{reel.description}</p>}
        {reel.status !== "APPROVED" && <p className="inline-block rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-100">
          {reel.status}{reel.reviewReason ? ` · ${reel.reviewReason}` : ""}
        </p>}
      </div>
      {interactive && <div className="absolute bottom-6 right-3 flex flex-col items-center gap-4 text-white">
        <button type="button" disabled={busy} onClick={toggleSave} aria-label={reel.saved ? "Remove saved reel" : "Save reel"}
          className={`rounded-full bg-black/60 p-3 backdrop-blur-sm ${reel.saved ? "text-violet-300" : "text-white"}`}><Bookmark size={22} fill={reel.saved ? "currentColor" : "none"} /></button>
        <span className="-mt-3 text-xs">{reel.saves}</span>
        {reel.author.id !== viewerId && <button type="button" disabled={busy} onClick={() => setReportOpen((value) => !value)} aria-label="Report reel"
          className="rounded-full bg-black/60 p-3 backdrop-blur-sm"><Flag size={20} /></button>}
      </div>}
      {reportOpen && <div className="absolute inset-x-4 top-16 rounded-2xl border border-white/20 bg-[#171720]/95 p-4 shadow-xl">
        <label className="block text-sm font-semibold text-white">Why are you reporting this reel?
          <textarea value={reason} maxLength={300} onChange={(event) => setReason(event.target.value)} rows={3}
            className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 p-2 text-white" />
        </label>
        <button type="button" disabled={busy || reason.trim().length < 10} onClick={report}
          className="mt-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Submit report</button>
      </div>}
      {message && <div role="status" className="absolute left-3 right-3 top-16 rounded-lg bg-[#252533]/95 p-2 text-center text-xs text-white">{message}</div>}
    </article>
  );
}
