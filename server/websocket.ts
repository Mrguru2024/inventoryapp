import { WebSocketServer, WebSocket } from "ws";
import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "http";
import { parse } from "url";
import { parse as parseCookie } from "cookie";

const prisma = new PrismaClient();
const wss = new WebSocketServer({ port: 3001 });
const connections = new Map<string, WebSocket>();
const connectionAttempts = new Map<string, number>();
const connectionTimestamps = new Map<string, number>();
const pendingConnections = new Map<string, NodeJS.Timeout>();
const connectionStates = new Map<
  string,
  "connecting" | "connected" | "disconnected"
>();
const connectionTimeouts = new Map<string, NodeJS.Timeout>();
const connectionRetryDelays = new Map<string, number>();
const connectionCounts = new Map<string, number>();
const connectionEstablished = new Map<string, boolean>();
const connectionDebounceTimeouts = new Map<string, NodeJS.Timeout>();
const connectionLocks = new Map<string, boolean>();
const connectionCooldowns = new Map<string, NodeJS.Timeout>();

async function getUserIdFromRequest(
  req: IncomingMessage
): Promise<string | null> {
  try {
    const cookies = parseCookie(req.headers.cookie || "");
    const sessionToken = cookies["next-auth.session-token"];
    if (!sessionToken) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    return session?.user?.id || null;
  } catch (error) {
    console.error("Error getting user ID from request:", error);
    return null;
  }
}

function cleanupConnection(userId: string) {
  // Clear all timeouts
  const timeouts = [
    connectionDebounceTimeouts,
    pendingConnections,
    connectionTimeouts,
    connectionCooldowns,
  ];

  timeouts.forEach((map) => {
    const timeout = map.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      map.delete(userId);
    }
  });

  // Reset connection state
  connectionStates.delete(userId);
  connectionEstablished.delete(userId);
  connectionLocks.delete(userId);
  connectionAttempts.delete(userId);
  connectionTimestamps.delete(userId);
  connectionRetryDelays.delete(userId);
  connectionCounts.delete(userId);
}

console.log("WebSocket server started on port 3001");

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    console.log("WebSocket connection rejected - no user ID");
    ws.close(1008, "No user ID provided");
    return;
  }

  // Clean up any existing connection state
  cleanupConnection(userId);

  // Set initial connection state
  connectionStates.set(userId, "connecting");
  connectionEstablished.set(userId, false);
  connectionAttempts.set(userId, (connectionAttempts.get(userId) || 0) + 1);
  connectionTimestamps.set(userId, Date.now());

  console.log(
    `Connection attempt ${connectionAttempts.get(userId)} for user ${userId}`
  );

  // Set a connection timeout
  const timeout = setTimeout(() => {
    if (connectionStates.get(userId) === "connecting") {
      console.log(`Connection timeout for user ${userId}`);
      ws.close(1000, "Connection timeout");
      cleanupConnection(userId);
    }
  }, 5000);
  connectionTimeouts.set(userId, timeout);

  // Handle connection open
  ws.on("open", () => {
    console.log(`User ${userId} is connected`);
    clearTimeout(timeout);
    connectionTimeouts.delete(userId);
    connectionStates.set(userId, "connected");
    connections.set(userId, ws);
    connectionEstablished.set(userId, true);
    connectionRetryDelays.set(userId, 2000); // Reset delay on successful connection

    // Send a connection confirmation message
    ws.send(JSON.stringify({ type: "connected", userId }));
  });

  // Handle messages
  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      const { recipientId, content } = data;

      if (!recipientId || !content) {
        throw new Error("Missing required fields");
      }

      // Save message to database
      const savedMessage = await prisma.message.create({
        data: {
          content,
          senderId: userId,
          recipientId,
        },
      });

      // Send message to recipient if they're connected
      const recipientWs = connections.get(recipientId);
      if (recipientWs) {
        recipientWs.send(JSON.stringify(savedMessage));
      } else {
        console.log(`Recipient ${recipientId} is not connected`);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(
        JSON.stringify({
          error: "Failed to process message",
          details: error instanceof Error ? error.message : "Unknown error",
        })
      );
    }
  });

  // Handle connection close
  ws.on("close", (code, reason) => {
    console.log(
      `User ${userId} disconnected. Code: ${code}, Reason: ${reason}`
    );
    connections.delete(userId);
    cleanupConnection(userId);
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error(`WebSocket error for user ${userId}:`, error);
    connections.delete(userId);
    cleanupConnection(userId);
  });
});

// Handle server shutdown
process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...");
  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit(0);
  });
});
