import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { UserRole } from "@/lib/auth/types";

async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = UserRole.ADMIN
) {
  try {
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        isApproved: true,
      },
    });

    console.log("User created successfully:", {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isApproved: user.isApproved,
    });
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Create an admin user
createUser("admin@example.com", "admin123", "Admin User", UserRole.ADMIN);
