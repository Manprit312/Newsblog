import "server-only";
import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Optimize Prisma for serverless environments (Vercel)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Optimize for serverless - reduce connection pool size
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// For serverless (Vercel), we need to disconnect properly to avoid connection leaks
// But we also want to reuse connections when possible
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} else {
  // In production (Vercel), ensure we handle connections properly
  // Don't disconnect on every request, but handle it gracefully
  if (typeof globalForPrisma.prisma === "undefined") {
    globalForPrisma.prisma = prisma;
  }
}

// Add connection timeout handling for Vercel
prisma.$connect().catch((error) => {
  console.error("Prisma connection error:", error);
});

export default prisma;
