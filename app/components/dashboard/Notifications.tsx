"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning";
  message: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (!response.ok) throw new Error("Failed to mark notification as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <Bell className="h-5 w-5 text-gray-500" />
      </div>
      <div className="space-y-4">
        {!notifications?.length ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-4 p-3 rounded-lg ${
                notification.read ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              {getIcon(notification.type)}
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsReadMutation.mutate(notification.id)}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
