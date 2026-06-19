import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email & OTP required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedOtp = String(otp).trim().replaceAll('"', "");

    const key = `otp:${normalizedEmail}`;
    const storedOtp = await redis.get<string>(key);

    console.log("OTP verify debug", {
      key,
      hasStoredOtp: Boolean(storedOtp),
      storedType: typeof storedOtp,
      receivedType: typeof otp,
      storedLength: storedOtp ? String(storedOtp).trim().length : 0,
      receivedLength: normalizedOtp.length,
    });

    if (!storedOtp) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 400 }
      );
    }

    const normalizedStoredOtp = String(storedOtp).trim().replaceAll('"', "");

    if (normalizedStoredOtp !== normalizedOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await redis.del(key);

    return NextResponse.json({ message: "OTP verified" }, { status: 200 });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}