"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
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

      if (!referenceDetection)
        throw new Error("No face found in your profile picture.");
      if (!liveDetection)
        throw new Error(
          "No face detected in camera. Ensure good lighting and try again.",
        );

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
  }, [isModelsLoaded, isVerified, avatarUrl, onSuccess]);
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#06141b]/90 to-[#1b3b4c]/90 border border-cyan-400/20 p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center transition-all duration-300">
        <h1 className="text-3xl font-bold text-cyan-300 drop-shadow">
          Face Verification
        </h1>
        <p
          className={`mt-3 mb-6 text-sm ${
            isVerified ? "text-green-400 font-semibold" : "text-gray-300"
          }`}
        >
          {feedback}
        </p>

        {/* Webcam Frame */}
        <div className="w-full aspect-square bg-black/40 rounded-full overflow-hidden mx-auto max-w-xs border-4 border-cyan-400/40 shadow-lg transition-all">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "user" }}
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || !isModelsLoaded || isVerified}
          className={`mt-6 w-full font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-300 ${
            isVerified
              ? "bg-green-600/80 text-white cursor-default"
              : "bg-cyan-600 hover:bg-cyan-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          }`}
        >
          {isLoading ? feedback : isVerified ? "Verified!" : "Verify Face"}
        </button>
      </div>
    </div>
  );
}
