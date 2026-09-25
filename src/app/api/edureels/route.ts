import { EduReelStatus, Prisma } from "@/generated/prisma";
import { getCourseOptions, getEduReelUser, reelForClient, reelInclude, ReelWithDetails } from "@/lib/edureels";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().trim().min(4).max(120),
  description: z.string().trim().max(500).optional(),
  learningOutcome: z.string().trim().min(5).max(160),
  subjectId: z.string().min(1),
  semesterId: z.string().min(1),
  sectionId: z.string().min(1),
  videoPublicId: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const user = await getEduReelUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const mode = params.get("mode") || "feed";
  if (!["feed", "saved", "mine"].includes(mode)) {
    return NextResponse.json({ error: "Invalid feed" }, { status: 400 });
  }
  const offset = Math.max(0, Math.min(1000, Number.parseInt(params.get("offset") || "0", 10) || 0));
  const take = 10;
  const campusId = user.campusId!;
  let reels: ReelWithDetails[];
  let hasMore: boolean;
  let courseIds: string[] = [];

  if (mode === "feed" && user.role === "STUDENT") {
    const student = user.studentProfile;
    if (student?.semesterId && student.sectionId) {
      const courses = await getCourseOptions(user);
      courseIds = courses.map((c) => c.subjectId);
    }
  }

  if (mode === "feed" && courseIds.length > 0 && user.studentProfile?.semesterId && user.studentProfile.sectionId) {
    // Rank a student's exact class first, then their subjects, then the campus.
    // Sorting in SQL keeps pagination stable even as the campus feed grows.
    const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "EduReel"
      WHERE "campusId" = ${campusId} AND "status" = 'APPROVED'
      ORDER BY CASE
        WHEN "subjectId" IN (${Prisma.join(courseIds)})
          AND "semesterId" = ${user.studentProfile.semesterId}
          AND "sectionId" = ${user.studentProfile.sectionId} THEN 0
        WHEN "subjectId" IN (${Prisma.join(courseIds)}) THEN 1
        ELSE 2 END,
        "publishedAt" DESC, "id" DESC
      LIMIT ${take + 1} OFFSET ${offset}
    `);
    hasMore = rows.length > take;
    const ids = rows.slice(0, take).map((row) => row.id);
    const found = await prisma.eduReel.findMany({
      where: { id: { in: ids }, campusId, status: EduReelStatus.APPROVED },
      include: reelInclude,
    });
    const byId = new Map(found.map((reel) => [reel.id, reel]));
    reels = ids.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : []));
  } else {
    const where: Prisma.EduReelWhereInput = {
      campusId,
      ...(mode === "mine" ? { authorId: user.id } : { status: EduReelStatus.APPROVED }),
      ...(mode === "saved" ? { saves: { some: { userId: user.id } } } : {}),
    };
    const result = await prisma.eduReel.findMany({
      where,
      include: reelInclude,
      orderBy: mode === "mine"
        ? [{ createdAt: "desc" as const }, { id: "desc" as const }]
        : [{ publishedAt: "desc" as const }, { id: "desc" as const }],
      skip: offset,
      take: take + 1,
    });
    hasMore = result.length > take;
    reels = result.slice(0, take);
  }

  const saves = reels.length
    ? await prisma.eduReelSave.findMany({
        where: { userId: user.id, reelId: { in: reels.map((reel) => reel.id) } },
        select: { reelId: true },
      })
    : [];
  const savedIds = new Set(saves.map((save) => save.reelId));
  return NextResponse.json({
    reels: reels.map((reel) => {
      const relevance =
        courseIds.includes(reel.subjectId) &&
        reel.semesterId === user.studentProfile?.semesterId &&
        reel.sectionId === user.studentProfile?.sectionId
          ? "Your class"
          : courseIds.includes(reel.subjectId) ? "Your subject" : "Campus";
      return reelForClient(reel, savedIds.has(reel.id), relevance);
    }),
    hasMore,
  });
}

export async function POST(req: NextRequest) {
  const user = await getEduReelUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "STUDENT" && user.role !== "TEACHER") {
    return NextResponse.json({ error: "Only teachers and students can post" }, { status: 403 });
  }
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Check the reel details" }, { status: 400 });
  const data = parsed.data;
  const course = (await getCourseOptions(user)).find(
    (item) => item.subjectId === data.subjectId && item.semesterId === data.semesterId && item.sectionId === data.sectionId,
  );
  if (!course) return NextResponse.json({ error: "This class is not assigned to you" }, { status: 403 });

  const prefix = `edureels/${user.campusId}/${user.id}/`;
  if (!data.videoPublicId.startsWith(prefix) || !/^[0-9a-f-]{36}$/.test(data.videoPublicId.slice(prefix.length))) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  const existing = await prisma.eduReel.findUnique({ where: { videoPublicId: data.videoPublicId } });
  if (existing) {
    if (existing.authorId === user.id && existing.campusId === user.campusId) {
      return NextResponse.json({ id: existing.id, status: existing.status });
    }
    return NextResponse.json({ error: "This video has already been posted" }, { status: 409 });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Video uploads are not configured" }, { status: 503 });
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  let asset;
  try {
    asset = await cloudinary.api.resource(data.videoPublicId, { resource_type: "video" });
  } catch {
    return NextResponse.json({ error: "Video upload could not be verified" }, { status: 400 });
  }
  const duration = Number(asset.duration);
  const bytes = Number(asset.bytes);
  const width = Number(asset.width);
  const height = Number(asset.height);
  const uploadTime = new Date(asset.created_at).getTime();
  if (
    !["mp4", "webm"].includes(asset.format) ||
    !Number.isFinite(duration) || duration < 3 || duration > 90 ||
    !Number.isFinite(bytes) || bytes > 50 * 1024 * 1024 ||
    !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height < width ||
    !Number.isFinite(uploadTime) || Date.now() - uploadTime > 24 * 60 * 60 * 1000
  ) {
    try {
      await cloudinary.uploader.destroy(data.videoPublicId, { resource_type: "video" });
    } catch (cleanupError) {
      console.error("[EDUREELS_INVALID_VIDEO_CLEANUP]", cleanupError);
    }
    return NextResponse.json({ error: "Use a vertical MP4/WebM video, 3–90 seconds and under 50 MB" }, { status: 400 });
  }

  const isTeacher = user.role === "TEACHER";
  const reel = await prisma.eduReel.create({
    data: {
      title: data.title,
      description: data.description || null,
      learningOutcome: data.learningOutcome,
      videoPublicId: data.videoPublicId,
      videoUrl: asset.secure_url,
      durationSeconds: duration,
      authorId: user.id,
      campusId: user.campusId!,
      subjectId: data.subjectId,
      semesterId: data.semesterId,
      sectionId: data.sectionId,
      status: isTeacher ? EduReelStatus.APPROVED : EduReelStatus.PENDING,
      publishedAt: isTeacher ? new Date() : null,
    },
    select: { id: true, status: true },
  });

  if (!isTeacher) {
    try {
      const [teachers, assistants] = await Promise.all([
        prisma.teacherSubject.findMany({
          where: { subjectId: data.subjectId, semesterId: data.semesterId, sectionId: data.sectionId, teacher: { user: { campusId: user.campusId! } } },
          select: { teacher: { select: { userId: true } } },
        }),
        prisma.user.findMany({ where: { campusId: user.campusId!, role: "ASSISTANT" }, select: { id: true } }),
      ]);
      const recipients = new Set([...teachers.map((item) => item.teacher.userId), ...assistants.map((item) => item.id)]);
      if (recipients.size) {
        await prisma.notification.createMany({ data: [...recipients].map((userId) => ({
          userId,
          title: "EduReel awaiting review",
          body: `${user.name} submitted a ${course.subject.name} reel`,
          meta: { link: "/edureels?tab=review", reelId: reel.id },
        })) });
      }
    } catch (notificationError) {
      console.error("[EDUREELS_REVIEW_NOTIFICATION]", notificationError);
    }
  }
  return NextResponse.json(reel, { status: 201 });
}
