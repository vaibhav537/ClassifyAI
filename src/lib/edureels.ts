import { Prisma } from "@/generated/prisma";
import { getCurrentSessionUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export type ReelUser = NonNullable<Awaited<ReturnType<typeof getCurrentSessionUser>>>;

export const reelInclude = {
  author: { select: { id: true, name: true, avatarUrl: true, role: true } },
  subject: { select: { name: true } },
  semester: { select: { name: true } },
  section: { select: { name: true } },
  _count: { select: { saves: true, reports: true } },
} as const;

export type ReelWithDetails = Prisma.EduReelGetPayload<{
  include: typeof reelInclude;
}>;

export async function getEduReelUser() {
  const user = await getCurrentSessionUser();
  if (!user?.campusId || user.role === "ADMIN") return null;
  return user;
}

export async function getCourseOptions(user: ReelUser) {
  if (user.role === "STUDENT") {
    const student = user.studentProfile;
    if (!student?.semesterId || !student.sectionId) return [];

    const assignments = await prisma.teacherSubject.findMany({
      where: {
        semesterId: student.semesterId,
        sectionId: student.sectionId,
        subject: { campusId: user.campusId! },
      },
      select: {
        subjectId: true,
        semesterId: true,
        sectionId: true,
        subject: { select: { name: true } },
        semester: { select: { name: true } },
        section: { select: { name: true } },
      },
    });
    return Array.from(
      new Map<string, (typeof assignments)[number]>(
        assignments.map((assignment) => [assignment.subjectId, assignment]),
      ).values(),
    );
  }

  if (user.role === "TEACHER" && user.teacherProfile) {
    return prisma.teacherSubject.findMany({
      where: {
        teacherId: user.teacherProfile.id,
        subject: { campusId: user.campusId! },
      },
      select: {
        subjectId: true,
        semesterId: true,
        sectionId: true,
        subject: { select: { name: true } },
        semester: { select: { name: true } },
        section: { select: { name: true } },
      },
      orderBy: { subject: { name: "asc" } },
    });
  }
  return [];
}

export function reviewScope(user: ReelUser, courses: Awaited<ReturnType<typeof getCourseOptions>>) {
  if (user.role === "ASSISTANT") return {};
  if (user.role !== "TEACHER") return { id: "__none__" };
  return {
    OR: courses.length
      ? courses.map(({ subjectId, semesterId, sectionId }) => ({
          subjectId,
          semesterId,
          sectionId,
        }))
      : [{ id: "__none__" }],
  };
}

export function canReviewReel(
  user: ReelUser,
  reel: { campusId: string; authorId: string; subjectId: string; semesterId: string; sectionId: string },
  courses: Awaited<ReturnType<typeof getCourseOptions>>,
) {
  if (reel.campusId !== user.campusId || reel.authorId === user.id) return false;
  if (user.role === "ASSISTANT") return true;
  return (
    user.role === "TEACHER" &&
    courses.some(
      (course) =>
        course.subjectId === reel.subjectId &&
        course.semesterId === reel.semesterId &&
        course.sectionId === reel.sectionId,
    )
  );
}

export function reelForClient(reel: ReelWithDetails, saved = false, relevance = "Campus") {
  return {
    id: reel.id,
    title: reel.title,
    description: reel.description,
    learningOutcome: reel.learningOutcome,
    videoUrl: reel.videoUrl,
    durationSeconds: reel.durationSeconds,
    author: reel.author,
    subject: reel.subject.name,
    semester: reel.semester.name,
    section: reel.section.name,
    status: reel.status,
    reviewReason: reel.reviewReason,
    createdAt: reel.createdAt,
    saved,
    saves: reel._count.saves,
    relevance,
  };
}
