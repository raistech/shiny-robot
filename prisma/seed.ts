import prisma from "../src/db/client";

async function main() {
  // Ensure a default config exists with baseline settings
  const defaultSettings = {
    defaultLocale: "en",
    moderation: {
      warningsThreshold: 3,
      decayDays: 30,
      sanctions: ["mute", "kick", "ban"],
    },
    rateLimit: {
      windowSeconds: 60,
      maxActions: 20,
    },
  };

  await prisma.config.upsert({
    where: { name: "default" },
    update: { settings: defaultSettings },
    create: { name: "default", settings: defaultSettings },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
