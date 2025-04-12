"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

interface InventoryItem {
  id: number;
  sku: string;
  brand: string;
  model: string;
  stockCount: number;
  lowStockThreshold: number;
}

export default function InventoryList() {
  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Inventory Items</h2>
        <Link href="/admin/inventory">
          <Button>Add New Item</Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Stock Count</TableHead>
              <TableHead>Low Stock Threshold</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.stockCount}</TableCell>
                <TableCell>{item.lowStockThreshold}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/inventory?edit=${item.id}`}>
                    <Button className="h-9 px-3 hover:bg-gray-100">
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button className="h-9 px-3 text-red-600 hover:bg-red-50">
                    <TrashIcon className="h-4 w-4" />
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
