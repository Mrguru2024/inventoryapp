import { NextRequest } from "next/server";
import { withRoleCheck } from "@/lib/api/withRoleCheck";
import { prisma } from "@/app/lib/prisma";
import { UserRole } from "@/app/lib/auth/types";

type RouteContext = {
  params: { [key: string]: string | string[] };
};

async function handler(request: NextRequest, context: RouteContext) {
  try {
    const userId = Array.isArray(context.params.id)
      ? context.params.id[0]
      : context.params.id;

    if (!userId) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (request.method === "GET") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      return Response.json(user);
    }

    if (request.method === "DELETE") {
      await prisma.user.delete({
        where: { id: userId },
      });

      return Response.json({ message: "User deleted successfully" });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("Error handling user:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = withRoleCheck(handler, UserRole.ADMIN);
export const DELETE = withRoleCheck(handler, UserRole.ADMIN);
