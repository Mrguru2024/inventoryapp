'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface DashboardStats {
  totalInventory: number;
  lowStockItems: number;
  pendingRequests: number;
  totalTechnicians: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Inventory</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalInventory}</p>
          <Link href="/admin/inventory" className="text-sm text-blue-500 hover:underline">
            View all items →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600">{stats?.lowStockItems}</p>
          <Link href="/admin/inventory?filter=low-stock" className="text-sm text-blue-500 hover:underline">
            View low stock →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pendingRequests}</p>
          <Link href="/admin/requests?status=pending" className="text-sm text-blue-500 hover:underline">
            View requests →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Technicians</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalTechnicians}</p>
          <Link href="/admin/users?role=technician" className="text-sm text-blue-500 hover:underline">
            Manage technicians →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              href="/admin/inventory/add"
              className="block w-full btn-primary text-center"
            >
              Add New Inventory Item
            </Link>
            <Link 
              href="/admin/users/add"
              className="block w-full btn-secondary text-center"
            >
              Add New User
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add recent activity list here */}
          </div>
        </div>
      </div>
    </div>
  );
} 