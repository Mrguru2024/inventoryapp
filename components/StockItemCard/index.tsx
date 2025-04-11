import React from "react";
import { Button } from "@/components/ui/button";

interface StockItemCardProps {
  item: {
    sku: string;
    name: string;
    quantity: number;
    lowStockThreshold: number;
    price: number;
    purchaseSource: string;
    lastRestocked: string;
  };
  onEdit?: (sku: string) => void;
  darkMode?: boolean;
}

export const StockItemCard: React.FC<StockItemCardProps> = ({
  item,
  onEdit,
  darkMode = false,
}) => {
  const isLowStock = item.quantity <= item.lowStockThreshold;
  const isOutOfStock = item.quantity === 0;

  return (
    <div
      data-testid="stock-item-card"
      className={`p-4 rounded-lg shadow-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
        </div>
        {onEdit && (
          <Button
            onClick={() => onEdit(item.sku)}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            Edit
          </Button>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm">
          Quantity: {item.quantity}
          {isLowStock && !isOutOfStock && (
            <span className="ml-2 text-yellow-600">Low Stock</span>
          )}
          {isOutOfStock && (
            <span className="ml-2 text-red-500">Out of Stock</span>
          )}
        </p>
        <p className="text-sm">Price: ${item.price.toFixed(2)}</p>
        <p className="text-sm">Source: {item.purchaseSource}</p>
        <p className="text-sm text-gray-500">
          Last Restocked: {new Date(item.lastRestocked).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default StockItemCard;
