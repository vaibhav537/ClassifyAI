"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plan } from "@/lib/types";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";

export default function ManagePlansSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // 1. ADD STATE to store the assistant's ID
  const [assistantId, setassistantId] = useState<string | null>(null);

  // 2. GET the assistant's ID from localStorage when the component mounts
  useEffect(() => {
    const id = localStorage.getItem("assistantId"); // Assuming this is the key for the logged-in assistant's ID
    setassistantId(id);
  }, []);

  // This effect now depends on assistantId to run
  useEffect(() => {
    // Don't fetch plans if we don't know who the assistant is yet
    if (!assistantId) {
      // If there's no assistantId after the initial check, stop loading.
      if (!loading) setLoading(false);
      return;
    }

    const fetchPlans = async () => {
      setLoading(true);
      try {
        // 3. SEND the assistantId with the API request
        const res = await fetch(`/api/assistant/settings/plans`);
        const data = await res.json();
        if (res.ok) {
          setPlans(data.plans);
        } else {
          console.log(data);
          throw new Error(data.message || "Failed to fetch plans.");
        }
      } catch (err: any) {
        showErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [assistantId]); // Re-fetch if assistantId changes

  const handleChange = (index: number, value: number) => {
    const updated = [...plans];
    updated[index].price = value;
    setPlans(updated);
  };

  const handleSave = async (name: string, price: number) => {
    if (price <= 0) {
      showErrorMessage("Price must be a positive number.");
      return;
    }
    // 4. CHECK for assistantId before trying to save
    if (!assistantId) {
      showErrorMessage("Could not verify your identity. Please log in again.");
      return;
    }

    setSaving(name);
    showLoadingMessage(`Updating ${name.replace("_", " ")} plan...`);
    try {
      // 5. SEND the assistantId in the request body
      const res = await fetch("/api/assistant/settings/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, assistantId }),
      });
      const data = await res.json();
      if (res.ok) {
        showSuccessMessage(`Updated ${name.replace("_", " ")} successfully.`);
        // No need to manually refetch, useSWR would handle this automatically
        // but for now, we can keep the manual refetch
        const newRes = await fetch(
          `/api/assistant/settings/plans?assistantId=${assistantId}`,
        );
        const newData = await newRes.json();
        if (newRes.ok) setPlans(newData.plans);
      } else {
        throw new Error(data.error || "Failed to update plan.");
      }
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative min-h-[75vh] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(75vh-3rem)] flex-col gap-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
            Revenue Control
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Manage Premium Plans
              </motion.h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Update subscription pricing for premium plans used across your
                Classify AI workspace.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-xs font-extrabold text-emerald-300">
              {plans.length} {plans.length === 1 ? "Plan" : "Plans"}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid flex-1 place-items-center"
            >
              <div className="w-full max-w-2xl space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="h-5 w-44 rounded-full bg-white/10" />
                      <div className="h-11 w-40 rounded-2xl bg-white/10" />
                      <div className="h-11 w-24 rounded-2xl bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide"
            >
              <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101014]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                    <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                          Premium Tier
                        </p>
                        <div
                          className="mt-2 text-lg font-extrabold capitalize text-white transition group-hover:text-violet-100"
                        >
                          {plan.name.replace("_", " ").toLowerCase()} plan
                        </div>
                      </div>

                      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
                        <div className="relative w-full sm:w-[11rem]">
                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-500">
                            ₹
                          </span>
                          <motion.input
                            type="number"
                            min={1}
                            className="w-full rounded-2xl border border-white/10 bg-[#08080C]/55 py-3 pl-8 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-500/10"
                            value={plan.price}
                            onChange={(e) =>
                              handleChange(
                                index,
                                Math.max(1, parseInt(e.target.value) || 1),
                              )
                            }
                            whileFocus={{ scale: 1.01 }}
                          />
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSave(plan.name, plan.price)}
                          disabled={saving === plan.name}
                          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          {saving === plan.name ? "Saving…" : "Save"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
