'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Inventory } from '@prisma/client';

export default function InventoryDashboard() {
  const { data: session, status } = useSession();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [formData, setFormData] = useState({
    sku: '',
    brand: '',
    model: '',
    stockCount: 0,
    lowStockThreshold: 5,
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory');
      setInventory(res.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/inventory', formData);
      setFormData({
        sku: '',
        brand: '',
        model: '',
        stockCount: 0,
        lowStockThreshold: 5,
      });
      fetchInventory();
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in to access the inventory dashboard.</div>;
  }

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Dashboard</h1>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Stock Count"
              value={formData.stockCount}
              onChange={(e) => setFormData({ ...formData, stockCount: parseInt(e.target.value) })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Low Stock Threshold"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary">
            Add Key
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-cell">SKU</th>
              <th className="th-cell">Brand</th>
              <th className="th-cell">Model</th>
              <th className="th-cell">Stock</th>
              <th className="th-cell">Low Stock Threshold</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="td-cell">{item.sku}</td>
                <td className="td-cell">{item.brand}</td>
                <td className="td-cell">{item.model}</td>
                <td className="td-cell">{item.stockCount}</td>
                <td className="td-cell">{item.lowStockThreshold}</td>
                <td className="td-cell">
                  <button className="btn-secondary mr-2">Edit</button>
                  <button className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 