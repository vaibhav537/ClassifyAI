"use client";

import { AudioRecorderProps } from "@/lib/types";
import { Mic, Square, Trash2, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AudioRecorder({ onAudioReady }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioReady(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timeRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record feedback.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      if (timeRef.current) clearInterval(timeRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    onAudioReady(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        {!audioUrl ? (
          <div className="flex flex-col items-center gap-5 text-center">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full border transition duration-300 ${
                isRecording
                  ? "border-red-300/30 bg-red-500/15 text-red-300 shadow-xl shadow-red-950/20"
                  : "border-violet-300/25 bg-violet-500/10 text-violet-200 shadow-xl shadow-violet-950/20 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20 hover:text-white"
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-0 rounded-full blur-2xl ${
                  isRecording ? "bg-red-500/25" : "bg-violet-500/25"
                }`}
              />

              {isRecording && (
                <span className="absolute inset-[-8px] animate-ping rounded-full border border-red-300/20" />
              )}

              {isRecording ? (
                <Square className="relative z-10 h-7 w-7" fill="currentColor" />
              ) : (
                <Mic className="relative z-10 h-8 w-8" />
              )}
            </button>

            <div>
              <p
                className={`text-sm font-extrabold tracking-wide ${
                  isRecording ? "text-red-300" : "text-white"
                }`}
              >
                {isRecording
                  ? `Recording • ${formatTime(recordingTime)}`
                  : "Start Voice Recording"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {isRecording
                  ? "Tap stop when your feedback is complete."
                  : "Tap mic and allow microphone permission."}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                <Volume2 className="h-5 w-5 text-violet-200" />
              </div>

              <div>
                <p className="text-sm font-extrabold text-white">
                  Audio Feedback Ready
                </p>
                <p className="text-xs text-slate-500">
                  Review or delete this recording.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <audio
                src={audioUrl}
                controls
                className="h-10 w-full rounded outline-none opacity-90"
              />

              <button
                type="button"
                onClick={deleteRecording}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
                title="Delete recording"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
