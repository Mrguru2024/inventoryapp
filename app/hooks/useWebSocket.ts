import { useEffect, useRef, useCallback, useState } from "react";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
}

interface UseWebSocketProps {
  onMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (
    status: "connecting" | "connected" | "disconnected" | "error"
  ) => void;
}

export function useWebSocket({
  onMessage,
  onError,
  onStatusChange,
}: UseWebSocketProps = {}) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/api/chat?userId=${session?.user?.id}`;
  }, [session?.user?.id]);

  const connect = useCallback(() => {
    if (!session?.user?.id) {
      onStatusChange?.("disconnected");
      return;
    }

    try {
      onStatusChange?.("connecting");
      ws.current = new WebSocket(getWebSocketUrl());

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        onStatusChange?.("connected");
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          onError?.(
            error instanceof Error
              ? error
              : new Error("Failed to parse message")
          );
        }
      };

      ws.current.onerror = (event) => {
        console.error("WebSocket error:", event);
        setIsConnected(false);
        onStatusChange?.("error");
        onError?.(new Error("WebSocket connection error"));
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected", event.code, event.reason);
        setIsConnected(false);
        onStatusChange?.("disconnected");

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const backoffTime = Math.min(
            1000 * Math.pow(2, reconnectAttempts.current),
            30000
          );
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connect();
          }, backoffTime);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      onError?.(
        error instanceof Error
          ? error
          : new Error("Failed to create WebSocket connection")
      );
      onStatusChange?.("error");
    }
  }, [session?.user?.id, onMessage, onError, onStatusChange, getWebSocketUrl]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback(
    (recipientId: number, content: string) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        const error = new Error("WebSocket is not connected");
        onError?.(error);
        return false;
      }

      try {
        ws.current.send(JSON.stringify({ recipientId, content }));
        return true;
      } catch (error) {
        onError?.(
          error instanceof Error ? error : new Error("Failed to send message")
        );
        return false;
      }
    },
    [onError]
  );

  return { sendMessage, isConnected };
}
