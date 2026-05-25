"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  openInBrowser,
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";
import GradeModalHeader from "./submissions/modal/GradeModalHeader";
import SubmissionPreview from "./submissions/modal/SubmissionPreview";
import AIAssistantSection from "./submissions/modal/AIAssistantSection";
import GradeSection from "./submissions/modal/GradeSection";
import FeedbackSection from "./submissions/modal/FeedbackSection";
import ModalFooter from "./submissions/modal/ModalFooter";

export default function GradeSubmissionModal({
  isOpen,
  onClose,
  onSuccess,
  submission,
  allSubmissions,
  onNavigate,
  totalMarks,
  dueDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  submission: any;
  allSubmissions: any[];
  onNavigate: (sub: any) => void;
  totalMarks: number | null;
  dueDate: string | null;
}) {
  const [grade, setGrade] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [gradeMode, setGradeMode] = useState<"manual" | "rubric">("manual");
  const [feedbackMode, setFeedbackMode] = useState<"text" | "audio">("text");
  const [rubric, setRubric] = useState({
    concept: 0,
    execution: 0,
    formatting: 0,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string[];
    aiProbability: number;
  } | null>(null);
  const [attachSignature, setAttachSignature] = useState(false);

  const currentIndex =
    allSubmissions?.findIndex((s) => s.id === submission?.id) ?? -1;

  const hasNext =
    currentIndex !== -1 && currentIndex < (allSubmissions?.length || 0) - 1;

  const isLate =
    dueDate && new Date(submission?.submittedAt) > new Date(dueDate);

  useEffect(() => {
    if (isOpen && submission) {
      setTeacherId(localStorage.getItem("teacherId"));
      setGrade(submission?.grade?.toString() || "");
      setFeedback(submission?.feedback || "");
      setGradeMode("manual");
      setFeedbackMode("text");
      setRubric({ concept: 0, execution: 0, formatting: 0 });
      setAttachSignature(true);

      if (
        submission.aiSummary?.length > 0 &&
        submission.aiProbability !== null
      ) {
        setAnalysisResult({
          summary: submission.aiSummary,
          aiProbability: submission.aiProbability,
        });
      } else {
        setAnalysisResult(null);
      }
    }
  }, [isOpen, submission]);

  useEffect(() => {
    if (gradeMode === "rubric") {
      const total =
        (rubric.concept || 0) +
        (rubric.execution || 0) +
        (rubric.formatting || 0);
      setGrade(total.toString());
    }
  }, [rubric, gradeMode]);

  const runAIAnalysis = async () => {
    if (!teacherId || !submission.id) {
      return;
    }

    setIsAnalyzing(true);
    const toastId = showLoadingMessage("AI is analyzing the document....");

    try {
      const response = await fetch("/api/teacher/submissions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
          teacherId: teacherId,
        }),
      });

      const data = await response.json();
      toastDissmisser(toastId);

      if (response.ok) {
        showSuccessMessage("Analysis Completed!");
        setAnalysisResult({
          summary: data.summary,
          aiProbability: data.aiProbability,
        });
      } else {
        showErrorMessage(data.error || "AI Analysis Failed");
      }
    } catch (error: any) {
      toastDissmisser(toastId);
      showErrorMessage(error.message || "Network Error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveGradeToDB = async () => {
    if (!teacherId) throw new Error("Session expired. Please Log in again.");

    let finalAudioUrl = null;
    const numericGrade = parseFloat(grade);

    if (grade === "" || isNaN(numericGrade)) {
      throw new Error("Please enter a valid numeric grade.");
    }

    if (totalMarks && numericGrade > totalMarks) {
      throw new Error(`Grade cannot be greater than ${totalMarks}`);
    }

    if (feedbackMode === "audio" && audioBlob) {
      const toastId = showLoadingMessage("Uploading audio note....");

      try {
        const formData = new FormData();

        formData.append("file", audioBlob, "feedback.webm");
        formData.append("upload_preset", "ClassifyAI-pdf");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/dd2bczbdo/video/upload`,
          { method: "POST", body: formData },
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error.message || "Audio upload failed");
        }

        finalAudioUrl = uploadData.secure_url;
        toastDissmisser(toastId);
        showSuccessMessage("Audio Uploaded");
      } catch (error) {
        toastDissmisser(toastId);
        throw new Error("Failed to upload audio feedback.");
      }
    }

    const response = await fetch(`/api/teacher/submissions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: submission.id,
        teacherId: teacherId,
        grade: numericGrade,
        feedback: feedbackMode === "text" ? feedback : "",
        audioFeedbackUrl: finalAudioUrl,
        attachSignature,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to Save Grade");
    }

    return data;
  };

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = showLoadingMessage("Saving Grade...");

    try {
      await saveGradeToDB();
      toastDissmisser(toastId);
      showSuccessMessage("Grade saved successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toastDissmisser(toastId);
      showErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndNext = async () => {
    setIsNextLoading(true);
    const toastId = showLoadingMessage("Saving and moving to next...");

    try {
      await saveGradeToDB();
      toastDissmisser(toastId);
      showSuccessMessage("Grade Saved!");
      onSuccess();

      if (hasNext) {
        onNavigate(allSubmissions[currentIndex + 1]);
      } else {
        onClose();
      }
    } catch (error: any) {
      toastDissmisser(toastId);
      showErrorMessage(error.message || "Internal Server Error");
    } finally {
      setIsNextLoading(false);
    }
  };

  const getPlagiarismColor = (probability: number) => {
    if (probability < 20)
      return "text-emerald-300 bg-emerald-500/10 border-emerald-300/20";
    if (probability < 50)
      return "text-amber-300 bg-amber-500/10 border-amber-300/20";
    return "text-red-300 bg-red-500/10 border-red-300/20";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative flex h-[92vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl 2xl:max-w-[92vw]"
          initial={{ scale: 0.95, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 24, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/7 to-cyan-400/6" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/8 blur-3xl" />

          <div className="relative z-10 border-b border-white/10 px-5 py-5 sm:px-6">
            <GradeModalHeader submission={submission} isLate={isLate} />
          </div>

          <div className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-hidden p-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] sm:p-6">
            <section className="min-h-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 shadow-xl shadow-black/20">
              <div className="h-full overflow-y-auto p-4 scrollbar-hide sm:p-5">
                <SubmissionPreview
                  submission={submission}
                  openInBrowser={openInBrowser}
                />
              </div>
            </section>

            <section className="min-h-0 overflow-y-auto space-y-5 pr-1 scrollbar-hide">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 sm:p-5">
                <GradeSection
                  grade={grade}
                  setGrade={setGrade}
                  gradeMode={gradeMode}
                  setGradeMode={setGradeMode}
                  rubric={rubric}
                  setRubric={setRubric}
                  totalMarks={totalMarks}
                />
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 sm:p-5">
                <FeedbackSection
                  feedback={feedback}
                  setFeedback={setFeedback}
                  feedbackMode={feedbackMode}
                  setFeedbackMode={setFeedbackMode}
                  attachSignature={attachSignature}
                  setAttachSignature={setAttachSignature}
                  submission={submission}
                  setAudioBlob={setAudioBlob}
                />
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-4 shadow-xl shadow-black/20 sm:p-5">
                <AIAssistantSection
                  analysisResult={analysisResult}
                  isAnalyzing={isAnalyzing}
                  runAIAnalysis={runAIAnalysis}
                  getPlagiarismColor={getPlagiarismColor}
                />
              </div>
            </section>
          </div>

          <div className="relative z-10 border-t border-white/10 bg-[#14141B]/90 px-5 py-4 backdrop-blur-2xl sm:px-6">
            <ModalFooter
              onClose={onClose}
              handleSave={handleSave}
              handleSaveAndNext={handleSaveAndNext}
              isLoading={isLoading}
              isNextLoading={isNextLoading}
              hasNext={hasNext}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
