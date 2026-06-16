"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import {
  CheckCircle2,
  Loader2,
  ScanFace,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { showErrorMessage, showSuccessMessage } from "@/lib/helper";

export default function FaceVerificationModal({
  studentId,
  avatarUrl,
  onSuccess,
}: {
  studentId: string;
  avatarUrl: string;
  onSuccess: () => void;
}) {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("Loading AI models...");
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const startCamera = async () => {
    setCameraError("");
    setFeedback("Requesting camera permission...");
    setIsCameraStarted(true);
  };

  // Load AI models from /public/models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoaded(true);
        setFeedback("Align your face in the circle.");
      } catch (error) {
        console.error("Failed to load models:", error);
        setFeedback("Error loading AI models. Please refresh.");
        showErrorMessage("Can't Load AI models, try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const handleVerify = useCallback(async () => {
    console.log("VERIFY STATE:", {
      isCameraStarted,
      isCameraReady,
      webcam: Boolean(webcamRef.current),
    });
    if (!isCameraStarted || !isCameraReady) {
      showErrorMessage("Please start camera first.");
      return;
    }
    if (!isModelsLoaded || isVerified || !webcamRef.current) return;

    setIsLoading(true);
    setFeedback("Analyzing...");

    try {
      const referenceImage = await faceapi.fetchImage(avatarUrl);
      const liveImage = webcamRef.current.getCanvas();

      if (!liveImage) throw new Error("Could not capture camera image.");

      const referenceDetection = await faceapi
        .detectSingleFace(referenceImage, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      const liveDetection = await faceapi
        .detectSingleFace(liveImage, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!referenceDetection) {
        throw new Error("No face found in your profile picture.");
      }

      if (!liveDetection) {
        throw new Error(
          "No face detected in camera. Ensure good lighting and try again.",
        );
      }

      const faceMatcher = new faceapi.FaceMatcher(
        referenceDetection.descriptor,
      );
      const bestMatch = faceMatcher.findBestMatch(liveDetection.descriptor);

      if (bestMatch.distance <= 0.5) {
        setIsVerified(true);
        setFeedback("✅ Verification Successful!");
        showSuccessMessage("Face verified successfully!");

        setTimeout(() => onSuccess(), 1500);
      } else {
        throw new Error("Faces do not match. Try again.");
      }
    } catch (err: any) {
      setFeedback(err.message);
      showErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    isCameraStarted,
    isCameraReady,
    isModelsLoaded,
    isVerified,
    avatarUrl,
    onSuccess,
  ]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/80 p-4 text-white backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 app-shell-bg opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 p-6 text-center shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-cyan-400/8" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Secure Session Check
          </div>

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-violet-950/30">
            {isVerified ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-300" />
            ) : (
              <ScanFace className="h-8 w-8 text-violet-200" />
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Face Verification
          </h1>

          <p
            className={`mx-auto mt-3 max-w-sm text-sm leading-6 ${
              isVerified
                ? "font-bold text-emerald-300"
                : isLoading
                  ? "text-violet-200"
                  : "text-slate-400"
            }`}
          >
            {feedback}
          </p>

          <div className="mx-auto mt-7 max-w-xs">
            <div
              className={`relative aspect-square overflow-hidden rounded-full border-4 shadow-2xl transition duration-300 ${
                isVerified
                  ? "border-emerald-300/45 shadow-emerald-950/30"
                  : "border-violet-300/35 shadow-violet-950/35"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 z-10 rounded-full ring-1 ring-inset ring-white/10" />

              {isCameraStarted ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="h-full w-full object-cover"
                  mirrored
                  videoConstraints={{
                    facingMode: "user",
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                  }}
                  onUserMedia={() => {
                    console.log("Camera permission granted");
                    setIsCameraReady(true);
                    setIsCameraStarted(true);
                    setCameraError("");
                    setFeedback("Align your face in the circle.");
                  }}
                  onUserMediaError={(error) => {
                    console.error("Camera permission/error:", error);
                    setIsCameraReady(false);
                    setCameraError("Camera permission denied or unavailable.");
                    setFeedback("Camera permission denied or unavailable.");
                    showErrorMessage(
                      "Camera permission denied or unavailable.",
                    );
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/40 text-center text-sm text-slate-300">
                  Allow camera access and click "Start Camera" to begin
                  verification.
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-10 top-8 z-10 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              <div className="pointer-events-none absolute inset-x-10 bottom-8 z-10 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              <div className="pointer-events-none absolute inset-y-10 left-8 z-10 w-px bg-gradient-to-b from-transparent via-white/45 to-transparent" />
              <div className="pointer-events-none absolute inset-y-10 right-8 z-10 w-px bg-gradient-to-b from-transparent via-white/45 to-transparent" />
            </div>
          </div>

          <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-start gap-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-sm font-extrabold text-white">
                  Verification Required
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Keep your face clearly visible and use good lighting for a
                  faster match.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={isCameraStarted ? handleVerify : startCamera}
            disabled={
              isLoading ||
              !isModelsLoaded ||
              isVerified ||
              (isCameraStarted && !isCameraReady)
            }
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-extrabold transition duration-300 ${
              isVerified
                ? "cursor-default border border-emerald-300/20 bg-emerald-500/15 text-emerald-200"
                : "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 text-white shadow-xl shadow-violet-950/40 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isVerified ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <ScanFace className="h-4 w-4" />
            )}

            {isLoading
              ? feedback
              : isVerified
                ? "Verified!"
                : !isCameraStarted
                  ? "Start Camera"
                  : "Verify Face"}
          </button>
        </div>
      </div>
    </div>
  );
}
