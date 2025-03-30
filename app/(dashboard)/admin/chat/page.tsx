"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import { toast } from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface WebSocketMessage {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
}

interface Message extends WebSocketMessage {
  sender: {
    id: number;
    name: string;
  };
  recipient: {
    id: number;
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export default function AdminChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);

  const { sendMessage, isConnected } = useWebSocket({
    onMessage: (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message as Message]);
      // Update user's last message and unread count
      setUsers((prev) =>
        prev.map((user) =>
          user.id === message.senderId
            ? {
                ...user,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
                unreadCount: user.unreadCount + 1,
              }
            : user
        )
      );
    },
    onError: (error) => {
      toast.error("Chat error: " + error.message);
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch users and their last messages
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetch(`/api/chat/history?userId=${selectedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
          // Mark messages as read
          fetch(`/api/chat/mark-read?userId=${selectedUser.id}`, {
            method: "POST",
          }).then(() => {
            setUsers((prev) =>
              prev.map((user) =>
                user.id === selectedUser.id ? { ...user, unreadCount: 0 } : user
              )
            );
          });
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" || (filter === "unread" && user.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Chat Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "unread")}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter messages"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
          </select>
          <button
            onClick={() => {
              fetch("/api/admin/users")
                .then((res) => res.json())
                .then(setUsers)
                .catch((error) => {
                  console.error("Error refreshing users:", error);
                  toast.error("Failed to refresh users");
                });
            }}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-label="Refresh users"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Users List */}
        <div className="col-span-4 bg-white rounded-lg shadow overflow-hidden">
          <div className="h-[calc(100vh-12rem)] overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedUser?.id === user.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {user.lastMessage}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {user.lastMessageTime && (
                      <p className="text-xs text-gray-500">
                        {new Date(user.lastMessageTime).toLocaleTimeString()}
                      </p>
                    )}
                    {user.unreadCount > 0 && (
                      <span className="inline-block bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-8 bg-white rounded-lg shadow overflow-hidden">
          {selectedUser ? (
            <>
              <div className="p-4 border-b">
                <h2 className="font-semibold">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>

              <div className="h-[calc(100vh-16rem)] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === session?.user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.senderId === session?.user?.id
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

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Chat message input"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-[calc(100vh-12rem)] flex items-center justify-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
