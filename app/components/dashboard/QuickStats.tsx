"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Package, Users, AlertCircle, Clock } from "lucide-react";

interface Stats {
  totalInventory: number;
  pendingApprovals: number;
  lowStock: number;
  recentOrders: number;
}

export default function QuickStats() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Package className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Inventory</p>
            <p className="text-2xl font-bold">{stats?.totalInventory || 0}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Clock className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Pending Approvals</p>
            <p className="text-2xl font-bold">{stats?.pendingApprovals || 0}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold">{stats?.lowStock || 0}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Users className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Recent Orders</p>
            <p className="text-2xl font-bold">{stats?.recentOrders || 0}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
