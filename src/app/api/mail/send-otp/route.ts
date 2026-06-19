import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { sendOtpEmail } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.setex(`otp:${normalizedEmail}`, 300, otp);

    const info = await sendOtpEmail(normalizedEmail, otp);

    console.log("OTP mail result", {
      acceptedCount: info.accepted?.length || 0,
      rejectedCount: info.rejected?.length || 0,
      messageId: info.messageId,
      response: info.response,
    });

    if (!info.accepted || info.accepted.length === 0) {
      return NextResponse.json(
        { error: "SMTP did not accept the email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (err) {
    console.error("Send OTP Error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}