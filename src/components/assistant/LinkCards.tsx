"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { Tektur } from "next/font/google";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  Plus,
  Trash2,
  UserPlus,
  UserRoundCog,
  UserRoundMinus,
  Users,
  X,
} from "lucide-react";

const tektur = Tektur({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const inputClass = `${tektur.className} w-full rounded-2xl border border-white/10 bg-[#08080C]/65 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:bg-[#08080C]/85 disabled:cursor-not-allowed disabled:opacity-60`;

const LinkCards = ({
  forRole,
  onActionComplete,
}: {
  forRole: "student" | "teacher";
  onActionComplete?: () => void;
}) => {
  const [modalOpen, setModalOpen] = useState<"add" | "remove" | null>(null);
  const [loading, setLoading] = useState(false);
  const [campusId, setCampusId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    year: "",
    semester: "",
    section: "",
    designation: "",
    department: "",
  });

  const [hodTeaches, setHodTeaches] = useState(true);
  const [assistantId, setAssistantId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [emailVerified, setEmailVerified] = useState(false);

  const [currentSubject, setCurrentSubject] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [assignedSubjects, setAssignedSubjects] = useState<
    { name: string; code?: string; description?: string }[]
  >([]);

  const [message, setMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  useEffect(() => {
    const assistantID = localStorage.getItem("assistantId");
    const storedCampusId =
      localStorage.getItem("CampusID") || localStorage.getItem("campusId");

    if (assistantID) {
      setAssistantId(assistantID);
    }

    if (storedCampusId) {
      setCampusId(storedCampusId);
    }
  }, []);

  const { data: recentUser, isLoading: loadingRecent } = useSWR(
    campusId
      ? `/api/assistant/recent-user?role=${forRole.toUpperCase()}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const handleSendOtp = async () => {
    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!normalizedEmail) {
      setMessage({ type: "error", text: "Please enter email" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/mail/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    if (res.ok) {
      setFormData((prev) => ({ ...prev, email: normalizedEmail }));
      setStep("otp");
      setMessage({
        type: "success",
        text: "OTP sent. Please check Inbox, Spam, Promotions, or Updates folder.",
      });
    } else {
      setMessage({
        type: "error",
        text: "Failed to send OTP. Please try again after a few seconds.",
      });
    }

    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage({ type: "error", text: "Please enter OTP" });
      return;
    }

    setLoading(true);

    const res = await fetch("/api/mail/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, otp }),
    });

    if (res.ok) {
      setEmailVerified(true);
      setStep("form");
      setMessage({ type: "success", text: "Email verified" });
    } else {
      setMessage({ type: "error", text: "Invalid OTP" });
    }

    setLoading(false);
  };

  const handleAddSubject = () => {
    if (currentSubject.name.trim() === "") return;

    setAssignedSubjects([...assignedSubjects, currentSubject]);
    setCurrentSubject({ name: "", code: "", description: "" });
  };

  const handleRemoveSubject = (index: number) => {
    setAssignedSubjects(assignedSubjects.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (modalOpen === "add" && !emailVerified) {
      setMessage({ type: "error", text: "Please verify email first" });
      return;
    }

    if (!formData.name || !formData.email) {
      setMessage({ type: "error", text: "Name & Email are required" });
      return;
    }

    if (forRole === "teacher" && modalOpen === "add") {
      if (!formData.designation) {
        setMessage({ type: "error", text: "Please select designation" });
        return;
      }

      if (
        (formData.designation !== "HOD" || hodTeaches) &&
        assignedSubjects.length === 0
      ) {
        setMessage({
          type: "error",
          text: "Please assign at least one subject",
        });
        return;
      }
    }

    setLoading(true);

    const res = await fetch(`/api/assistant/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: modalOpen,
        name: formData.name,
        email: formData.email,
        role: forRole.toUpperCase(),
        branch: forRole === "student" ? formData.branch : undefined,
        year: forRole === "student" ? formData.year : undefined,
        semester: formData.semester,
        section: formData.section,
        department: modalOpen === "add" ? formData.department : undefined,
        designation:
          modalOpen === "add" && forRole === "teacher"
            ? formData.designation
            : undefined,
        assignedSubjects:
          forRole === "teacher" &&
          (formData.designation !== "HOD" || hodTeaches)
            ? assignedSubjects
            : [],
        adminID: assistantId,
      }),
    });

    if (res.ok) {
      setMessage({
        type: "success",
        text: `${modalOpen === "add" ? "Added" : "Removed"} successfully`,
      });
      onActionComplete?.();

      setTimeout(() => {
        closeModal();
      }, 1500);
    } else {
      setMessage({ type: "error", text: "Action failed" });
    }

    setLoading(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    if (modalOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const closeModal = () => {
    setModalOpen(null);
    setMessage(null);
    setFormData({
      name: "",
      email: "",
      branch: "",
      year: "",
      semester: "",
      section: "",
      designation: "",
      department: "",
    });
    setOtp("");
    setStep("form");
    setEmailVerified(false);
    setCurrentSubject({ name: "", code: "", description: "" });
    setAssignedSubjects([]);
    setHodTeaches(true);
  };

  useEffect(() => {
    if (formData.designation === "HOD") {
      setHodTeaches(true);
    }
  }, [formData.designation]);

  const roleLabel = forRole === "student" ? "Student" : "Teacher";
  const isTeacher = forRole === "teacher";
  const isAddMode = modalOpen === "add";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative h-full min-h-[250px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:border-violet-300/35 hover:bg-white/[0.055]"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition duration-300 group-hover:bg-violet-500/15" />

        <div className="relative z-10 flex h-full flex-col justify-between gap-5">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-200">
                  {isTeacher ? (
                    <UserRoundCog className="h-3.5 w-3.5" />
                  ) : (
                    <Users className="h-3.5 w-3.5" />
                  )}
                  {roleLabel} Access
                </span>

                <h5
                  className={`mt-4 text-xl font-extrabold tracking-tight text-white ${tektur.className}`}
                >
                  Manage {roleLabel}
                </h5>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add verified users or remove existing {forRole} records from
                  this campus.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10">
                {isTeacher ? (
                  <UserRoundCog className="h-5 w-5 text-cyan-200" />
                ) : (
                  <UserPlus className="h-5 w-5 text-cyan-200" />
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-xs font-extrabold text-emerald-300 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/20"
                onClick={() => setModalOpen("add")}
              >
                <Plus className="h-4 w-4" />
                Add
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-xs font-extrabold text-red-300 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20"
                onClick={() => setModalOpen("remove")}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              Recent Activity
            </div>

            <div className="mt-3">
              {loadingRecent && (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </p>
              )}

              {!loadingRecent && recentUser?.name ? (
                <p className="text-sm leading-6 text-slate-400">
                  Added{" "}
                  <strong className="font-extrabold text-violet-200">
                    {recentUser.name}
                  </strong>{" "}
                  <span className="text-xs text-slate-600">
                    ({new Date(recentUser.createdAt).toLocaleDateString()})
                  </span>
                </p>
              ) : (
                !loadingRecent && (
                  <p className="text-sm font-semibold text-slate-500">
                    No recent {forRole} found.
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <ModalPortal>
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999] grid place-items-center overflow-hidden bg-[#08080C]/95 p-3 text-white backdrop-blur-2xl sm:p-5"
              onClick={closeModal}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_center,rgba(217,70,239,0.05),transparent_38%)]" />

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                <div className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
                        isAddMode
                          ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
                          : "border-red-300/20 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {isAddMode ? (
                        <UserPlus className="h-3.5 w-3.5" />
                      ) : (
                        <UserRoundMinus className="h-3.5 w-3.5" />
                      )}
                      {isAddMode ? "Add User" : "Remove User"}
                    </span>

                    <h2
                      className={`mt-3 text-2xl font-extrabold tracking-tight text-white ${tektur.className}`}
                    >
                      {isAddMode ? "Add" : "Remove"} {roleLabel}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {isAddMode
                        ? "Verify email and complete required profile details."
                        : "Enter user details to remove this profile."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-5 scrollbar-hide sm:p-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={inputClass}
                      disabled={loading}
                    />

                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputClass}
                      disabled={loading}
                    />
                  </div>

                  {isTeacher && (
                    <input
                      type="text"
                      placeholder="Department (e.g., EEE)"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          department: e.target.value,
                        })
                      }
                      className={`${inputClass} mt-3`}
                      disabled={loading}
                    />
                  )}

                  {isTeacher && isAddMode && (
                    <select
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      className={`${inputClass} mt-3 appearance-none text-slate-300`}
                      disabled={loading}
                    >
                      <option value="">Select Designation</option>
                      <option value="PROFESSOR">Professor</option>
                      <option value="ASSOCIATE_PROFESSOR">
                        Associate Professor
                      </option>
                      <option value="ASSISTANT_PROFESSOR">
                        Assistant Professor
                      </option>
                      <option value="LECTURER">Lecturer</option>
                      <option value="HOD">HOD</option>
                    </select>
                  )}

                  {formData.designation === "HOD" && (
                    <div className="mt-4 flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
                      <div>
                        <p className="text-sm font-extrabold text-white">
                          Does HOD teach subjects?
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Disable this if HOD has no assigned subjects.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setHodTeaches(!hodTeaches)}
                        className={`relative h-8 w-16 rounded-full border p-1 transition duration-300 ${
                          hodTeaches
                            ? "border-emerald-300/20 bg-emerald-500/20"
                            : "border-white/10 bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[9px] font-extrabold text-black transition duration-300 ${
                            hodTeaches ? "left-9" : "left-1"
                          }`}
                        >
                          {hodTeaches ? "Yes" : "No"}
                        </span>
                      </button>
                    </div>
                  )}

                  {forRole === "student" && isAddMode && (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Branch"
                        value={formData.branch}
                        autoComplete="off"
                        onChange={(e) =>
                          setFormData({ ...formData, branch: e.target.value })
                        }
                        className={inputClass}
                        disabled={loading}
                      />

                      <input
                        type="number"
                        placeholder="Year"
                        value={formData.year}
                        autoComplete="off"
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                        className={inputClass}
                        disabled={loading}
                      />

                      <input
                        type="text"
                        placeholder="Semester (e.g. Semester 1)"
                        value={formData.semester}
                        autoComplete="off"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            semester: e.target.value,
                          })
                        }
                        className={inputClass}
                        disabled={loading}
                      />

                      <input
                        type="text"
                        placeholder="Section (e.g. Section A)"
                        value={formData.section}
                        autoComplete="off"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            section: e.target.value,
                          })
                        }
                        className={inputClass}
                        disabled={loading}
                      />
                    </div>
                  )}

                  {isTeacher &&
                    isAddMode &&
                    (formData.designation !== "HOD" || hodTeaches) && (
                      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#08080C]/45 p-4">
                        <div className="mb-4 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-violet-200" />
                          <p className="text-sm font-extrabold text-white">
                            Assign Semester, Section & Subjects
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Semester (e.g., Semester 3)"
                            value={formData.semester}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                semester: e.target.value,
                              })
                            }
                            className={inputClass}
                            disabled={loading}
                          />

                          <input
                            type="text"
                            placeholder="Section (e.g., Section A)"
                            value={formData.section}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                section: e.target.value,
                              })
                            }
                            className={inputClass}
                            disabled={loading}
                          />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Subject Name"
                              value={currentSubject.name}
                              onChange={(e) =>
                                setCurrentSubject({
                                  ...currentSubject,
                                  name: e.target.value,
                                })
                              }
                              className={inputClass}
                              disabled={loading}
                            />

                            <input
                              type="text"
                              placeholder="Subject Code"
                              required
                              value={currentSubject.code}
                              onChange={(e) =>
                                setCurrentSubject({
                                  ...currentSubject,
                                  code: e.target.value,
                                })
                              }
                              className={inputClass}
                              disabled={loading}
                            />

                            <textarea
                              placeholder="Description"
                              value={currentSubject.description}
                              onChange={(e) =>
                                setCurrentSubject({
                                  ...currentSubject,
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                              className={`${inputClass} resize-none`}
                              disabled={loading}
                            />

                            <button
                              type="button"
                              onClick={handleAddSubject}
                              disabled={loading}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3 text-sm font-extrabold text-violet-200 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Plus className="h-4 w-4" />
                              Add Subject
                            </button>
                          </div>

                          <div className="flex min-h-[260px] flex-col rounded-[1.35rem] border border-white/10 bg-[#14141B]/75 p-3">
                            <p className="shrink-0 text-sm font-extrabold text-white">
                              Assigned Subjects ({assignedSubjects.length})
                            </p>

                            <div className="mt-3 min-h-0 flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                              {assignedSubjects.length > 0 ? (
                                assignedSubjects.map((sub, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-extrabold text-white">
                                        {sub.name}{" "}
                                        {sub.code && (
                                          <span className="text-violet-200">
                                            ({sub.code})
                                          </span>
                                        )}
                                      </p>
                                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                        {sub.description || "No description"}
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSubject(index)}
                                      className="shrink-0 rounded-xl border border-red-300/20 bg-red-500/10 px-2 py-1 text-red-300 transition hover:bg-red-500/20"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="grid h-full min-h-[190px] place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-center">
                                  <p className="text-xs font-semibold text-slate-500">
                                    No subjects added yet.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {isAddMode && step === "otp" && (
                    <div className="mt-4 rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                          <Mail className="h-4 w-4 text-violet-200" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold text-white">
                            OTP sent to {formData.email}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            Please check your inbox. If you don’t see it, check{" "}
                            <span className="font-extrabold text-amber-200">
                              Spam
                            </span>{" "}
                            folder too.
                          </p>
                        </div>
                      </div>

                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter OTP"
                        autoComplete="one-time-code"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className={`${inputClass} mt-4 tracking-[0.35em]`}
                        disabled={loading}
                      />
                    </div>
                  )}

                  {message && (
                    <div
                      className={`mt-4 flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-center text-sm font-extrabold ${
                        message.type === "success"
                          ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300"
                          : "border-red-300/20 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {message.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {message.text}
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex shrink-0 flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end sm:p-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  {isAddMode ? (
                    <>
                      {step === "form" && !emailVerified && (
                        <button
                          onClick={handleSendOtp}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                          {loading ? "Sending…" : "Send OTP"}
                        </button>
                      )}

                      {step === "otp" && (
                        <button
                          onClick={handleVerifyOtp}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          {loading ? "Verifying…" : "Verify OTP"}
                        </button>
                      )}

                      {emailVerified && (
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-5 py-3 text-sm font-extrabold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                          {loading ? "Processing…" : "Add"}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-extrabold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserRoundMinus className="h-4 w-4" />
                      )}
                      {loading ? "Processing…" : "Remove"}
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </>
  );
};

export default LinkCards;
