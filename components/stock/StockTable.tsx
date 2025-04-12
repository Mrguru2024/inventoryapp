"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, DollarSign, Package } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  showAll?: boolean;
  userId?: string;
}

export function StockTable({ showAll = true, userId }: StockTableProps) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const lowStockItems = items.filter(
      (item) => item.quantity <= item.lowStockThreshold
    ).length;
    const averagePrice = totalItems > 0 ? totalValue / totalQuantity : 0;

    return {
      totalItems,
      totalQuantity,
      totalValue,
      lowStockItems,
      averagePrice,
    };
  }, [items]);

  useEffect(() => {
    fetchInventory();
  }, [showAll, userId]);

  const fetchInventory = async () => {
    try {
      const url = new URL("/api/inventory", window.location.origin);
      if (!showAll && userId) {
        url.searchParams.append("userId", userId);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: StockItem) => {
    // Implement edit functionality
    console.log("Edit item:", item);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast.success("Item deleted successfully");
      fetchInventory();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inventory Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {inventoryStats.totalItems}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Quantity
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {inventoryStats.totalQuantity}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${inventoryStats.totalValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Low Stock Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {inventoryStats.lowStockItems}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">SKU</TableHead>
              <TableHead className="text-foreground">Brand</TableHead>
              <TableHead className="text-foreground">Model</TableHead>
              <TableHead className="text-foreground">Quantity</TableHead>
              <TableHead className="text-foreground">Price</TableHead>
              <TableHead className="text-foreground">Value</TableHead>
              <TableHead className="text-foreground">Purchase Source</TableHead>
              <TableHead className="text-foreground">Last Updated</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-foreground">{item.sku}</TableCell>
                <TableCell className="text-foreground">{item.brand}</TableCell>
                <TableCell className="text-foreground">{item.model}</TableCell>
                <TableCell className="text-foreground">
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
                <TableCell className="text-foreground">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-foreground">
                  ${(item.quantity * item.price).toFixed(2)}
                </TableCell>
                <TableCell className="text-foreground">
                  {item.purchaseSource}
                </TableCell>
                <TableCell className="text-foreground">
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
