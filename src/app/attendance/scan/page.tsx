"use client";

import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import {
  Camera,
  ChevronLeft,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  getCurrentLocation,
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
} from "@/lib/helper";

const ScanPage = () => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannedRef = useRef(false);
  const router = useRouter();

  // ==================== THIS IS THE CORRECTED FUNCTION ====================
  const handleScan = async (decodedText: string) => {
    if (scannedRef.current) {
      return;
    }
    scannedRef.current = true;
    showLoadingMessage("QR Code detected, getting your location...");

    let qrData;
    try {
      qrData = JSON.parse(decodedText);
      if (!qrData.token) {
        throw new Error("Invalid QR: No token found.");
      }
    } catch (e: any) {
      showErrorMessage(e.message || "Invalid QR code format");
      scannedRef.current = false; // Allow rescanning
      return;
    }

    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }

    try {
      // FIX 1: Get the logged-in student's user ID from local storage.
      const loggedInStudentId = localStorage.getItem("studentId");
      if (!loggedInStudentId) {
        throw new Error("Login error: Could not find your student ID.");
      }

      //2. Call the location helper function.
      const location = await getCurrentLocation();
      showLoadingMessage("Location found, Verifying attendance...");

      // FIX 2: Send the correct data to the correct API endpoint.
      const res = await fetch(`/api/attendance/mark`, {
        // Corrected URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: qrData.token, // The token from the QR code
          studentId: loggedInStudentId, // The ID of the student who is scanning
          location: location,
          wifibssid: null, // Optional: Add WiFi BSSID if needed///NEEDED TO BE FETCHED FROM RUST API....
        }),
      });

      const result = await res.json();

      if (res.ok) {
        showSuccessMessage(result.message || "Attendance Recorded!");
        setTimeout(() => {
          router.replace("/dashboard/student");
        }, 1500);
      } else {
        showErrorMessage(result.message || "Failed marking attendance");
        scannedRef.current = false; // Allow rescanning on API error
      }
    } catch (error: any) {
      showErrorMessage(error.message || "Error marking attendance");
      scannedRef.current = false; // Allow rescanning on fetch error
    }
  };
  // =======================================================================

  useEffect(() => {
    const observeButtons = () => {
      const observer = new MutationObserver(() => {
        const buttons = document.querySelectorAll<HTMLButtonElement>(
          "#reader .html5-qrcode-scanner button",
        );

        buttons.forEach((button) => {
          button.removeAttribute("style");
          button.style.backgroundColor = "rgba(124, 58, 237, 0.14)";
          button.style.color = "#F8FAFC";
          button.style.border = "1px solid rgba(192, 132, 252, 0.35)";
          button.style.padding = "0.6rem 1rem";
          button.style.margin = "0.25rem";
          button.style.borderRadius = "0.85rem";
          button.style.cursor = "pointer";
          button.style.transition = "all 0.2s ease-in-out";
          button.style.fontWeight = "700";
        });
      });

      const readerElem = document.getElementById("reader");
      if (readerElem) {
        observer.observe(readerElem, {
          childList: true,
          subtree: true,
        });
      }

      return () => observer.disconnect();
    };

    const setupScanner = () => {
      const readerElem = document.getElementById("reader");
      if (readerElem) {
        readerElem.innerHTML = "";
      }

      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 550 },
        false,
      );

      scanner.render(handleScan, (err) => {});

      scannerRef.current = scanner;
    };

    const disconnectObserver = observeButtons();

    const timeout = setTimeout(setupScanner, 300);

    return () => {
      disconnectObserver();

      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .then(() => {
            const el = document.getElementById("reader");
            if (el) el.innerHTML = "";
            scannerRef.current = null;
          })
          .catch((err) => {
            const el = document.getElementById("reader");
            if (el) el.innerHTML = "";
            scannerRef.current = null;
          });
      }

      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Attendance Scanner
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Scan QR Attendance
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Scan your class QR code to mark attendance securely with
                  location verification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <Camera className="h-3.5 w-3.5 text-violet-300" />
                  Camera
                </div>
                <p className="mt-1 text-sm font-extrabold text-white">
                  Ready
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/70">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure
                </div>
                <p className="mt-1 text-sm font-extrabold text-emerald-100">
                  Verified Scan
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                <QrCode className="h-5 w-5 text-violet-200" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-white">
                  QR Scanner
                </h2>
                <p className="text-xs text-slate-500">
                  Keep the QR code inside the camera frame
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-[#08080C]/45 p-3 shadow-inner shadow-black/40 sm:p-4">
                <div id="reader" className="mx-auto w-full max-w-3xl" />
              </div>
            </div>
          </section>

          <aside className="grid gap-5">
            <div className="rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                <MapPin className="h-6 w-6 text-violet-200" />
              </div>

              <h2 className="text-xl font-extrabold text-white">
                Location Required
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                After QR detection, Classify AI will request your current
                location to verify attendance marking.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10">
                <ShieldCheck className="h-6 w-6 text-emerald-200" />
              </div>

              <h2 className="text-xl font-extrabold text-white">
                Scan Instructions
              </h2>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-400">
                  Keep your QR code clearly visible inside the scanner.
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-400">
                  Allow camera and location permissions when asked.
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-400">
                  Wait for confirmation before closing this page.
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </section>
  );
};

export default ScanPage;