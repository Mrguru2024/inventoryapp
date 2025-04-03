import { useEffect, useRef, useCallback, useState } from "react";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
}

interface UseSSEProps {
  onMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (
    status: "connecting" | "connected" | "disconnected" | "error"
  ) => void;
}

// Keep track of connection state across hook instances
const globalState = {
  hasActiveConnection: false,
  activeEventSource: null as EventSource | null,
  activeConnections: 0,
  isInitializing: false,
  lastMountTime: 0,
  mountCount: 0,
  isFastRefresh: false,
  pendingCleanup: false,
  lastUnmountTime: 0,
  isInitialized: false,
};

export function useSSE({
  onMessage,
  onError,
  onStatusChange,
}: UseSSEProps = {}) {
  const eventSource = useRef<EventSource | null>(null);
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const isConnecting = useRef(false);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;
  const isUnmounting = useRef(false);
  const fastRefreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const stableConnectionTimeout = useRef<NodeJS.Timeout | null>(null);
  const isClient = useRef(false);
  const hasInitialized = useRef(false);

  const cleanup = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    if (fastRefreshTimeout.current) {
      clearTimeout(fastRefreshTimeout.current);
      fastRefreshTimeout.current = null;
    }
    if (stableConnectionTimeout.current) {
      clearTimeout(stableConnectionTimeout.current);
      stableConnectionTimeout.current = null;
    }

    // Only decrement if we actually had a connection and we're not in Fast Refresh
    if (
      eventSource.current &&
      hasInitialized.current &&
      !globalState.isFastRefresh
    ) {
      globalState.activeConnections = Math.max(
        0,
        globalState.activeConnections - 1
      );
      console.log(
        `Active connections decremented: ${globalState.activeConnections}`
      );
    }

    // Only clean up the global connection if this is the last instance and we're not in Fast Refresh
    if (
      globalState.activeConnections === 0 &&
      !globalState.isFastRefresh &&
      eventSource.current
    ) {
      console.log("Cleaning up last SSE connection");
      eventSource.current.close();
      eventSource.current = null;
      globalState.activeEventSource = null;
      globalState.hasActiveConnection = false;
      globalState.isInitializing = false;
      globalState.isInitialized = false;
    }

    isConnecting.current = false;
  }, []);

  const connect = useCallback(() => {
    if (
      !session?.user?.id ||
      isConnecting.current ||
      isUnmounting.current ||
      status !== "authenticated" ||
      !isClient.current ||
      globalState.isInitializing
    ) {
      return;
    }

    // If we already have an active connection, use it
    if (globalState.activeEventSource && globalState.hasActiveConnection) {
      eventSource.current = globalState.activeEventSource;
      if (!hasInitialized.current) {
        globalState.activeConnections++;
        hasInitialized.current = true;
        globalState.isInitialized = true;
        console.log(
          `Reusing connection. Active connections: ${globalState.activeConnections}`
        );
      }
      setIsConnected(true);
      onStatusChange?.("connected");
      return;
    }

    globalState.isInitializing = true;
    isConnecting.current = true;
    onStatusChange?.("connecting");

    const url = new URL("/api/chat/stream", window.location.origin);
    url.searchParams.append("userId", session.user.id.toString());

    try {
      eventSource.current = new EventSource(url.toString());
      globalState.activeEventSource = eventSource.current;
      if (!hasInitialized.current) {
        globalState.activeConnections++;
        hasInitialized.current = true;
        globalState.isInitialized = true;
        console.log(
          `New connection created. Active connections: ${globalState.activeConnections}`
        );
      }

      eventSource.current.onopen = () => {
        console.log("SSE connection opened");
        globalState.isInitializing = false;

        // Wait for connection to stabilize before marking as connected
        if (stableConnectionTimeout.current) {
          clearTimeout(stableConnectionTimeout.current);
        }

        stableConnectionTimeout.current = setTimeout(() => {
          if (!isUnmounting.current) {
            globalState.hasActiveConnection = true;
            setIsConnected(true);
            onStatusChange?.("connected");
            reconnectAttempts.current = 0;
            console.log("SSE connection stable");
          }
        }, 1000);
      };

      eventSource.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error("Error parsing SSE message:", error);
          onError?.(
            error instanceof Error
              ? error
              : new Error("Failed to parse message")
          );
        }
      };

      eventSource.current.onerror = (event) => {
        console.error("SSE connection error:", event);
        setIsConnected(false);
        globalState.hasActiveConnection = false;
        globalState.isInitializing = false;
        globalState.isInitialized = false;
        onStatusChange?.("error");
        onError?.(new Error("SSE connection error"));

        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts.current),
            10000
          );

          console.log(
            `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`
          );

          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
          }

          reconnectTimeout.current = setTimeout(() => {
            if (!isUnmounting.current) {
              cleanup();
              connect();
            }
          }, delay);
        } else {
          console.log("Max reconnection attempts reached");
          onStatusChange?.("disconnected");
        }
      };
    } catch (error) {
      console.error("Error creating SSE connection:", error);
      setIsConnected(false);
      globalState.hasActiveConnection = false;
      globalState.isInitializing = false;
      globalState.isInitialized = false;
      onStatusChange?.("error");
      onError?.(
        error instanceof Error
          ? error
          : new Error("Failed to create connection")
      );
    } finally {
      isConnecting.current = false;
    }
  }, [session?.user?.id, status, cleanup, onMessage, onError, onStatusChange]);

  useEffect(() => {
    isClient.current = true;
    globalState.mountCount++;
    const now = Date.now();
    const timeSinceLastMount = now - globalState.lastMountTime;
    const timeSinceLastUnmount = now - globalState.lastUnmountTime;
    globalState.lastMountTime = now;

    // Detect Fast Refresh (component remounted within 2 seconds of last unmount)
    if (globalState.mountCount > 1 && timeSinceLastUnmount < 2000) {
      console.log("Fast Refresh detected, preserving connection");
      globalState.isFastRefresh = true;

      // If we have an active connection, preserve it
      if (globalState.activeEventSource && globalState.hasActiveConnection) {
        eventSource.current = globalState.activeEventSource;
        setIsConnected(true);
        onStatusChange?.("connected");
      }

      // Reset Fast Refresh flag after a delay
      if (fastRefreshTimeout.current) {
        clearTimeout(fastRefreshTimeout.current);
      }
      fastRefreshTimeout.current = setTimeout(() => {
        globalState.isFastRefresh = false;
        console.log("Fast Refresh period ended");
        // If we have a pending cleanup, execute it now
        if (globalState.pendingCleanup) {
          globalState.pendingCleanup = false;
          cleanup();
        }
      }, 2000);

      return;
    }

    // Attempt to connect if not already initialized
    if (!globalState.isInitialized) {
      connect();
    }

    return () => {
      isUnmounting.current = true;
      globalState.lastUnmountTime = Date.now();

      // Only cleanup if we're not in Fast Refresh
      if (!globalState.isFastRefresh) {
        cleanup();
      } else {
        // Mark cleanup as pending if we're in Fast Refresh
        globalState.pendingCleanup = true;
      }
    };
  }, [connect, cleanup, onStatusChange]);

  const sendMessage = useCallback(
    async (recipientId: number, content: string) => {
      if (!session?.user?.id) {
        console.error("Not authenticated");
        onError?.(new Error("Not authenticated"));
        return false;
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientId,
            content,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        onError?.(
          error instanceof Error ? error : new Error("Failed to send message")
        );
        return false;
      }
    },
    [session?.user?.id, onError]
  );

  return {
    isConnected,
    connect,
    disconnect: cleanup,
    sendMessage,
  };
}
