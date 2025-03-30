import { withRoleCheck } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function handler(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { message } = await req.json();
    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Create a message in the database
    const newMessage = await prisma.message.create({
      data: {
        content: message,
        senderId: userId, // The admin's user ID
        recipientId: userId, // The target user's ID
      },
    });

    // Here you would typically integrate with your email service or notification system
    // For now, we'll just return the created message
    return Response.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export const POST = withRoleCheck(handler, "ADMIN");
