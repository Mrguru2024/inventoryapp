'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function RequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Requests</h1>
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-cell">Item</th>
              <th className="th-cell">Quantity</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Requested At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request: any) => (
              <tr key={request.id}>
                <td className="td-cell">{request.item.brand} {request.item.model}</td>
                <td className="td-cell">{request.quantityRequested}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 