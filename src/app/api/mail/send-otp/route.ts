import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { redis } from "@/lib/redis";

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

    const smtpPort = Number(
      process.env.SMTP_PORT || process.env.EMAIL_PORT || 587,
    );
    const smtpFrom =
      process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER;

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !smtpFrom
    ) {
      console.error("SMTP env missing", {
        hasHost: Boolean(process.env.SMTP_HOST),
        hasUser: Boolean(process.env.SMTP_USER),
        hasPass: Boolean(process.env.SMTP_PASS),
        hasFrom: Boolean(smtpFrom),
        port: smtpPort,
      });

      return NextResponse.json(
        { error: "SMTP configuration missing" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: `Classify AI <${smtpFrom}>`,
      to: normalizedEmail,
      subject: "Your Classify AI OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 20px;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          background-color: #ffffff;
        ">
          <h2 style="color: #ff6f00; text-align: center;">Verify Your Email</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">
            Please use the following One-Time Password to verify your email address on <strong>Classify AI</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="
              display: inline-block;
              font-size: 32px;
              letter-spacing: 5px;
              padding: 10px 20px;
              background-color: #fff3e0;
              color: #ff6f00;
              border-radius: 8px;
              font-weight: bold;
            ">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center;">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            &copy; ${new Date().getFullYear()} <strong>Classify AI</strong>. All rights reserved.
          </p>
        </div>
      `,
    });

    console.log("OTP mail result", {
      to: normalizedEmail,
      accepted: info.accepted,
      rejected: info.rejected,
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
