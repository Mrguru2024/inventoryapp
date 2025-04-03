import { NextRequest } from "next/server";
import { withRoleCheck } from "@/lib/api/withRoleCheck";
import { prisma } from "@/app/lib/prisma";
import { UserRole } from "@/app/lib/auth/types";

type RouteContext = {
  params: Record<string, never>;
};

async function handler(request: NextRequest, context: RouteContext) {
  try {
    const { messageIds } = await request.json();
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return Response.json(
        { error: "Message IDs are required" },
        { status: 400 }
      );
    }

    await prisma.message.updateMany({
      where: {
        id: {
          in: messageIds,
        },
      },
      data: {
        isRead: true,
      },
    });

    return Response.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return Response.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}

export const POST = withRoleCheck<RouteContext>(handler, UserRole.ADMIN);
