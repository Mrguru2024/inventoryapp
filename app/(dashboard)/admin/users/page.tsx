"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { UserRole } from "@/app/lib/auth/types";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  image?: string;
}

const styles = {
  container: "min-h-screen bg-white p-6 dark:bg-slate-800",
  header: "text-2xl font-bold mb-6 text-slate-900 dark:text-white",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  card: "bg-white rounded-lg p-6 border border-slate-200 dark:bg-slate-700 dark:border-slate-600 shadow-sm",
  cardTitle: "text-lg font-semibold mb-4 text-slate-800 dark:text-white",
  statValue: "text-3xl font-bold text-slate-900 dark:text-white",
  statLabel: "text-sm text-slate-600 dark:text-slate-300",
  list: "space-y-4",
  listItem:
    "flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600",
  listItemText: "text-slate-700 dark:text-slate-300",
  listItemValue: "text-slate-900 dark:text-white font-medium",
  chartContainer: "h-64 mt-4",
  tableContainer:
    "overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600",
  table: "min-w-full divide-y divide-slate-200 dark:divide-slate-600",
  tableHeader: "bg-slate-50 dark:bg-slate-700",
  tableHeaderCell:
    "px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider",
  tableBody:
    "bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-600",
  tableRow:
    "hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150",
  tableCell:
    "px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300",
  loadingContainer: "flex justify-center items-center h-64",
  errorMessage: "text-red-600 dark:text-red-400 text-center py-4",
  noData: "text-slate-500 dark:text-slate-400 text-center py-4",
  button:
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  primaryButton:
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:text-slate-900 dark:hover:bg-blue-300 focus:ring-blue-500",
  secondaryButton:
    "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 focus:ring-slate-500",
  dangerButton:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-400 dark:text-slate-900 dark:hover:bg-red-300 focus:ring-red-500",
  successButton:
    "bg-green-600 text-white hover:bg-green-700 dark:bg-green-400 dark:text-slate-900 dark:hover:bg-green-300 focus:ring-green-500",
  disabledButton:
    "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500",
  input:
    "w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
  select:
    "w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
  label: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1",
  checkbox:
    "h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded dark:border-slate-600 dark:bg-slate-700",
  radio:
    "h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 dark:bg-slate-700",
  tooltip:
    "absolute z-10 px-3 py-2 text-sm text-white bg-slate-900 rounded-md shadow-lg dark:bg-slate-600",
  badge:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  successBadge:
    "bg-green-100 text-green-800 dark:bg-green-400 dark:text-slate-900",
  warningBadge:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-400 dark:text-slate-900",
  errorBadge: "bg-red-100 text-red-800 dark:bg-red-400 dark:text-slate-900",
  infoBadge: "bg-blue-100 text-blue-800 dark:bg-blue-400 dark:text-slate-900",
  alert: "p-4 mb-4 rounded-md",
  successAlert:
    "bg-green-50 text-green-800 dark:bg-green-400 dark:text-slate-900",
  warningAlert:
    "bg-yellow-50 text-yellow-800 dark:bg-yellow-400 dark:text-slate-900",
  errorAlert: "bg-red-50 text-red-800 dark:bg-red-400 dark:text-slate-900",
  infoAlert: "bg-blue-50 text-blue-800 dark:bg-blue-400 dark:text-slate-900",
};

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: UserRole;
    }) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user role");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user role");
    },
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>User Management</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-600">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-600">
              {users?.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                    {user.isApproved ? "Approved" : "Pending"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      className="text-slate-900 dark:text-slate-300"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
