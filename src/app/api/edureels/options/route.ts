import { getCourseOptions, getEduReelUser } from "@/lib/edureels";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getEduReelUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await getCourseOptions(user);
  return NextResponse.json({ courses });
}
