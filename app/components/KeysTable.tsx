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
} from "@/app/components/ui/table";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: string;
  sku: string;
  brand: string;
  model: string;
  stockCount: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export default function KeysTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: inventory = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["inventory", searchTerm],
    queryFn: async () => {
      const response = await fetch(`/api/keys?search=${searchTerm}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search inventory..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg">
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
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.stockCount}</TableCell>
                <TableCell>{item.lowStockThreshold}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/inventory/${item.id}/edit`}>
                    <Button className="h-8 w-8 p-0">
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button className="h-8 w-8 p-0 text-red-600">
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
