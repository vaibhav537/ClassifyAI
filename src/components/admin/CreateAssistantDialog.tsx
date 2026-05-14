"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tektur } from "next/font/google";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";

const tektur = Tektur({
  subsets: ["latin"],
  weight: ["600"],
});

export default function CreateAssistantDialog({
  isOpen,
  onClose,
  onActionComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onActionComplete: () => void;
}) {
  const [assistantName, setAssistantName] = useState("");
  const [assistantEmail, setAssistantEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [adminID, setAdminID] = useState("admin123"); // default fallback

  useEffect(() => {
    const storedId = localStorage.getItem("adminId");
    if (storedId) {
      setAdminID(storedId);
    }
  }, []);

  const resetForm = () => {
    setAssistantName("");
    setAssistantEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      showErrorMessage("Admin ID not found. Please login again.");
      return;
    }
    setIsLoading(true);
    const toastID = showLoadingMessage("Creating assistant account...");

    try {
      const response = await fetch("/api/admin/add-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminID,
          assistantName,
          assistantEmail,
        }),
      });

      const data = await response.json();
      toastDissmisser(toastID);
      if (!response.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      showSuccessMessage("Assistant created successfully!");
      resetForm();
      onActionComplete();
      onClose();
    } catch (err: any) {
      toastDissmisser(toastID);
      showErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            className={`text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-500 bg-clip-text text-transparent mb-4 ${tektur.className}`}
          >
            Create New Assistant
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            This will create a new Campus Admin account and send them a welcome
            email with valid ID.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Assistant Full Name"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              required
              className="w-full bg-neutral-900/70 border border-gray-700/40 p-3 rounded-md focus:ring-2 focus:ring-cyan-400 outline-none transition"
            />

            <input
              type="email"
              placeholder="Assistant Email Address"
              value={assistantEmail}
              autoComplete="off"
              onChange={(e) => setAssistantEmail(e.target.value)}
              required
              className="w-full bg-neutral-900/70 border border-gray-700/40 p-3 rounded-md focus:ring-2 focus:ring-cyan-400 outline-none transition"
            />

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="py-2 px-4 bg-white/10 hover:bg-white/20 text-gray-300 font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="py-2 px-4 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 font-semibold rounded-md shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Campus"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
