import { PrismaClient } from "@prisma/client"

// Prevents creating a new PrismaClient (and new DB connections) on every
// hot-reload in dev, which is a common cause of Neon connection exhaustion.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
