"use client";

import { CourseOption } from "./types";
import { Loader2, UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";

async function checkVideo(file: File) {
  if (!/(\.mp4|\.webm)$/i.test(file.name) || file.size > 50 * 1024 * 1024) {
    throw new Error("Choose an MP4/WebM video under 50 MB.");
  }
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.preload = "metadata";
    const duration = await new Promise<number>((resolve, reject) => {
      video.onloadedmetadata = () => {
        if (video.videoWidth > video.videoHeight) reject(new Error("Record the video vertically."));
        else resolve(video.duration);
      };
      video.onerror = () => reject(new Error("This video could not be read."));
      video.src = url;
    });
    if (!Number.isFinite(duration) || duration < 3 || duration > 90) {
      throw new Error("The video must be between 3 and 90 seconds.");
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function UploadForm({ courses, role, onCreated }: {
  courses: CourseOption[];
  role: string;
  onCreated: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [outcome, setOutcome] = useState("");
  const [description, setDescription] = useState("");
  const [courseIndex, setCourseIndex] = useState(0);
  const [step, setStep] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const course = courses[courseIndex];
    if (!file || !course) return;
    setError("");
    try {
      setStep("Checking your video...");
      await checkVideo(file);
      setStep("Preparing a secure upload...");
      const signedResponse = await fetch("/api/edureels/uploads/sign", { method: "POST" });
      const signed = await signedResponse.json();
      if (!signedResponse.ok) throw new Error(signed.error || "Could not prepare upload");

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signed.apiKey);
      body.append("timestamp", String(signed.timestamp));
      body.append("public_id", signed.publicId);
      body.append("overwrite", String(signed.overwrite));
      body.append("signature", signed.signature);
      setStep("Uploading video to Cloudinary...");
      const uploadedResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`,
        { method: "POST", body },
      );
      const uploaded = await uploadedResponse.json();
      if (!uploadedResponse.ok) throw new Error(uploaded.error?.message || "Video upload failed");
      if (uploaded.public_id !== signed.publicId) throw new Error("Unexpected upload response");

      setStep("Saving reel details...");
      const response = await fetch("/api/edureels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, learningOutcome: outcome,
          subjectId: course.subjectId, semesterId: course.semesterId,
          sectionId: course.sectionId, videoPublicId: signed.publicId,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit reel");
      setTitle("");
      setDescription("");
      setOutcome("");
      setFile(null);
      const fileInput = document.getElementById("edureel-video") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      onCreated();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed. Please try again.");
    } finally {
      setStep("");
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-8">
      <div>
        <h2 className="text-2xl font-bold">Create a learning reel</h2>
        <p className="mt-2 text-sm text-slate-400">
          {role === "STUDENT"
            ? "Your reel will appear in the feed after a subject teacher or campus assistant approves it."
            : "Your assigned class reel will publish when you submit it."}
        </p>
      </div>
      <label className="block text-sm font-semibold text-slate-200">
        Class and subject
        <select value={courseIndex} onChange={(event) => setCourseIndex(Number(event.target.value))}
          disabled={!courses.length || !!step}
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#1B1B25] px-4 py-3 text-white">
          {courses.map((course, index) => (
            <option key={`${course.subjectId}-${course.semesterId}-${course.sectionId}`} value={index}>
              {course.subject.name} · {course.semester.name} · {course.section.name}
            </option>
          ))}
        </select>
      </label>
      {!courses.length && <p className="rounded-xl bg-amber-500/10 p-4 text-sm text-amber-200">No subjects are assigned to your class yet.</p>}
      <label className="block text-sm font-semibold text-slate-200">Title
        <input required minLength={4} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)}
          placeholder="Binary search in 60 seconds" className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 outline-none focus:border-violet-400" />
      </label>
      <label className="block text-sm font-semibold text-slate-200">What will students learn?
        <input required minLength={5} maxLength={160} value={outcome} onChange={(event) => setOutcome(event.target.value)}
          placeholder="Understand how binary search halves the search space" className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 outline-none focus:border-violet-400" />
      </label>
      <label className="block text-sm font-semibold text-slate-200">Description <span className="font-normal text-slate-500">(optional)</span>
        <textarea maxLength={500} rows={3} value={description} onChange={(event) => setDescription(event.target.value)}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 outline-none focus:border-violet-400" />
      </label>
      <label className="block text-sm font-semibold text-slate-200">Video
        <input id="edureel-video" required type="file" accept="video/mp4,video/webm,.mp4,.webm" onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="mt-2 block w-full rounded-xl border border-dashed border-violet-300/30 bg-violet-500/5 p-4 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-violet-500 file:px-3 file:py-2 file:font-bold file:text-white" />
        <span className="mt-2 block text-xs font-normal text-slate-400">Vertical MP4 or WebM · 3–90 seconds · maximum 50 MB</span>
      </label>
      {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <button type="submit" disabled={!!step || !courses.length || !file}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50">
        {step ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
        {step || (role === "STUDENT" ? "Submit for review" : "Publish reel")}
      </button>
    </form>
  );
}
