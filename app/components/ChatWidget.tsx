"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
}

interface ChatWidgetProps {
  isAdmin?: boolean;
}

export default function ChatWidget({ isAdmin = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const { data: session } = useSession();
  const [isMinimized, setIsMinimized] = useState(false);

  const { sendMessage, isConnected } = useWebSocket({
    onMessage: (message) => {
      setMessages((prev) => [...prev, message]);
    },
    onError: (error) => {
      toast.error("Chat error: " + error.message);
    },
    onStatusChange: (status) => {
      if (status === "connected") {
        toast.success("Chat connected");
      } else if (status === "disconnected") {
        toast.error("Chat disconnected");
      }
    },
  });

  // Fetch users for admin
  useEffect(() => {
    if (isAdmin) {
      fetch("/api/admin/users")
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.map((user: any) => ({ id: user.id, name: user.name })));
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          toast.error("Failed to fetch users");
        });
    }
  }, [isAdmin]);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetch(`/api/chat/history?userId=${selectedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
          toast.error("Failed to fetch chat history");
        });
    }
  }, [selectedUser]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    const success = sendMessage(selectedUser.id, newMessage.trim());
    if (success) {
      setNewMessage("");
    }
  };

  if (!session?.user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Open chat"
        >
          <ChatBubbleLeftIcon className="h-6 w-6" />
        </button>
      ) : (
        <div
          className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${
            isMinimized ? "w-64" : "w-96"
          }`}
        >
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-semibold">
              {isAdmin ? "Admin Chat" : "Chat with Support"}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-500 hover:text-gray-700"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? "□" : "−"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close chat"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="p-4">
              {isAdmin ? (
                <div className="mb-4">
                  <label
                    htmlFor="user-select"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select User
                  </label>
                  <select
                    id="user-select"
                    value={selectedUser?.id || ""}
                    onChange={(e) => {
                      const user = users.find(
                        (u) => u.id === Number(e.target.value)
                      );
                      setSelectedUser(user || null);
                      setMessages([]);
                    }}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a user to chat with</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Chatting with: {selectedUser?.name || "Support Team"}
                  </p>
                </div>
              )}

              <div className="h-64 overflow-y-auto mb-4 space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === session.user.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-2 ${
                        message.senderId === session.user.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-75">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedUser}
                  aria-label="Chat message input"
                />
                <button
                  type="submit"
                  disabled={!selectedUser || !newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
