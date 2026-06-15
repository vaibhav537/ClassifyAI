"use client";

import { useEffect } from "react";

function isTauriAndroid() {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "tauri.localhost" &&
    /Android/i.test(navigator.userAgent)
  );
}
export function TauriMobileFetchBridge() {
  useEffect(() => {
    if (!isTauriAndroid()) return;
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const apiBase =
        process.env.NEXT_PUBLIC_ANDROID_DEV_API_URL ||
        "http://10.168.192.77:3000";
      let url = "";
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else if (input instanceof Request) {
        url = input.url;
      }
      console.log("FETCH BRIDGE CALLED", {
        url,
        method: init?.method,
        hasBody: Boolean(init?.body),
        body: init?.body,
      });
      const isRelative = url.startsWith("/api/");
      if (isRelative) {
        console.log("FETCH BRIDGE REDIRECTING", {
          from: url,
          to:  `${apiBase}${url}`,
          body: init?.body,
        });

        const token = localStorage.getItem("sessionToken");
        const  headers = new Headers(init?.headers);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        return originalFetch(`${apiBase}${url}`, {
          ...init,
          headers,
          credentials: init?.credentials || "include",
        });
      }
      return originalFetch(input, init);
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  return null;
}
