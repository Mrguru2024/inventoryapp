import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StockItem {
  id: string;
  sku: string;
  brand: string;
  model: string;
  quantity: number;
  lowStockThreshold: number;
  price: number;
  purchaseSource: string;
  lastUpdated: string;
  isDualSystem: boolean;
}

interface StockTableProps {
  items: StockItem[];
  onEdit: (item: StockItem) => void;
  onDelete: (id: string) => void;
}

export function StockTable({ items, onEdit, onDelete }: StockTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Purchase Source</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell>{item.model}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.quantity}
                  {item.quantity <= item.lowStockThreshold && (
                    <Badge variant="destructive">Low Stock</Badge>
                  )}
                  {item.isDualSystem && (
                    <Badge variant="secondary">Dual System</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>{item.purchaseSource}</TableCell>
              <TableCell>
                {new Date(item.lastUpdated).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
