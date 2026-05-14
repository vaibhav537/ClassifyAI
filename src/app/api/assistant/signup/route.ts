// /api/admin/signup/route.ts

import { logActivity, transformUsername } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ==================== SCHEMA ====================
const signupSchema = z.object({
  mode: z.enum(["add", "remove"]),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["STUDENT", "TEACHER"]),
  premiumFeatures: z.array(z.string()).optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  semester: z.string().optional(),
  section: z.string().optional(),
  department: z.string().optional(),
  campusId: z.string().optional(),
  designation: z
    .preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .enum([
          "PROFESSOR",
          "ASSOCIATE_PROFESSOR",
          "ASSISTANT_PROFESSOR",
          "LECTURER",
          "HOD",
        ])
        .optional(),
    )
    .optional(),
  assignedSubjects: z
    .array(
      z.object({
        name: z.string().min(1),
        code: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
  adminID: z.string(),
});

// ==================== API ====================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);

    // ==================== AUTH ====================
    const adminUser = await prisma.user.findUnique({
      where: { id: data.adminID },
      select: { campusId: true, role: true },
    });

    if (
      !adminUser ||
      (adminUser.role !== "ADMIN" && adminUser.role !== "ASSISTANT") ||
      (adminUser.role === "ASSISTANT" && !adminUser.campusId)
    ) {
      return NextResponse.json(
        { error: "Invalid or unconfigured admin account." },
        { status: 403 },
      );
    }

    const campusId = adminUser.campusId ?? data.campusId;

    // ==================== ADD USER ====================
    if (data.mode === "add") {

      //* Why will admin will be associated to a campus, admin is an independent user. ===> Fixed
      if (!campusId) {
        return NextResponse.json(
          { error: "Campus Id is required." },
          { status: 400 },
        );
      }

      if (
        adminUser.role === "ASSISTANT" &&
        data.campusId &&
        data.campusId !== adminUser.campusId
      ) {
        return NextResponse.json(
          { error: "Assistant cannot create users outside their campus." },
          { status: 403 },
        );
      }

      // ❌ Validate teacher BEFORE DB write
      if (data.role === "TEACHER" && !data.designation) {
        return NextResponse.json(
          { error: "Designation is required for teachers" },
          { status: 400 },
        );
      }

      if (data.role === "TEACHER" && !data.department) {
        return NextResponse.json(
          { error: "Department is required for teachers" },
          { status: 400 },
        );
      }

      // ❌ Check existing user
      const existingUser = await prisma.user.findFirst({
        where: { email: data.email, campusId },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists in this campus" },
          { status: 409 },
        );
      }

      // ==================== CREATE USER ====================
      const username= await transformUsername(data.role === "STUDENT" ? "STD": "TCH")
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          username,
          role: data.role,
          campusId,
          premiumFeatures: data.premiumFeatures
            ? { connect: data.premiumFeatures.map((name) => ({ name })) }
            : undefined,

          // Student fields
          branch:
            data.role === "STUDENT" ? (data.branch ?? undefined) : undefined,
          year:
            data.role === "STUDENT" && data.year
              ? Number(data.year)
              : undefined,
          semester:
            data.role === "STUDENT" && data.semester
              ? Number(data.semester.match(/\d+/)?.[0] || 0)
              : undefined,
        },
      });

      // ==================== TEACHER LOGIC ====================
      if (newUser.role === "TEACHER") {
        const teacherProfile = await prisma.teacher.create({
          data: {
            userId: newUser.id,
            designation: data.designation,
            department: data.department,
          },
        });

        // ✅ Correct subject logic
        const shouldAssignSubjects =
          data.role === "TEACHER" &&
          (data.designation !== "HOD" ||
            (data.designation === "HOD" && data.assignedSubjects?.length));

        if (
          shouldAssignSubjects &&
          data.assignedSubjects &&
          data.assignedSubjects.length > 0 &&
          data.semester &&
          data.section
        ) {
          const semesterRecord = await prisma.semester.findFirst({
            where: { name: data.semester, campusId },
          });

          const sectionRecord = await prisma.section.findFirst({
            where: { name: data.section, campusId },
          });

          if (semesterRecord && sectionRecord) {
            const subjectIds = await Promise.all(
              data.assignedSubjects.map(async (subject) => {
                const existingSubject = await prisma.subject.findFirst({
                  where: { name: subject.name, campusId },
                });

                if (existingSubject) return existingSubject.id;

                const newSubject = await prisma.subject.create({
                  data: {
                    name: subject.name,
                    code: subject.code,
                    description: subject.description,
                    campusId,
                  },
                });

                return newSubject.id;
              }),
            );

            await prisma.teacherSubject.createMany({
              data: subjectIds.map((subjectId) => ({
                teacherId: teacherProfile.id,
                subjectId,
                semesterId: semesterRecord.id,
                sectionId: sectionRecord.id,
              })),
              skipDuplicates: true,
            });
          }
        }
      }

      // ==================== STUDENT LOGIC ====================
      if (newUser.role === "STUDENT") {
        let semesterRecord = null;
        let sectionRecord = null;

        if (data.semester) {
          semesterRecord = await prisma.semester.findFirst({
            where: { name: data.semester, campusId },
          });

          if (!semesterRecord) {
            semesterRecord = await prisma.semester.create({
              data: {
                name: data.semester,
                number: Number(data.semester.match(/\d+/)?.[0] || 0),
                campusId,
              },
            });
          }
        }

        if (data.section) {
          sectionRecord = await prisma.section.findFirst({
            where: { name: data.section, campusId },
          });

          if (!sectionRecord) {
            sectionRecord = await prisma.section.create({
              data: { name: data.section, campusId },
            });
          }
        }

        await prisma.student.create({
          data: {
            userId: newUser.id,
            semesterId: semesterRecord?.id,
            sectionId: sectionRecord?.id,
          },
        });
      }

      // ==================== LOG ====================
      await logActivity(
        newUser.id,
        newUser.name,
        `${newUser.name} added by admin`,
      );

      return NextResponse.json(newUser, { status: 201 });
    }

    // ==================== REMOVE USER ====================
    if (data.mode === "remove") {
      const existingUser = await prisma.user.findFirst({
        where: { email: data.email, campusId },
      });

      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      await logActivity(
        existingUser.id,
        existingUser.name,
        `${existingUser.name} removed by admin`,
      );

      await prisma.recentActivity.deleteMany({
        where: { userId: existingUser.id },
      });

      await prisma.attendance.deleteMany({
        where: { userId: existingUser.id },
      });

      await prisma.googleToken.deleteMany({
        where: { userId: existingUser.id },
      });

      if (existingUser.role === "TEACHER") {
        await prisma.teacher.deleteMany({
          where: { userId: existingUser.id },
        });
      }

      if (existingUser.role === "STUDENT") {
        await prisma.student.deleteMany({
          where: { userId: existingUser.id },
        });
      }

      // ✅ SAFE DELETE
      await prisma.user.delete({
        where: { id: existingUser.id },
      });

      return NextResponse.json({ message: "User removed" });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
