import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentSessionUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token")?.value;
  if (!sessionToken) return null;
  const session = await prisma.session.findFirst({
    where: {
      sessionToken,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      },
    },
  });
  return session?.user ?? null;
}
