"use client";

import { useState, useEffect } from "react";
import { StockItem } from "@/types/stock";

interface InventoryItemFormProps {
  initialData?: StockItem & {
    quantity: number;
    costPerUnit: number;
  };
  onSubmit: (
    data: Omit<StockItem, "id"> & {
      quantity: number;
      costPerUnit: number;
    }
  ) => void;
  onCancel: () => void;
}

export default function InventoryItemForm({
  initialData,
  onSubmit,
  onCancel,
}: InventoryItemFormProps) {
  const [formData, setFormData] = useState({
    sku: "",
    brand: "",
    model: "",
    quantity: 0,
    costPerUnit: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku,
        brand: initialData.brand,
        model: initialData.model,
        quantity: initialData.quantity,
        costPerUnit: initialData.costPerUnit,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "costPerUnit" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="sku"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          SKU
        </label>
        <input
          type="text"
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="brand"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Brand
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="model"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Model
        </label>
        <input
          type="text"
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="costPerUnit"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Cost per Unit
        </label>
        <input
          type="number"
          id="costPerUnit"
          name="costPerUnit"
          value={formData.costPerUnit}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {initialData ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </form>
  );
}
