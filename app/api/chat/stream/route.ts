import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId || userId !== session.user.id) {
    return new NextResponse("Invalid user ID", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(
          "data: " + JSON.stringify({ type: "connected" }) + "\n\n"
        )
      );

      let lastMessageId = 0;
      const pollInterval = setInterval(async () => {
        try {
          // Get new messages for this user
          const messages = await prisma.message.findMany({
            where: {
              OR: [{ recipientId: userId }, { senderId: userId }],
              id: {
                gt: lastMessageId.toString(),
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          });

          // Update last message ID
          if (messages.length > 0) {
            lastMessageId = parseInt(
              messages[messages.length - 1].id.toString()
            );
          }

          // Send messages to client
          messages.forEach((message) => {
            controller.enqueue(
              encoder.encode("data: " + JSON.stringify(message) + "\n\n")
            );
          });
        } catch (error) {
          console.error("Error polling messages:", error);
          controller.error(error);
        }
      }, 5000); // Poll every 5 seconds

      // Clean up on close
      return () => {
        clearInterval(pollInterval);
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
