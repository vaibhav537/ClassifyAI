import { logActivity } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// 1. Zod schema to validate the incoming request
const reportRequestSchema = z.object({
  campusId: z.string().cuid("A valid campus ID is required."),
  // Although not used for session, it's good practice to know who initiated the action.
  assitantId: z.string().cuid("A valid assistant ID is required."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = reportRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { campusId, assitantId } = validation.data;

    // Optional but recommended: Verify the adminId belongs to the campus they are requesting reports for.
    const assistantUser = await prisma.user.findFirst({
      where: { id: assitantId, campusId: campusId },
    });
    if (!assistantUser) {
      return NextResponse.json(
        { success: false, error: "Admin not authorized for this campus." },
        { status: 403 },
      );
    }

    // 2. FETCH USERS: The query is now scoped to the provided campusId.
    const proStudents = await prisma.student.findMany({
      where: {
        user: {
          campusId,
          role: "STUDENT",
          premiumExpiresAt: { gt: new Date() },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (proStudents.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active premium students found for this campus.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // Use 'true' if your SMTP provider uses port 465 (SSL)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let reportsSent = 0;
    for (const student of proStudents) {
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);

      // This query is now implicitly scoped because 'student.id' is from the campus-filtered list.
      const attendance = await prisma.attendance.findMany({
        where: {
          studentId: student.id,
          markedAt: { gte: fromDate },
        },
        include: {
          classSession: {
            select: {
              subjectRel: {
                select: { name: true },
              },
            },
          },
        },
      });

      const stats: Record<string, { present: number; total: number }> = {};

      for (const rec of attendance) {
        const subjName = rec.classSession?.subjectRel?.name;
        if (!subjName) continue;

        if (!stats[subjName]) stats[subjName] = { present: 0, total: 0 };
        stats[subjName].total += 1;
        if (rec.status === "PRESENT") stats[subjName].present += 1;
      }

      if (Object.keys(stats).length === 0) {
        await logActivity(
          student.user.id,
          student.user.name,
          `No attendance data for ${student.user.name} - skipped monthly report`,
        );
        continue;
      }

      const tableRows = Object.entries(stats)
        .map(([subject, { present, total }]) => {
          const percent = total > 0 ? Math.round((present / total) * 100) : 0;
          return `<tr>...</tr>`; // Your existing HTML for rows
        })
        .join("");

      const html = `...`; // Your existing email HTML template

      try {
        await transporter.sendMail({
          from: `"ClassifyAI" <${process.env.SMTP_USER}>`,
          to: student.user.email,
          subject: `Your Monthly Attendance Report`,
          html,
        });
        reportsSent++;
        await logActivity(
          student.user.id,
          student.user.name,
          `Sent monthly report to ${student.user.name}`,
        );
      } catch (emailError) {
        console.error(
          `Failed to send email to ${student.user.email}:`,
          emailError,
        );
        await logActivity(
          student.user.id,
          student.user.name,
          `Failed to send monthly report to ${student.user.name}`,
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Reports sent to ${reportsSent} users.`,
    });
  } catch (error) {
    console.error("Error Sending Monthly Attendance Reports", error);
    return NextResponse.json({
      success: false,
      message: `Error Sending monthly attendance Reports`,
    });
  }
}
