import { NextRequest } from "next/server";
import { withRoleCheck } from "@/lib/api/withRoleCheck";
import { prisma } from "@/app/lib/prisma";
import { UserRole } from "@/app/lib/auth/types";

type RouteContext = {
  params: Record<string, never>;
};

async function handler(request: NextRequest, context: RouteContext) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return Response.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

export const GET = withRoleCheck<RouteContext>(handler, UserRole.ADMIN);
