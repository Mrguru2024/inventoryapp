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

    const { message } = await request.json();
    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const newMessage = await prisma.message.create({
      data: {
        content: message,
        senderId: request.headers.get("x-user-id") || "",
        recipientId: userId,
      },
    });

    return Response.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export const POST = withRoleCheck(handler, UserRole.ADMIN);
