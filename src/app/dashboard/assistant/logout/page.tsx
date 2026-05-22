"use client";

import { showSuccessMessage } from "@/lib/helper";
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    const keysToRemove = [
      "studentId",
      "teacherId",
      "assistantId",
      "adminId",
      "HTML5_QRCODE_DATA",
      "epr_suggested",
      "last-online-page",
      "pusherTransportTLS",
      "rzp_checkout_anon_id",
      "rzp_device_id",
      "userId",
      "userRole",
      "lastCampusSlug",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    showSuccessMessage("Assistant Logged out!");

    window.location.replace("/auth/login");
  }, []);

  return null;
};

export default Logout;
