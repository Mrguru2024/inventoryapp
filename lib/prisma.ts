import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["query", "error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

if (!global.prisma) {
  global.prisma = prismaClientSingleton();
}

export const prisma = global.prisma;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
