"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";

// --- FONT PLACEHOLDER ---
// Removed the 'next/font' import. We'll apply the class name directly.
const tektur = {
  className: "font-tektur", // Assuming 'font-tektur' is defined in your global CSS
};

// --- MODAL PORTAL (Self-contained) ---
// The ModalPortal logic is now included directly in this file to resolve the import error.
const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const LinkCards = ({
  forRole,
  onActionComplete,
}: {
  forRole: "student" | "teacher";
  onActionComplete?: () => void;
}) => {
  const [modalOpen, setModalOpen] = useState<"add" | "remove" | null>(null);
  const [loading, setLoading] = useState(false);
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
  const campusId =
    typeof window !== "undefined" ? localStorage.getItem("campusId") : null;

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
    if (assistantID) {
      setAssistantId(assistantID);
    }
  }, []);
  const { data: recentUser, isLoading: loadingRecent } = useSWR(
    campusId
      ? `/api/assistant/recent-user?role=${forRole.toUpperCase()}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage({ type: "error", text: "Please enter email" });
      return;
    }
    setLoading(true);
    const res = await fetch("/api/mail/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    if (res.ok) {
      setStep("otp");
      setMessage({ type: "success", text: "OTP sent to your email" });
    } else {
      setMessage({ type: "error", text: "Failed to send OTP" });
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
    if (currentSubject.name.trim() === "") return; // Don't add empty subjects
    setAssignedSubjects([...assignedSubjects, currentSubject]);
    setCurrentSubject({ name: "", code: "", description: "" }); // Reset input fields
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
      setHodTeaches(true); // default = YES
    }
  }, [formData.designation]);

  return (
    <>
      <div className="h-full border rounded-2xl border-orange-400 w-full flex p-5 justify-center bg-orange-700/5 text-white">
        <div>
          <h5 className={`text-xl text-center ${tektur.className}`}>
            Add or Remove {forRole === "student" ? "Student" : "Teacher"}
          </h5>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-6 items-center md:items-start">
            <div className="flex flex-col gap-3">
              <button
                className="border w-48 text-center hover:bg-orange-700/20 cursor-pointer hover:border-orange-500 transition-all duration-300 rounded-xl p-4"
                onClick={() => setModalOpen("add")}
              >
                Add {forRole}
              </button>
              <button
                className="border w-48 text-center hover:bg-orange-700/20 cursor-pointer hover:border-orange-500 transition-all duration-300 rounded-xl p-4"
                onClick={() => setModalOpen("remove")}
              >
                Remove {forRole}
              </button>
            </div>
            <div className="mt-2 text-center md:text-left">
              <h6 className="text-lg mb-2">Recent Activity</h6>
              <div>
                {loadingRecent && (
                  <p className="animate-pulse text-sm text-gray-500">
                    Loading...
                  </p>
                )}
                {!loadingRecent && recentUser?.name ? (
                  <p>
                    Added:{" "}
                    <strong className="text-orange-300">
                      {recentUser.name}
                    </strong>{" "}
                    <span className="text-xs text-gray-500">
                      ({new Date(recentUser.createdAt).toLocaleDateString()})
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    No recent {forRole} found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalPortal>
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/85 flex justify-center items-center z-50 p-4"
              onClick={closeModal}
            >
              <div
                className="from-orange-800/50 via-orange-300/50 to-orange-800/50 bg-gradient-to-bl p-6 rounded-lg shadow-lg text-black w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className={`${tektur.className} text-xl mb-4`}>
                  {modalOpen === "add" ? "Add" : "Remove"} {forRole}
                </h2>

                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  autoComplete="off"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded mb-2`}
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
                  className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded mb-2`}
                  disabled={loading}
                />
               {forRole === "teacher" && <input
                  type="text"
                  placeholder="Department (e.g., EEE)"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                    })
                  }
                  className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
                />}
                {forRole === "teacher" && modalOpen === "add" && (
                  <select
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        designation: e.target.value,
                      })
                    }
                    className={`${tektur.className} w-full ring appearance-none mt-2 text-black/60 ring-orange-400 outline-none p-2 rounded`}
                  >
                    <option value="" className="bg-orange-800/80">
                      Select Designation
                    </option>
                    <option
                      value="PROFESSOR"
                      className="text-black bg-orange-800/80"
                    >
                      Professor
                    </option>
                    <option
                      value="ASSOCIATE_PROFESSOR"
                      className="text-black bg-orange-800/80"
                    >
                      Associate Professor
                    </option>
                    <option
                      value="ASSISTANT_PROFESSOR"
                      className="text-black bg-orange-800/80"
                    >
                      Assistant Professor
                    </option>
                    <option
                      value="LECTURER"
                      className="text-black bg-orange-800/80"
                    >
                      Lecturer
                    </option>
                    <option
                      value="HOD"
                      className="text-black bg-orange-800/80 rounded-b-4xl"
                    >
                      HOD
                    </option>
                  </select>
                )}
                {formData.designation === "HOD" && (
                  <div className="mt-3 flex items-center gap-4">
                    <p className="text-sm mb-2">Does HOD teach subjects?</p>

                    <div
                      onClick={() => setHodTeaches(!hodTeaches)}
                      className={`w-10 -mt-2 h-5 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                        hodTeaches ? "bg-orange-500" : "bg-gray-400"
                      }`}
                    >
                      <div
                        className={`bg-white/80 w-6 h-6 rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center text-[10px] font-bold ${
                          hodTeaches ? "translate-x-4" : "-translate-x-3"
                        }`}
                      >
                        {hodTeaches ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                )}

                {forRole === "student" && modalOpen === "add" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Branch"
                      value={formData.branch}
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({ ...formData, branch: e.target.value })
                      }
                      className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
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
                      className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
                      disabled={loading}
                    />
                    <input
                      type="text"
                      placeholder="Semester (e.g. Semester 1)"
                      value={formData.semester}
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({ ...formData, semester: e.target.value })
                      }
                      className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
                      disabled={loading}
                    />
                    <input
                      type="text"
                      placeholder="Section (e.g.Section A)"
                      value={formData.section}
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                      className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
                      disabled={loading}
                    />
                  </div>
                )}

                {forRole === "teacher" &&
                  modalOpen === "add" &&
                  (formData.designation !== "HOD" || hodTeaches) && (
                    <div className="space-y-4 my-4 border-t border-b border-orange-400/50 py-4">
                      <p className="text-sm font-semibold">
                        Assign Semester & Section
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
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
                          className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold">
                            Add Subjects
                          </label>
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
                            className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
                          />
                          <input
                            type="text"
                            placeholder="Code"
                            required
                            value={currentSubject.code}
                            onChange={(e) =>
                              setCurrentSubject({
                                ...currentSubject,
                                code: e.target.value,
                              })
                            }
                            className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
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
                            rows={2}
                            className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded`}
                          ></textarea>
                          <button
                            type="button"
                            onClick={handleAddSubject}
                            className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 font-bold text-lg flex items-center justify-center gap-2"
                          >
                            <span className="text-xl">+</span> Add Subject
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">
                            Assigned Subjects ({assignedSubjects.length})
                          </label>
                          <div className="border rounded-md h-full min-h-[150px] overflow-y-auto p-2 space-y-1">
                            {assignedSubjects.length > 0 ? (
                              assignedSubjects.map((sub, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-start bg-orange-100/50 p-2 rounded text-sm"
                                >
                                  <div className="flex-grow">
                                    <p className="font-semibold">
                                      {sub.name} {sub.code && `(${sub.code})`}
                                    </p>
                                    <p className="text-xs text-gray-700 italic pr-2">
                                      {sub.description}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSubject(index)}
                                    className="text-red-500 font-bold px-2 flex-shrink-0"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-xs text-gray-500">
                                  No subjects added yet.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {modalOpen === "add" && step === "otp" && (
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    autoComplete="off"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`${tektur.className} w-full ring ring-orange-400 outline-none p-2 rounded mb-2`}
                    disabled={loading}
                  />
                )}

                {message && (
                  <div
                    className={`my-2 text-base rounded-xl text-center ring-2 p-2 ${
                      message.type === "success"
                        ? "ring-green-600"
                        : "ring-red-600"
                    } ${tektur.className} ${
                      message.type === "success"
                        ? "text-green-300"
                        : "text-red-300"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="flex flex-col justify-end gap-2 mt-4">
                  {modalOpen === "add" ? (
                    <>
                      {step === "form" && !emailVerified && (
                        <button
                          onClick={handleSendOtp}
                          disabled={loading}
                          className={`px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ${tektur.className}`}
                        >
                          {loading ? "Sending…" : "Send OTP"}
                        </button>
                      )}

                      {step === "otp" && (
                        <button
                          onClick={handleVerifyOtp}
                          disabled={loading}
                          className={`px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ${tektur.className}`}
                        >
                          {loading ? "Verifying…" : "Verify OTP"}
                        </button>
                      )}

                      {emailVerified && (
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${tektur.className}`}
                        >
                          {loading ? "Processing…" : "Add"}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${tektur.className}`}
                    >
                      {loading ? "Processing…" : "Remove"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </>
  );
};

export default LinkCards;
