import { PrismaClient } from "@prisma/client";

// Avoid creating multiple PrismaClient instances in dev environments
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient({
  log: ["warn", "error"],
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
export { PrismaClient };
