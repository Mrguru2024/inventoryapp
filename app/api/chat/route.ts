import { withRoleCheck } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { WebSocketServer } from "ws";
import { NextResponse } from "next/server";

const wss = new WebSocketServer({ noServer: true });

// Store active connections
const connections = new Map<number, WebSocket>();

wss.on("connection", (ws, userId) => {
  connections.set(userId as number, ws);

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      const { recipientId, content } = data;

      // Save message to database
      const newMessage = await prisma.message.create({
        data: {
          content,
          senderId: userId as number,
          recipientId,
        },
      });

      // Send message to recipient if they're connected
      const recipientWs = connections.get(recipientId);
      if (recipientWs) {
        recipientWs.send(JSON.stringify(newMessage));
      }
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(JSON.stringify({ error: "Failed to send message" }));
    }
  });

  ws.on("close", () => {
    connections.delete(userId as number);
  });
});

async function handler(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Upgrade the HTTP connection to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);
    wss.handleUpgrade(req, socket, Buffer.from([]), (ws) => {
      wss.emit("connection", ws, userId);
    });

    return response;
  } catch (error) {
    console.error("Error handling WebSocket connection:", error);
    return NextResponse.json(
      { error: "Failed to establish WebSocket connection" },
      { status: 500 }
    );
  }
}

export const GET = withRoleCheck(handler, "ADMIN");
