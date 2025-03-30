"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { User, Role } from "@prisma/client";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useWebSocket } from "@/app/hooks/useWebSocket";

interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
}

interface UserWithRole extends User {
  role: Role;
  isApproved?: boolean;
}

export default function AdminUsersPage() {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { sendMessage } = useWebSocket({
    onMessage: (message) => {
      setMessages((prev) => [...prev, message]);
    },
    onError: (error) => {
      toast.error("Chat connection error: " + error.message);
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<UserWithRole[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch users");
      }
      return response.json();
    },
    enabled: status === "authenticated" && session?.user?.role === "ADMIN",
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      role: Role;
      password: string;
    }) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User added successfully");
      setIsAddingUser(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: {
      id: number;
      name: string;
      email: string;
      role: Role;
    }) => {
      const response = await fetch(`/api/admin/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      setIsEditing(null);
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Approve user mutation
  const approveUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to approve user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User approved successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      userId,
      message,
    }: {
      userId: number;
      message: string;
    }) => {
      const response = await fetch(`/api/admin/users/${userId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Message sent successfully");
      setIsMessaging(false);
      setMessage("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (user: UserWithRole) => {
    setIsEditing(user.id);
    setEditingUser(user);
  };

  const handleSave = () => {
    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
    }
  };

  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addUserMutation.mutate({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as Role,
      password: formData.get("password") as string,
    });
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser) {
      sendMessageMutation.mutate({
        userId: selectedUser.id,
        message,
      });
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && newMessage.trim()) {
      sendMessage(selectedUser.id, newMessage.trim());
      setNewMessage("");
    }
  };

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading users: {error.message}
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsAddingUser(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter user's name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter user's email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    aria-label="Select user role"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter user's password"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  aria-label="Cancel adding user"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  aria-label="Add new user"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {isMessaging && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Send Message to {selectedUser.name}
            </h2>
            <form onSubmit={handleSendMessage}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your message"
                    aria-label="Message content"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsMessaging(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  aria-label="Cancel sending message"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  aria-label="Send message"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Chat Panel */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-96 h-[600px] bg-white shadow-lg rounded-t-lg border">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold">Live Chat with {selectedUser?.name}</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="p-4">
            <div className="h-[500px] overflow-y-auto space-y-4">
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
            <form onSubmit={handleSendChatMessage} className="mt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Chat message input"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  aria-label="Send chat message"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing === user.id ? (
                    <input
                      type="text"
                      value={editingUser?.name || ""}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      className="border rounded px-2 py-1"
                      aria-label="Edit user name"
                      placeholder="Enter name"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing === user.id ? (
                    <input
                      type="email"
                      value={editingUser?.email || ""}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, email: e.target.value } : null
                        )
                      }
                      className="border rounded px-2 py-1"
                      aria-label="Edit user email"
                      placeholder="Enter email"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing === user.id ? (
                    <select
                      value={editingUser?.role || ""}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? { ...prev, role: e.target.value as Role }
                            : null
                        )
                      }
                      className="border rounded px-2 py-1"
                      aria-label="Select user role"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="TECHNICIAN">Technician</option>
                      <option value="CUSTOMER">Customer</option>
                    </select>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!user.isApproved ? (
                    <button
                      onClick={() => approveUserMutation.mutate(user.id)}
                      className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full hover:bg-yellow-200"
                    >
                      Pending Approval
                    </button>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Approved
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {isEditing === user.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(null);
                          setEditingUser(null);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit user"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsMessaging(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Send message to user"
                      >
                        <EnvelopeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsChatOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Start live chat with user"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
