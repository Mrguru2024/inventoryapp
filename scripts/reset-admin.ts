import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { UserRole } from "@/lib/auth/types";

async function resetAdminUser() {
  try {
    // First, delete any existing admin user
    await prisma.user.deleteMany({
      where: { email: "admin@example.com" },
    });

    // Create a new admin user with a simple password
    const password = "password123";
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

resetAdminUser();
