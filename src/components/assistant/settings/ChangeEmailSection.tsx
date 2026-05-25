"use client";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChangeEmailSection() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"request" | "verify">("request");
  const [assistantId, setAssistantId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("assistantId");
    setAssistantId(id);
    const fetchAssistantEmail = async () => {
      if (!id) {
        showErrorMessage("Could not verify your session. Please log in again.");
        return;
      }
      try {
        const res = await fetch(
          `/api/assistant/settings/email?assistantId=${id}`,
        );
        const data = await res.json();
        if (res.ok) {
          setCurrentEmail(data.email);
        } else {
          showErrorMessage(data.error || "Failed to load email.");
        }
      } catch (error) {
        console.log(error);
        showErrorMessage("Something went wrong while fetching email.");
      }
    };

    fetchAssistantEmail();
  }, []);

  const handleRequestVerification = async () => {
    if (!newEmail.trim()) {
      showErrorMessage("Please enter a new email.");
      return;
    }

    if (!assistantId) {
      showErrorMessage("Could not verify your identity. Please log in again.");
      return;
    }

    setLoading(true);
    showLoadingMessage("Sending verification code...");
    try {
      const res = await fetch(
        "/api/assistant/settings/email/request-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newEmail, assistantId }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        showSuccessMessage("Verification code sent to both emails.");
        setStep("verify");
      } else {
        showErrorMessage(data.error || "Failed to send verification code.");
      }
    } catch {
      showErrorMessage("Something went wrong while requesting verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndUpdate = async () => {
    if (!verificationCode.trim()) {
      showErrorMessage("Please enter the verification code.");
      return;
    }
    if (!assistantId) {
      showErrorMessage("Could not verify your identity. Please log in again.");
      return;
    }

    setLoading(true);
    showLoadingMessage("Verifying and updating...");
    try {
      // Step 1: Verify the code
      const verifyRes = await fetch(
        "/api/assistant/settings/email/verify-code",
        {
          // Assuming this is the correct verify path
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: verificationCode, assistantId }), // Also send assistantId to verify against the correct redis key
        },
      );

      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(
          data.error ||
            "Verification failed. The code may be incorrect or expired.",
        );
      }

      // Step 2: If verification succeeds, update the email
      const updateRes = await fetch("/api/assistant/settings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, newEmail }),
      });

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        throw new Error(
          updateData.error || "Failed to update email after verification.",
        );
      }

      showSuccessMessage("Admin email updated successfully.");
      setCurrentEmail(newEmail);
      setNewEmail("");
      setVerificationCode("");
      setStep("request");
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative min-h-[75vh] overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(75vh-3rem)] flex-col">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
            Secure Settings
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl "
            >
              Change Admin Email
            </motion.h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Update the admin email after verifying the security code sent to
              your registered inboxes.
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 py-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                  Current Email
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-4">
                  <p className="break-all text-sm font-bold text-slate-100">
                    {currentEmail || (
                      <span className="inline-flex animate-pulse text-slate-500">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 p-4 text-sm leading-6 text-violet-100">
                Verification is required before your admin email can be changed.
                Keep the code private and complete the update from this panel.
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101014]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-400/5" />

            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    step === "request" ? "bg-violet-300" : "bg-emerald-300"
                  }`}
                />
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  {step === "request"
                    ? "Step 1 · Request Code"
                    : "Step 2 · Verify Code"}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === "request" && (
                  <motion.div
                    key="request"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        autoComplete="off"
                        placeholder="Enter new email"
                        className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRequestVerification}
                      disabled={loading}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Sending…" : "Send Verification Code"}
                    </motion.button>
                  </motion.div>
                )}

                {step === "verify" && (
                  <motion.div
                    key="verify"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter verification code"
                        className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleVerifyAndUpdate}
                      disabled={loading}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-5 py-3 text-sm font-extrabold text-emerald-200 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/45 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Verifying…" : "Verify & Update"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
