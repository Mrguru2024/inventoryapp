'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface Request {
  id: number;
  technician: {
    name: string;
    email: string;
  };
  item: {
    brand: string;
    model: string;
    stockCount: number;
  };
  quantityRequested: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function AdminRequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/requests');
      setRequests(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    try {
      await axios.patch(`/api/requests/${requestId}`, { status: newStatus });
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update request status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Requests</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-cell">Technician</th>
              <th className="th-cell">Item</th>
              <th className="th-cell">Quantity</th>
              <th className="th-cell">Current Stock</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Requested At</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="td-cell">
                  <div>
                    <div className="font-medium">{request.technician.name}</div>
                    <div className="text-sm text-gray-500">{request.technician.email}</div>
                  </div>
                </td>
                <td className="td-cell">{request.item.brand} {request.item.model}</td>
                <td className="td-cell">{request.quantityRequested}</td>
                <td className="td-cell">{request.item.stockCount}</td>
                <td className="td-cell">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="td-cell">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="td-cell">
                  {request.status === 'PENDING' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                        className="btn-success"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                        className="btn-danger"
                      >
                        Reject
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