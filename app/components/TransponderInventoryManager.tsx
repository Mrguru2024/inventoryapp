import { useState } from 'react';
import { Package, AlertTriangle, Plus, Truck } from 'lucide-react';
import { TransponderInventoryItem } from '@/app/services/transponderInventoryService';

interface InventoryManagerProps {
  inventory: TransponderInventoryItem[];
  onUpdateStock: (id: string, quantity: number) => Promise<void>;
  onOrderStock: (item: TransponderInventoryItem) => Promise<void>;
}

export default function TransponderInventoryManager({
  inventory,
  onUpdateStock,
  onOrderStock
}: InventoryManagerProps) {
  const [selectedItem, setSelectedItem] = useState<TransponderInventoryItem | null>(null);

  const lowStockItems = inventory.filter(item => item.quantity <= item.minimumStock);

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="p-3 bg-white dark:bg-gray-800 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.transponderType}</p>
                    <p className="text-sm text-red-500">
                      Only {item.quantity} remaining
                    </p>
                  </div>
                  <button
                    onClick={() => onOrderStock(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Truck className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map(item => (
          <div
            key={item.id}
            className="p-4 border rounded-lg hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{item.transponderType}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Location: {item.location}
                </p>
              </div>
              <Package className="h-5 w-5 text-gray-400" />
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Quantity:</span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateStock(item.id, parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                  min="0"
                />
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {item.chipType.map(chip => (
                  <span
                    key={chip}
                    className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 rounded"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {item.quantity <= item.minimumStock && (
                <p className="mt-2 text-sm text-red-500">
                  Below minimum stock level ({item.minimumStock})
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 