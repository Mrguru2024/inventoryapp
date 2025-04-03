import { prisma } from "@/lib/prisma";

async function checkDatabase() {
  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log("Database connection successful");

    // Try to query the User table
    const userCount = await prisma.user.count();
    console.log("Number of users in database:", userCount);

    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true,
      },
    });
    console.log("Users in database:", users);
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
