import { SupportCaseRowProps } from "@/lib/types";
import React from "react";
import {
  Download,
  Filter,
  MessageCircle,
  ShieldAlert,
  UserRound,
  Eye,
} from "lucide-react";

const SupportCasesTable = ({ cases, onViewCase }: SupportCaseRowProps) => {
  function badgeClass(value: string) {
    if (value === "URGENT" || value === "ESCALATED") {
      return "border-red-300/20 bg-red-500/10 text-red-300";
    }

    if (value === "HIGH") {
      return "border-orange-300/20 bg-orange-500/10 text-orange-300";
    }

    if (value === "MEDIUM" || value === "IN_REVIEW") {
      return "border-amber-300/20 bg-amber-500/10 text-amber-300";
    }

    if (value === "RESOLVED") {
      return "border-emerald-300/20 bg-emerald-500/10 text-emerald-300";
    }

    return "border-white/10 bg-white/[0.055] text-slate-300";
  }

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
            <ShieldAlert className="h-5 w-5 text-violet-200" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white">
            Active Support Cases
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Students who crossed attendance risk thresholds.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2.5 text-xs font-extrabold text-violet-100 transition duration-300 hover:border-violet-300/45 hover:bg-violet-500/20"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-4 py-2.5 text-xs font-extrabold text-cyan-100 transition duration-300 hover:border-cyan-300/45 hover:bg-cyan-500/20"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm text-white">
          <thead className="border-b border-white/10 bg-[#08080C]/45 text-[10px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-extrabold">Student</th>
              <th className="px-5 py-4 font-extrabold">Subject</th>
              <th className="px-5 py-4 font-extrabold">Risk</th>
              <th className="px-5 py-4 font-extrabold">Priority</th>
              <th className="px-5 py-4 font-extrabold">Status</th>
              <th className="px-5 py-4 font-extrabold">Last Follow-up</th>
              <th className="w-[210px] px-5 py-4 text-right font-extrabold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {cases.map((item) => (
              <tr
                key={item.id}
                className="group transition duration-300 hover:bg-white/[0.045]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#08080C]/45 transition group-hover:border-violet-300/25 group-hover:bg-violet-500/10">
                      <UserRound className="h-4 w-4 text-violet-200" />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-extrabold text-white">
                        {item.studentName}
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-slate-500">
                        {item.rollNumber}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 font-medium text-slate-300">
                  {item.subject}
                </td>

                <td className="px-5 py-4 text-slate-400">{item.risk}</td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] ${badgeClass(
                      item.priority,
                    )}`}
                  >
                    {item.priority}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] ${badgeClass(
                      item.status,
                    )}`}
                  >
                    {item.status.replaceAll("_", " ")}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-slate-500">
                  {item.lastFollowUp}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onViewCase(item.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-3 py-2 text-xs font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-xs font-extrabold text-emerald-100 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/45 hover:bg-emerald-500/20"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Open Chat
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SupportCasesTable;
