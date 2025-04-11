"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";

interface InventoryItem {
  id: string;
  sku: string;
  brand: string;
  model: string;
  stockCount: number;
  lowStockThreshold: number;
  price: number;
  purchaseSource: string;
  isDualSystem: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export function StockTable() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: inventory,
    isLoading,
    error,
  } = useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      return response.json();
    },
  });

  const filteredInventory = inventory?.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading inventory: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-64"
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.stockCount}
                    {item.stockCount <= item.lowStockThreshold && (
                      <Badge variant="destructive">Low Stock</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.purchaseSource}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "ACTIVE" ? "default" : "secondary"}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement edit functionality
                      showToast("Edit functionality coming soon", "info");
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
