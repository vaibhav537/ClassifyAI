import { logActivity, transformUsername } from "@/lib/helper";
import { sendWelcomeEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const createCampusAssistantSchema = z.object({
  adminID: z.string().min(1),
  assistantName: z.string().min(1),
  assistantEmail: z.string().email(),
  premiumFeatures: z.array(z.string()).optional(),
});

function createBaseSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

async function generateTemporaryCampusName(tx: any) {
  const count = await tx.campus.count({
    where: {
      name: {
        startsWith: "Pending Campus",
      },
    },
  });

  const nextNumber = count + 1;

  return `Pending Campus ${String(nextNumber).padStart(3, "0")}`;
}

async function createUniqueCampusSlug(tx: any, campusName: string) {
  const baseSlug = createBaseSlug(campusName) || "pending-campus";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingCampus = await tx.campus.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingCampus) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createCampusAssistantSchema.parse(body);
    const adminUser = await prisma.user.findUnique({
      where: { id: data.adminID },
      select: {
        id: true,
        role: true,
      },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admin can create campus and assistant." },
        { status: 403 },
      );
    }

    const existingAssistant = await prisma.user.findUnique({
      where: { email: data.assistantEmail },
      select: { id: true },
    });
    if (existingAssistant) {
      return NextResponse.json(
        { error: "Assistant with this email already exists." },
        { status: 409 },
      );
    }
    const assistantUserName = await transformUsername("AST");

    const result = await prisma.$transaction(async (tx) => {
      const temporaryCampusName = await generateTemporaryCampusName(tx);
      const slug = await createUniqueCampusSlug(tx, temporaryCampusName);
      const newCampus = await tx.campus.create({
        data: {
          name: temporaryCampusName,
          hindiName: "",
          slug,
          city: "Pending",
          latitude: 0,
          longitude: 0,
          wifiBssids: [],
        },
      });
      const newAssistant = await tx.user.create({
        data: {
          name: data.assistantName,
          email: data.assistantEmail,
          username: assistantUserName,
          role: "ASSISTANT",
          campusId: newCampus.id,
          premiumFeatures: data.premiumFeatures
            ? { connect: data.premiumFeatures.map((name) => ({ name })) }
            : undefined,
        },
      });
      return { newCampus, newAssistant };
    });
    try {
      await sendWelcomeEmail(
        result.newAssistant.email,
        result.newAssistant.name,
        result.newAssistant.username
      );
    } catch (error) {
      console.error("Email failed:", error);
    }
    await logActivity(
      result.newAssistant.id,
      result.newAssistant.name,
      `${result.newAssistant.name} added as assistant for ${result.newCampus.name}`,
    );

    return NextResponse.json(
      {
        message: "Campus and assistant created successfully",
        campus: result.newCampus,
        assistant: result.newAssistant,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Campus Assistant Setup Error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
