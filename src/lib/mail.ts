import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getFromAddress() {
  const rawFrom =
    process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER;

  if (!rawFrom) {
    return "Classify AI";
  }

  if (rawFrom.includes("<")) {
    return rawFrom;
  }

  return `Classify AI <${rawFrom}>`;
}

export const sendOtpEmail = async (to: string, otp: string) => {
  const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Classify AI OTP</title>
</head>
<body style="margin:0;padding:0;background:#08080C;font-family:Arial,sans-serif;color:#ffffff;">
  <div style="max-width:620px;margin:0 auto;padding:28px 14px;">
    <div style="overflow:hidden;border-radius:30px;background:#14141B;border:1px solid rgba(255,255,255,0.10);box-shadow:0 24px 70px rgba(0,0,0,0.45);">
      
      <div style="padding:34px 28px;text-align:center;background:linear-gradient(135deg,rgba(124,58,237,0.32),rgba(217,70,239,0.20),rgba(34,211,238,0.10));border-bottom:1px solid rgba(255,255,255,0.10);">
        <img src="https://res.cloudinary.com/dd2bczbdo/image/upload/v1758565130/only-logo_omdz9x.png" width="58" height="58" alt="Classify AI" style="border-radius:18px;margin-bottom:16px;" />
        <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:rgba(139,92,246,0.16);border:1px solid rgba(196,181,253,0.24);color:#ddd6fe;font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">
          Secure Verification
        </div>
        <h1 style="margin:16px 0 0;color:#ffffff;font-size:27px;line-height:1.25;">Verify Your Email</h1>
        <p style="margin:10px 0 0;color:#a1a1aa;font-size:14px;line-height:1.6;">
          Use this one-time code to continue on Classify AI.
        </p>
      </div>

      <div style="padding:30px 28px;text-align:center;background:#14141B;">
        <p style="margin:0;color:#ffffff;font-size:17px;font-weight:800;">Hello 👋</p>
        <p style="margin:12px auto 0;max-width:500px;color:#a1a1aa;font-size:14px;line-height:1.75;">
          Please enter the OTP below to verify your email address.
        </p>

        <div style="margin:28px auto;padding:18px 22px;max-width:280px;border-radius:22px;background:#08080C;border:1px solid rgba(255,255,255,0.12);box-shadow:0 18px 40px rgba(0,0,0,0.35);">
          <div style="color:#c4b5fd;font-size:34px;font-weight:900;letter-spacing:0.28em;line-height:1.2;">
            ${otp}
          </div>
        </div>

        <div style="display:inline-block;padding:9px 14px;border-radius:999px;background:rgba(245,158,11,0.12);border:1px solid rgba(252,211,77,0.22);color:#fde68a;font-size:12px;font-weight:800;">
          Valid for 5 minutes
        </div>

        <p style="margin:24px 0 0;color:#71717a;font-size:12px;line-height:1.7;">
          If you did not request this OTP, you can safely ignore this email.
        </p>
      </div>

      <div style="padding:22px 28px;text-align:center;background:#101014;border-top:1px solid rgba(255,255,255,0.10);">
        <p style="margin:0;color:#ffffff;font-size:13px;font-weight:800;">Classify AI</p>
        <p style="margin:8px 0 0;color:#71717a;font-size:12px;line-height:1.6;">
          AI Smart Attendance & College Community App
        </p>
        <p style="margin:8px 0 0;color:#71717a;font-size:12px;">
          &copy; ${new Date().getFullYear()} Classify AI. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  return transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: "Your Classify AI OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    html,
  });
};

