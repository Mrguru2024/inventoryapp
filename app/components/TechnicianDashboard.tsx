'use client';

import React, { useState } from 'react';
import InventoryList from './InventoryList';
import InventoryForm from './InventoryForm';
import { InventoryItem, InventoryFormData } from '../types/inventory';

const TechnicianDashboard = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddItem = (formData: InventoryFormData) => {
    const newItem: InventoryItem = {
      id: items.length + 1,
      ...formData
    };
    setItems([...items, newItem]);
    setShowForm(false);
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Calculate low stock items
  const lowStockItems = items.filter(item => 
    item.minimumStock && item.quantity <= item.minimumStock
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Inventory Management</h1>
              <p className="mt-1 text-sm text-gray-600 max-w-2xl">
                Manage and track your inventory items
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showForm ? 'Close Form' : 'Add New Item'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Items */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 flex-shrink-0">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Total Items</h2>
              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-indigo-600">{items.length}</p>
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 flex-shrink-0">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Low Stock</h2>
              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-red-600">
                {items.filter(item => item.quantity <= (item.minimumStock || 0)).length}
              </p>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 flex-shrink-0">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Total Value</h2>
              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-green-600">
                ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <InventoryForm 
                onSubmit={handleAddItem}
                editingItem={editingItem}
              />
            </div>
          </div>
        </div>
      )}

      {/* Inventory List Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-medium text-gray-900">Inventory Items</h2>
            <div className="flex flex-wrap gap-2">
              {/* Additional controls can be added here */}
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <InventoryList 
                items={items}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard; 