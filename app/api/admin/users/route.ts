import { NextRequest } from "next/server";
import { withRoleCheck } from "@/lib/api/withRoleCheck";
import { prisma } from "@/app/lib/prisma";
import { UserRole } from "@/app/lib/auth/types";

type RouteContext = {
  params: Record<string, never>;
};

async function handler(request: NextRequest, context: RouteContext) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
      },
    });

    return Response.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export const GET = withRoleCheck<RouteContext>(handler, UserRole.ADMIN);
