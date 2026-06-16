import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
// @ts-ignore: global CSS import without explicit type declarations
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientNavBlocker from "@/components/apps/ClientNavBlocker";
import RouteLoader from "@/components/apps/RouteLoader";
import NetworkListener from "@/components/apps/NetworkListener";
import { TauriMobileFetchBridge } from "@/components/apps/TauriMobileFetchBridge";
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
  applicationName: "Classify AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Classify AI",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#08080C",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-[#08080C]`}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>

      <body className="scrollbar-hide min-h-dvh overflow-x-hidden bg-[#08080C] font-sans text-slate-100 antialiased selection:bg-violet-500/30 selection:text-white [-webkit-tap-highlight-color:transparent]">
        <NotificationPortal />
        <TauriMobileFetchBridge />
        <ClientNavBlocker />
        {/* <RazorpayScriptLoader /> */}
        <RouteLoader />
        <NetworkListener />

        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#08080C]">
          <div className="absolute -left-32 top-[-120px] h-72 w-72 rounded-full bg-violet-600/20 blur-[100px] sm:h-96 sm:w-96" />
          <div className="absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[110px] sm:h-96 sm:w-96" />
          <div className="absolute bottom-[-180px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px] sm:h-[28rem] sm:w-[28rem]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.055),transparent_34%),linear-gradient(180deg,rgba(8,8,12,0),rgba(8,8,12,0.92))]" />
        </div>

        <Toaster
          position="bottom-center"
          reverseOrder={false}
          gutter={10}
          containerStyle={{
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
            paddingLeft: "14px",
            paddingRight: "14px",
          }}
          toastOptions={{
            duration: 3500,
            style: {
              width: "100%",
              maxWidth: "420px",
              background: "rgba(20,20,27,0.92)",
              color: "#F8FAFC",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "18px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
              backdropFilter: "blur(22px)",
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

        <main className="relative z-10 min-h-dvh overflow-x-hidden">
          {children}
        </main>

        <div className="pointer-events-none fixed bottom-4 right-4 z-20 hidden text-right text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35 lg:block">
          <p>© 2025 Classify AI</p>

          <div className="pointer-events-auto mt-2">
            <AppVersionCard />
          </div>
        </div>
      </body>
    </html>
  );
}