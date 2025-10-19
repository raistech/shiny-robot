import prisma from "../db/client";

export type Config = {
  id: number;
  name: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

export async function getDefaultConfig() {
  return prisma.config.findUnique({ where: { name: "default" } });
}

export async function setDefaultConfig(settings: Record<string, any>) {
  return prisma.config.upsert({
    where: { name: "default" },
    update: { settings },
    create: { name: "default", settings },
  });
}

export async function getConfigByName(name: string) {
  return prisma.config.findUnique({ where: { name } });
}
