'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface CustomerStats {
  totalPurchases: number;
  pendingDeliveries: number;
  totalSpent: number;
}

interface RecentPurchase {
  id: number;
  item: {
    brand: string;
    model: string;
  };
  quantity: number;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchStats(),
      fetchRecentPurchases()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/customer/dashboard-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentPurchases = async () => {
    try {
      const response = await fetch('/api/customer/recent-purchases');
      const data = await response.json();
      setRecentPurchases(data);
    } catch (error) {
      console.error('Failed to fetch recent purchases:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Customer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Purchases</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalPurchases}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Deliveries</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pendingDeliveries}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Spent</h3>
          <p className="text-3xl font-bold text-green-600">
            ${stats?.totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              href="/shop"
              className="block w-full btn-primary text-center"
            >
              Browse Keys
            </Link>
            <Link 
              href="/orders"
              className="block w-full btn-secondary text-center"
            >
              View Orders
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
          <div className="space-y-4">
            {recentPurchases.map((purchase) => (
              <div 
                key={purchase.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{purchase.item.brand} {purchase.item.model}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {purchase.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${purchase.totalPrice.toFixed(2)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    purchase.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    purchase.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {purchase.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 