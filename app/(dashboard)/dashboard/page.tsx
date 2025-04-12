"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/app/lib/auth/types";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import QuickStats from "@/app/components/dashboard/QuickStats";
import RecentActivity from "@/app/components/dashboard/RecentActivity";
import Notifications from "@/app/components/dashboard/Notifications";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role as UserRole;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="space-y-8">
        {/* Quick Stats */}
        <QuickStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <RecentActivity />

          {/* Notifications */}
          <Notifications />
        </div>

        {/* Role-specific content */}
        {userRole === UserRole.ADMIN && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Admin Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/users"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-gray-500">Manage users and permissions</p>
              </Link>
              <Link
                href="/admin/inventory"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Inventory Management
                </h3>
                <p className="text-gray-500">View and manage inventory</p>
              </Link>
              <Link
                href="/admin/settings"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">System Settings</h3>
                <p className="text-gray-500">Configure system settings</p>
              </Link>
            </div>
          </div>
        )}

        {userRole === UserRole.TECHNICIAN && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Technician Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/inventory?view=my"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">My Inventory</h3>
                <p className="text-gray-500">View and manage your inventory</p>
              </Link>
              <Link
                href="/technician/orders"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">Orders</h3>
                <p className="text-gray-500">View and manage orders</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
