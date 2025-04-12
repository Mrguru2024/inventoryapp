import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUsers() {
  const users = [
    {
      email: "admin@test.com",
      password: "admin123",
      name: "Admin User",
      role: "ADMIN",
      isApproved: true,
    },
    {
      email: "manager@test.com",
      password: "manager123",
      name: "Manager User",
      role: "MANAGER",
      isApproved: true,
    },
    {
      email: "technician@test.com",
      password: "tech123",
      name: "Technician User",
      role: "TECHNICIAN",
      isApproved: true,
    },
  ];

  for (const user of users) {
    const hashedPassword = await hash(user.password, 12);

    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          password: hashedPassword,
          role: user.role,
          isApproved: user.isApproved,
        },
        create: {
          email: user.email,
          password: hashedPassword,
          name: user.name,
          role: user.role,
          isApproved: user.isApproved,
        },
      });
      console.log(`Created/Updated user: ${user.email}`);
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }
}

createTestUsers()
  .then(() => {
    console.log("Test users created successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error creating test users:", error);
    process.exit(1);
  });
