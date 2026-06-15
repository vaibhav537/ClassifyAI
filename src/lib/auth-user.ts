import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentSessionUser() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const cookieToken = cookieStore.get("session-token")?.value;
  const authHeader = headersList.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")? authHeader.slice(7) : null;
  const sessionToken = cookieToken || bearerToken;
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
