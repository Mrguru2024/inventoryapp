"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Key } from 'lucide-react';
import { Package } from 'lucide-react';
import { Wrench as Tool } from 'lucide-react';
import AddItemModal from '@/app/components/AddItemModal';
import VehicleApiTest from '@/app/components/VehicleApiTest';

export default function TechnicianDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Example inventory stats - replace with actual data from your backend
  const stats = {
    totalKeys: 150,
    availableKeys: 130,
    totalTools: 200,
    availableTools: 180,
    recentTransactions: 25
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Keys Stats */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Keys</h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalKeys}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.availableKeys}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Stats */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Tool className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tools</h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalTools}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.availableTools}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {stats.recentTransactions} transactions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Add your transaction rows here */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">Example Item</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">Key</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Checked In
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">2024-03-21</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Add this temporarily for testing */}
      <VehicleApiTest />
    </div>
  );
} 