'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface TechnicianStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

interface RecentRequest {
  id: number;
  item: {
    brand: string;
    model: string;
  };
  quantityRequested: number;
  status: string;
  createdAt: string;
}

export default function TechnicianDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<TechnicianStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchStats(),
      fetchRecentRequests()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/technician/dashboard-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentRequests = async () => {
    try {
      const response = await fetch('/api/technician/recent-requests');
      const data = await response.json();
      setRecentRequests(data);
    } catch (error) {
      console.error('Failed to fetch recent requests:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Technician Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Requests</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalRequests}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pendingRequests}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.approvedRequests}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{stats?.rejectedRequests}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              href="/requests/new"
              className="block w-full btn-primary text-center"
            >
              New Key Request
            </Link>
            <Link 
              href="/requests"
              className="block w-full btn-secondary text-center"
            >
              View All Requests
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div 
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{request.item.brand} {request.item.model}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {request.quantityRequested}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(request.createdAt).toLocaleDateString()}
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