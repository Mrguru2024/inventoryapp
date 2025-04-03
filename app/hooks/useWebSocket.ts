import { useSSE } from "./useSSE";

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

export function useWebSocket(props: UseWebSocketProps = {}) {
  return useSSE(props);
}
