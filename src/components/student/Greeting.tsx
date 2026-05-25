"use client";

import React, { useEffect, useState } from "react";
import { SDetails } from "@/lib/types";
import { numberToRoman, showErrorMessage } from "@/lib/helper";

const Greeting = () => {
  const [details, setDetails] = useState<SDetails | null>(null);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const campusId = localStorage.getItem("CampusID");

    if (!studentId || !campusId) {
      showErrorMessage("No student or Campus ID found, Login Again.");
      return;
    }

    const fetchStudentDetails = async () => {
      try {
        const res = await fetch(
          `/api/student/details?studentId=${studentId}&campusId=${campusId}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch student details");
        }

        const data = await res.json();
        setDetails(data);
      } catch (error) {
        console.log("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, []);

  function removeMiddleName(fullName: string): string {
    const parts: string[] = fullName.trim().split(/\s+/);

    if (parts.length <= 2) {
      return fullName;
    }

    return `${parts[0]} ${parts[parts.length - 1]}`;
  }

  const studentName = removeMiddleName(details?.name || "Student");

  return (
    <div className="w-full">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
        Welcome back
      </p>

      <h1 className="mt-2 text-2xl font-extrabold capitalize tracking-tight text-white sm:text-3xl 2xl:text-4xl">
        {studentName}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {details?.branch && (
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-300">
            <span className="text-slate-500">Branch</span>{" "}
            <span className="text-white">{details.branch}</span>
          </span>
        )}

        {details?.year && (
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-300">
            <span className="text-slate-500">Year</span>{" "}
            <span className="text-white">
              {numberToRoman(details.year || 0) || details.year}
            </span>
          </span>
        )}

        {details?.semester && (
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-300">
            <span className="text-slate-500">Sem</span>{" "}
            <span className="text-white">
              {numberToRoman(details.semester || 0) || details.semester}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Greeting;