export const sendMail = async (to: string, subject: string, code: string) => {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
  <style>
    /* Reset / sensible defaults */
    body, html { margin: 0; padding: 0; background: #f5f7fb; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 600px; margin: 28px auto; padding: 24px; }
    .card { background: #ffffff; border-radius: 12px; box-shadow: 0 6px 24px rgba(20,30,60,0.08); overflow: hidden; }
    .logo-img { height:58px; width: 58px; }
    .hero { padding: 28px; text-align: center; background: linear-gradient(120deg,#6a82fb 0%,#fc5c7d 100%); color: #fff; }
    .logo { display:inline-block; width:64px; height:64px; border-radius:12px; line-height:64px; font-weight:700; font-size:24px; margin-bottom:12px;  }
    .title { margin: 0; font-size:20px; font-weight:700; letter-spacing: -0.2px; }
    .subtitle { margin:4px 0 0; font-size:13px; opacity:0.95; }
    .content { padding: 28px 32px; color:#0f1724; }
    .lead { font-size:15px; margin:0 0 18px; line-height:1.45; }
    .codebox { display:flex; align-items:center; justify-content:center; background:#f1f5ff; border:1px dashed rgba(15,23,36,0.06); padding:18px; border-radius:10px; font-weight:700; font-size:28px; letter-spacing:4px; color:#0b3a9e; margin:12px 0 20px; }
    .btn { display:inline-block; padding:12px 20px; border-radius:10px; font-weight:600; background: linear-gradient(90deg,#0b76ff,#5ef1c9); color:#06203a; box-shadow: 0 6px 16px rgba(11,118,255,0.18); }
    .small { font-size:12px; color:#6b7280; margin-top:18px; }
    .footer { padding:18px 32px; font-size:12px; color:#9aa3b2; text-align:center; }
    .muted { color:#7b8794; }
    @media (max-width:420px) {
      .container { padding: 12px; }
      .content { padding:20px; }
      .hero { padding:20px; }
      .codebox { font-size:22px; padding:14px; }
    }
  </style>
</head>
<body>
  <div class="container" role="article" aria-roledescription="email">
    <div class="card" role="presentation">
      <!-- HERO / HEADER -->
      <div class="hero" role="presentation" aria-hidden="false">
        <div class="logo" aria-hidden="true"><img src="https://res.cloudinary.com/dd2bczbdo/image/upload/v1758565130/only-logo_omdz9x.png" class="logo-img" alt="LOGO"></div>
        <h1 class="title">Verify your email</h1>
        <p class="subtitle">One quick step to secure your ClassifyAI account</p>
      </div>

      <!-- BODY -->
      <div class="content">
        <p class="lead">Hi there 👋,</p>

        <p>If you requested to change the email for your ClassifyAI assistant, use the verification code below to confirm your request. This code will expire in 5 minutes.</p>

        <!-- CODE -->
        <div class="codebox" role="status" aria-live="polite" aria-label="Your verification code">
          ${code}
        </div>

        <p class="small">If you didn't request this change, you can safely ignore this email — no changes will be made to your account.</p>

        <p style="margin-top:22px" class="small">Thanks —<br/>The ClassifyAI Team</p>
      </div>

      <!-- FOOTER -->
      <div class="footer" role="contentinfo">
        <div>ClassifyAI • <span class="muted">AI Smart Attendance & College Community App</span></div>
        <div style="margin-top:8px">Need help? Contact support</div>
        <div style="margin-top:12px">&copy; 2025 ClassifyAI. All rights reserved.</div>
      </div>
    </div>

    <!-- PLAIN TEXT / ACCESSIBLE FALLBACK -->
    <div style="font-family: monospace; font-size:12px; color:#9aa3b2; text-align:center; padding-top:16px;">
      Verification code: ${code}
    </div>
  </div>
</body>
</html>
`; // Example HTML
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};

/**
 * Sends a professionally designed attendance QR email to a student.
 *
 * This email includes a secure QR code attachment that students can scan to
 * mark their attendance for a specific subject. The QR code is embedded in the
 * email using a CID attachment and is intended to be valid only for the active
 * attendance session.
 *
 * @param to - The recipient student's email address.
 * @param subjectName - The subject name for which attendance is being marked.
 * @param teacherName - The name of the teacher who generated the attendance QR code.
 * @param qrCodeDataUrl - The QR code image as a base64 data URL.
 */

export const sendAttendanceQrEmail = async (
  to: string,
  subjectName: string,
  teacherName: string,
  qrCodeDataUrl: string,
) => {
  const base64Data = qrCodeDataUrl.split(";base64,").pop();

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: to,
    subject: `Attendance QR Code for ${subjectName}`,
    html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Attendance QR Code</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      background: #08080C;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #ffffff;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .email-bg {
      width: 100%;
      background:
        radial-gradient(circle at top left, rgba(139, 92, 246, 0.18), transparent 34%),
        radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.08), transparent 30%),
        #08080C;
      padding: 32px 14px;
    }

    .container {
      max-width: 640px;
      margin: 0 auto;
    }

    .card {
      overflow: hidden;
      border-radius: 30px;
      background: rgba(20, 20, 27, 0.96);
      border: 1px solid rgba(255,255,255,0.10);
      box-shadow: 0 26px 80px rgba(0,0,0,0.45);
    }

    .hero {
      position: relative;
      padding: 34px 30px 30px;
      text-align: center;
      background:
        linear-gradient(135deg, rgba(124, 58, 237, 0.30), rgba(217, 70, 239, 0.18), rgba(34, 211, 238, 0.08)),
        #14141B;
      border-bottom: 1px solid rgba(255,255,255,0.10);
    }

    .logo-wrap {
      display: inline-block;
      width: 68px;
      height: 68px;
      border-radius: 22px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      padding: 8px;
      box-shadow: 0 18px 40px rgba(0,0,0,0.35);
      margin-bottom: 18px;
    }

    .logo-wrap img {
      width: 52px;
      height: 52px;
      display: block;
      border-radius: 16px;
    }

    .badge {
      display: inline-block;
      margin-bottom: 14px;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(139, 92, 246, 0.14);
      border: 1px solid rgba(196, 181, 253, 0.24);
      color: #ddd6fe;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .title {
      margin: 0;
      color: #ffffff;
      font-size: 26px;
      line-height: 1.25;
      font-weight: 850;
      letter-spacing: -0.5px;
    }

    .subtitle {
      margin: 10px 0 0;
      color: #a1a1aa;
      font-size: 14px;
      line-height: 1.6;
      font-weight: 600;
    }

    .content {
      padding: 30px;
      text-align: center;
      background: #14141B;
    }

    .hello {
      margin: 0;
      color: #ffffff;
      font-size: 18px;
      font-weight: 800;
    }

    .lead {
      margin: 12px auto 0;
      max-width: 500px;
      color: #a1a1aa;
      font-size: 14px;
      line-height: 1.75;
      font-weight: 500;
    }

    .valid-chip {
      display: inline-block;
      margin-top: 18px;
      padding: 9px 14px;
      border-radius: 999px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(252, 211, 77, 0.22);
      color: #fde68a;
      font-size: 12px;
      font-weight: 800;
    }

    .qr-shell {
      max-width: 290px;
      margin: 26px auto 22px;
      padding: 12px;
      border-radius: 28px;
      background:
        linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(217, 70, 239, 0.10), rgba(34, 211, 238, 0.08));
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 22px 50px rgba(0,0,0,0.35);
    }

    .qrbox {
      padding: 22px;
      border-radius: 22px;
      background: #ffffff;
      border: 1px solid rgba(255,255,255,0.18);
    }

    .qrbox img {
      display: block;
      width: 100%;
      max-width: 220px;
      margin: 0 auto;
      border-radius: 14px;
    }

    .info-box {
      margin: 24px auto 0;
      max-width: 500px;
      padding: 16px;
      border-radius: 20px;
      background: rgba(8, 8, 12, 0.55);
      border: 1px solid rgba(255,255,255,0.10);
      color: #cbd5e1;
      font-size: 13px;
      line-height: 1.7;
    }

    .thanks {
      margin: 24px 0 0;
      color: #a1a1aa;
      font-size: 13px;
      line-height: 1.7;
    }

    .team {
      color: #ffffff;
      font-weight: 800;
    }

    .footer {
      padding: 22px 30px 28px;
      text-align: center;
      background: #101014;
      border-top: 1px solid rgba(255,255,255,0.10);
    }

    .footer-title {
      margin: 0;
      color: #ffffff;
      font-size: 13px;
      font-weight: 800;
    }

    .footer-text {
      margin: 8px 0 0;
      color: #71717a;
      font-size: 12px;
      line-height: 1.6;
    }

    .fallback {
      padding-top: 16px;
      text-align: center;
      color: #71717a;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      line-height: 1.6;
    }

    @media (max-width: 480px) {
      .email-bg {
        padding: 18px 10px;
      }

      .hero {
        padding: 26px 18px 24px;
      }

      .content {
        padding: 24px 18px;
      }

      .footer {
        padding: 20px 18px 24px;
      }

      .title {
        font-size: 22px;
      }

      .qr-shell {
        max-width: 250px;
      }

      .qrbox {
        padding: 16px;
      }
    }
  </style>
</head>

<body>
  <div class="email-bg">
    <div class="container" role="article" aria-roledescription="email">
      <div class="card" role="presentation">
        <div class="hero" role="presentation">
          <div class="logo-wrap" aria-hidden="true">
            <img src="https://res.cloudinary.com/dd2bczbdo/image/upload/v1758565130/only-logo_omdz9x.png" width="52" height="52" alt="ClassifyAI Logo">
          </div>

          <div class="badge">Classify AI Attendance</div>

          <h1 class="title">Attendance QR for ${subjectName}</h1>
          <p class="subtitle">Generated securely by ${teacherName}</p>
        </div>

        <div class="content">
          <p class="hello">Hello Student 👋</p>

          <p class="lead">
            Scan the QR code below to mark your attendance for
            <strong style="color:#ffffff;">${subjectName}</strong>.
          </p>

          <div class="valid-chip">Valid for 5 minutes only</div>

          <div class="qr-shell">
            <div class="qrbox" role="status" aria-live="polite" aria-label="Attendance QR Code">
              <img src="cid:attendance-qr" alt="Attendance QR Code"/>
            </div>
          </div>

          <div class="info-box">
            For security, this QR code expires quickly. Please scan it from your
            Classify AI app while the attendance session is active.
          </div>

          <p class="thanks">
            Thanks,<br/>
            <span class="team">The Classify AI Team</span>
          </p>
        </div>

        <div class="footer" role="contentinfo">
          <p class="footer-title">Classify AI</p>
          <p class="footer-text">
            AI Smart Attendance & College Community App
          </p>
          <p class="footer-text">
            Need help? Contact your campus admin or support team.
          </p>
          <p class="footer-text">
            &copy; 2026 Classify AI. All rights reserved.
          </p>
        </div>
      </div>

      <div class="fallback">
        Attendance QR generated by ${teacherName} for ${subjectName}
      </div>
    </div>
  </div>
</body>
</html>
    `,
    attachments: [
      {
        filename: "qrcode.png",
        content: base64Data,
        encoding: "base64",
        cid: "attendance-qr",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Sends a professionally designed welcome email to a new user.
 * @param email - The recipient's email address.
 * @param name - The recipient's name for personalization.
 * @param username - The recipient's username for login credentials.
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  username: string,
) => {
  return sendUserWelcomeEmail(email, name, username, "ASSISTANT");
};

export const sendUserWelcomeEmail = async (
  email: string,
  name: string,
  username: string,
  role: "STUDENT" | "TEACHER" | "ASSISTANT",
) => {
  const roleLabel =
    role === "STUDENT"
      ? "Student"
      : role === "TEACHER"
        ? "Teacher"
        : "Campus Assistant";

  const htmlContent = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Classify AI</title>
</head>
<body style="margin:0;padding:0;background:#08080C;font-family:Arial,sans-serif;color:#ffffff;">
  <div style="max-width:640px;margin:0 auto;padding:28px 14px;">
    <div style="overflow:hidden;border-radius:30px;background:#14141B;border:1px solid rgba(255,255,255,0.10);box-shadow:0 24px 70px rgba(0,0,0,0.45);">
      
      <div style="padding:34px 28px;text-align:center;background:linear-gradient(135deg,rgba(124,58,237,0.32),rgba(217,70,239,0.20),rgba(34,211,238,0.10));border-bottom:1px solid rgba(255,255,255,0.10);">
        <img src="https://res.cloudinary.com/dd2bczbdo/image/upload/v1758565130/only-logo_omdz9x.png" width="60" height="60" alt="Classify AI" style="border-radius:18px;margin-bottom:16px;" />

        <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:rgba(139,92,246,0.16);border:1px solid rgba(196,181,253,0.24);color:#ddd6fe;font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">
          ${roleLabel} Account Created
        </div>

        <h1 style="margin:16px 0 0;color:#ffffff;font-size:28px;line-height:1.25;">
          Welcome to Classify AI
        </h1>

        <p style="margin:10px 0 0;color:#a1a1aa;font-size:14px;line-height:1.6;">
          Your ${roleLabel.toLowerCase()} account is ready to use.
        </p>
      </div>

      <div style="padding:30px 28px;background:#14141B;">
        <p style="margin:0;color:#ffffff;font-size:17px;font-weight:800;">
          Hello ${name},
        </p>

        <p style="margin:14px 0 0;color:#a1a1aa;font-size:14px;line-height:1.75;">
          Your account has been created on the Classify AI platform. Use your registered email to log in and complete OTP verification.
        </p>

        <div style="margin:24px 0;padding:18px;border-radius:22px;background:#08080C;border:1px solid rgba(255,255,255,0.10);">
          <p style="margin:0 0 8px;color:#71717a;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;">
            Registered Email
          </p>
          <p style="margin:0 0 20px;color:#ffffff;font-size:15px;font-weight:800;word-break:break-word;">
            ${email}
          </p>

          <p style="margin:0 0 8px;color:#71717a;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;">
            Username
          </p>
          <p style="margin:0;color:#c4b5fd;font-size:24px;font-weight:900;letter-spacing:0.12em;word-break:break-word;">
            ${username}
          </p>
        </div>

        <div style="padding:15px 16px;border-radius:20px;background:rgba(34,211,238,0.07);border:1px solid rgba(34,211,238,0.16);">
          <p style="margin:0;color:#bae6fd;font-size:13px;line-height:1.7;font-weight:700;">
            Login instruction
          </p>
          <p style="margin:6px 0 0;color:#a1a1aa;font-size:13px;line-height:1.7;">
            Open Classify AI, enter your registered email, and verify using the OTP sent to your inbox.
          </p>
        </div>

        <p style="margin:24px 0 0;color:#a1a1aa;font-size:13px;line-height:1.7;">
          Thanks,<br/>
          <strong style="color:#ffffff;">The Classify AI Team</strong>
        </p>
      </div>

      <div style="padding:22px 28px;text-align:center;background:#101014;border-top:1px solid rgba(255,255,255,0.10);">
        <p style="margin:0;color:#ffffff;font-size:13px;font-weight:800;">Classify AI</p>
        <p style="margin:8px 0 0;color:#71717a;font-size:12px;line-height:1.6;">
          AI Smart Attendance & College Community App
        </p>
        <p style="margin:8px 0 0;color:#71717a;font-size:12px;">
          &copy; ${new Date().getFullYear()} Classify AI. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const info = await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: `Welcome to Classify AI! Your ${roleLabel} Account is Ready.`,
    html: htmlContent,
  });

  console.log("User welcome mail result", {
    role,
    acceptedCount: info.accepted?.length || 0,
    rejectedCount: info.rejected?.length || 0,
    messageId: info.messageId,
    response: info.response,
  });

  return info;
};
