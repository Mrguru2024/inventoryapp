import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { UserRole } from "@/lib/auth/types";

async function createAdminUser() {
  try {
    // First, check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    const password = "admin123";
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin User",
        role: UserRole.ADMIN,
        isApproved: true,
      },
    });

    console.log("Admin user created successfully:", {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isApproved: user.isApproved,
    });
    console.log("Password:", password);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
