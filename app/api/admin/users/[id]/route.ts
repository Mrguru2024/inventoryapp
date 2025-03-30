import { NextResponse } from "next/server";
import { withRoleCheck } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function handler(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  if (request.method === "PUT") {
    try {
      const body = await request.json();
      const { name, email, role } = body;

      // Validate required fields
      if (!name || !email || !role) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          role,
        },
      });

      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
  }

  if (request.method === "DELETE") {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Prevent deleting the last admin
      if (user.role === "ADMIN") {
        const adminCount = await prisma.user.count({
          where: { role: "ADMIN" },
        });

        if (adminCount <= 1) {
          return NextResponse.json(
            { error: "Cannot delete the last admin user" },
            { status: 400 }
          );
        }
      }

      await prisma.user.delete({
        where: { id: userId },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const PUT = withRoleCheck(handler, "ADMIN");
export const DELETE = withRoleCheck(handler, "ADMIN");
