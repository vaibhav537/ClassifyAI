// app/lib/mailer.ts
import nodemailer from "nodemailer";

// Create a reusable transporter object (this is more efficient than creating it in every function)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
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
  const htmlContent = `
 <<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Campus Assistant Account Created</title>
  <style>
    body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; background-color:#f5f7fb; }
    .container { max-width:600px; margin:28px auto; padding:20px; }
    .card { background:#ffffff; border-radius:12px; box-shadow:0 6px 24px rgba(20,30,60,0.08); overflow:hidden; }
    .hero { background:linear-gradient(120deg,#16a085 0%,#f4d03f 100%); padding:28px; text-align:center; color:#fff; }
    .hero h1 { margin:0; font-size:24px; font-weight:700; }
    .content { padding:28px 32px; color:#0f1724; }
    .lead { font-size:15px; margin:0 0 18px; line-height:1.45; }
    .info-box { background:#f9fafc; border:1px dashed rgba(15,23,36,0.1); padding:18px; border-radius:10px; margin:18px 0; }
    .info-box strong { color:#16a085; }
    .small { font-size:12px; color:#6b7280; margin-top:18px; }
    .footer { background:#FFF;  border-top:1px solid rgba(224,224,224);  padding:18px; font-size:12px; color:#9aa3b2; text-align:center; }
    .muted { color:#7b8794; }
    @media (max-width:420px) {
      .container { padding:12px; }
      .content { padding:20px; }
      .hero { padding:20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <!-- HEADER -->
      <div class="hero">
        <h1>Welcome to ClassifyAI</h1>
        <p style="margin-top:6px; font-size:13px; opacity:0.95;">Your Campus Assistant account has been created</p>
      </div>

      <!-- BODY -->
      <div class="content">
        <p class="lead">Hello ${name},</p>
        <p>We’re excited to let you know that a <b>Campus Assistant account</b> has been created for you on the ClassifyAI platform.</p>
        
        <!-- INFO BOX -->
        <div class="info-box">
          <p style="margin:0;"><strong>Registered Email:</strong> ${email}</p>
          <p style="margin:0;"><strong>Username:</strong> ${username}</p>
        </div>

        <p>To log in, please visit the ClassifyAI login page and enter your registered email address.  
        A secure one-time code will be sent to your inbox for verification every time you sign in.</p>

        <p class="small">If you did not expect this email, please ignore it or contact ClassifyAI support.</p>

        <p style="margin-top:22px" class="small">Thanks —<br/>The ClassifyAI Team</p>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div>ClassifyAI • <span class="muted">AI Smart Attendance & College Community App</span></div>
        <div style="margin-top:12px">&copy; 2025 ClassifyAI. All rights reserved.</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  const mailOptions = {
    from: `Classify AI <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Welcome to Classify AI! Your Account is Ready.",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
