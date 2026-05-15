import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore: global CSS import without explicit type declarations
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientNavBlocker from "@/components/apps/ClientNavBlocker";
import RazorpayScriptLoader from "@/components/apps/RazorpayScriptLoader";
import RouteLoader from "@/components/apps/RouteLoader";
import NetworkListener from "@/components/apps/NetworkListener";
import RootBackground from "@/components/apps/RootBackground";
import AppVersionCard from "@/components/apps/AppVersionCard";
import NotificationPortal from "@/components/ui/NotificationPortal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Classify AI",
  description: "Smart Attendance, Exams, Study Planning and AI Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>

      <body className="scrollbar-hide min-h-screen overflow-x-hidden bg-[#08080C] font-sans text-slate-100 antialiased selection:bg-violet-500/30 selection:text-white">
        <NotificationPortal />
        {/* <RootBackground /> */}
        <ClientNavBlocker />
        <RazorpayScriptLoader />
        <RouteLoader />
        <NetworkListener />

        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3500,
            style: {
              background: "#14141B",
              color: "#F8FAFC",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "16px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
              fontSize: "14px",
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: "#22C55E",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#FFFFFF",
              },
            },
          }}
        />

        <main className="relative z-10 min-h-screen overflow-x-hidden">
          {children}
        </main>

        <div className="pointer-events-none fixed bottom-4 right-4 z-20 hidden text-right text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35 sm:block">
          <p>© 2025 Classify AI</p>

          <div className="pointer-events-auto mt-2">
            <AppVersionCard />
          </div>
        </div>
      </body>
    </html>
  );
}


