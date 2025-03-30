import { withRoleCheck } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: parseInt(userId) }, { recipientId: parseInt(userId) }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
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

export const GET = withRoleCheck(handler, "ADMIN");
