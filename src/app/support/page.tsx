"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccessMessage, showErrorMessage } from "@/lib/helper";
import EarthCanvas from "@/canvas/Earth";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      showSuccessMessage("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      showErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08080C] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6">

        <section className="grid flex-1 grid-cols-1 items-center gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6 lg:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                Support Desk
              </div>

              <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                We’re here to help!
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Our team is ready to assist you. Send your query and we’ll get
                back to you through your provided email.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <label className="flex flex-col">
                  <span className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Your Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="off"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="What's your good name?"
                    className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Your Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="What's your web address?"
                    className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    required
                  />
                  <span className="mt-2 text-xs font-semibold text-slate-500">
                    Please enter a valid email so we can reach out to you.
                  </span>
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Your Message
                  </span>
                  <textarea
                    rows={7}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What you want to say?"
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#08080C]/55 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                    required
                  />
                </label>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
            className="relative min-h-[350px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/25 backdrop-blur-2xl md:min-h-[520px] xl:min-h-[620px]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
            <div className="relative z-10 h-[350px] md:h-[520px] xl:h-[620px]">
              <EarthCanvas />
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}