"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Plus, DollarSign, Package, Trash2, Edit2 } from "lucide-react";
import { StockItem } from "@/types/stock";
import InventoryItemForm from "@/components/inventory/InventoryItemForm";

interface InventoryItem extends StockItem {
  id: string;
  quantity: number;
  costPerUnit: number;
  totalValue: number;
}

export default function TechnicianInventory() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [totalValue, setTotalValue] = useState(0);

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  useEffect(() => {
    // Fetch technician's inventory items
    fetchInventoryItems();
  }, []);

  useEffect(() => {
    // Calculate total value whenever items change
    const newTotalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    setTotalValue(newTotalValue);
  }, [items]);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch("/api/technician/inventory");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleAddItem = async (
    item: Omit<InventoryItem, "id" | "totalValue">
  ) => {
    try {
      const response = await fetch("/api/technician/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        fetchInventoryItems();
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEditItem = async (item: InventoryItem) => {
    try {
      const response = await fetch(`/api/technician/inventory/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: item.quantity,
          costPerUnit: item.costPerUnit,
        }),
      });

      if (response.ok) {
        fetchInventoryItems();
        setIsEditModalOpen(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/technician/inventory/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchInventoryItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Personal Inventory
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Items
                </h3>
                <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {items.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Value
                </h3>
                <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cost per Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.brand} {item.model}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        SKU: {item.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        ${item.costPerUnit.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        ${item.totalValue.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <InventoryItemForm
              onSubmit={handleAddItem}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
            <InventoryItemForm
              initialData={selectedItem}
              onSubmit={handleEditItem}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedItem(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
