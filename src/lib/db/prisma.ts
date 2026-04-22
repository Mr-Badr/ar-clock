import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import type { PrismaClient as PrismaClientInstance } from "@/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __miqatonaPrisma__: PrismaClientInstance | undefined;
}

function createPrismaClient(): PrismaClientInstance {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("[env] DATABASE_URL is required for Prisma/PostgreSQL access");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = global.__miqatonaPrisma__ ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__miqatonaPrisma__ = prisma;
}
