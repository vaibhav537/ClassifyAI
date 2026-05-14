// prisma/seedPremiumPlans.js
import { prisma } from "../src/lib/prisma.js"; // adjust path if needed

async function main() {
  const plans = [
    {
      name: "STARTER",
      price: 0,
      features: [
        "Basic access",
        "View your attendance",
        "View timetable",
      ],
    },
    {
      name: "PRO",
      price: 499,
      features: [
        "Everything in STARTER",
        "AI Study Plan",
        "Advanced analytics",
      ],
    },
    {
      name: "ULTIMATE",
      price: 999,
      features: [
        "Everything in PRO",
        "Google Calendar Sync",
        "Priority support",
      ],
    },
  ];

  for (const plan of plans) {
    await prisma.planConfig.upsert({
      where: { name: plan.name },
      update: {
        price: plan.price,
        features: plan.features,
      },
      create: {
        name: plan.name,
        price: plan.price,
        features: plan.features,
      },
    });
    console.log(`Plan ${plan.name} added/updated`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
