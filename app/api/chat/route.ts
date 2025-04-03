import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { recipientId, content } = await request.json();

    if (!recipientId || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        recipientId,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
