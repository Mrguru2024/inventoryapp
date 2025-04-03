"use client";

import { useState, useEffect, useRef } from "react";
import { useSSE } from "@/app/hooks/useSSE";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Card } from "@/app/components/ui/card";
import { MessageSquare, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
}

interface ChatWidgetProps {
  recipientId: number;
  recipientName: string;
}

export default function ChatWidget({
  recipientId,
  recipientName,
}: ChatWidgetProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { sendMessage, isConnected } = useSSE({
    onMessage: (message) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    },
    onError: (error) => {
      setError(error.message);
    },
    onStatusChange: (status) => {
      if (status === "error") {
        setError("Connection error");
      } else {
        setError(null);
      }
    },
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected || !session?.user?.id) return;

    const success = await sendMessage(
      Number(session.user.id),
      newMessage.trim()
    );
    if (success) {
      setNewMessage("");
    } else {
      setError("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-96 h-[500px] flex flex-col shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Chat with {recipientName}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.senderId === Number(session?.user?.id)
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.senderId === Number(session?.user?.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {error && (
              <div className="text-sm text-destructive text-center mb-4">
                {error}
              </div>
            )}
            {!isConnected && (
              <div className="text-sm text-muted-foreground text-center mb-4">
                Disconnected. Reconnecting...
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={!isConnected}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
