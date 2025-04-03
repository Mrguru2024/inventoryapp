import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

async function checkUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        isApproved: true,
      },
    });

    if (!user) {
      console.log("No user found with email:", email);
      return;
    }

    // Test password comparison
    const testPassword = "admin123";
    const isValid = await compare(testPassword, user.password || "");

    console.log("User found:", {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isApproved: user.isApproved,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      passwordHash: user.password,
      testPassword: testPassword,
      isValidPassword: isValid,
    });
  } catch (error) {
    console.error("Error checking user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check the admin user
checkUser("admin@example.com");
