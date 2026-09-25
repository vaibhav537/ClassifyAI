import { getEduReelUser } from "@/lib/edureels";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await getEduReelUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "STUDENT" && user.role !== "TEACHER") {
    return NextResponse.json({ error: "Only teachers and students can upload" }, { status: 403 });
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !secret) {
    return NextResponse.json({ error: "Video uploads are not configured" }, { status: 503 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `edureels/${user.campusId}/${user.id}/${randomUUID()}`;
  // Sign the string value exactly as it is sent in the upload form.
  const overwrite = "false";
  const signature = cloudinary.utils.api_sign_request(
    { public_id: publicId, timestamp, overwrite },
    secret,
  );
  return NextResponse.json({ cloudName, apiKey, timestamp, publicId, overwrite, signature });
}
