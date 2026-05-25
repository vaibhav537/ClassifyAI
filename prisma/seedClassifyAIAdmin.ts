import { PrismaClient, Role } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@classifyai.com";
  const adminUsername = "classifyadmin";
  const adminPassword = "ClassifyAI@123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      name: "Classify AI Main Admin",
      username: adminUsername,
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      name: "Classify AI Main Admin",
      email: adminEmail,
      username: adminUsername,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Main admin created/updated successfully:");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    username: admin.username,
    role: admin.role,
  });

  console.log("\n🔐 Login Credentials:");
  console.log(`Email: ${adminEmail}`);
  console.log(`Username: ${adminUsername}`);
  console.log(`Password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });