"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface StockFormData {
  sku: string;
  brand: string;
  model: string;
  stockCount: number;
  lowStockThreshold: number;
  price: number;
  purchaseSource: string;
  isDualSystem: boolean;
}

export function StockForm() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<StockFormData>({
    sku: "",
    brand: "",
    model: "",
    stockCount: 0,
    lowStockThreshold: 5,
    price: 0,
    purchaseSource: "",
    isDualSystem: false,
  });

  const mutation = useMutation({
    mutationFn: async (data: StockFormData) => {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create inventory item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      showToast("Inventory item created successfully", "success");
      setFormData({
        sku: "",
        brand: "",
        model: "",
        stockCount: 0,
        lowStockThreshold: 5,
        price: 0,
        purchaseSource: "",
        isDualSystem: false,
      });
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof StockFormData
  ) => {
    const value =
      field === "stockCount" ||
      field === "lowStockThreshold" ||
      field === "price"
        ? Number(e.target.value)
        : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <h2 className="text-lg font-semibold">Add New Inventory Item</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange(e, "sku")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => handleChange(e, "brand")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleChange(e, "model")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockCount">Stock Count</Label>
          <Input
            id="stockCount"
            type="number"
            value={formData.stockCount}
            onChange={(e) => handleChange(e, "stockCount")}
            required
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => handleChange(e, "lowStockThreshold")}
            required
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange(e, "price")}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseSource">Purchase Source</Label>
          <Input
            id="purchaseSource"
            value={formData.purchaseSource}
            onChange={(e) => handleChange(e, "purchaseSource")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isDualSystem">Dual System</Label>
          <Switch
            id="isDualSystem"
            checked={formData.isDualSystem}
            onCheckedChange={(checked: boolean) =>
              setFormData((prev) => ({ ...prev, isDualSystem: checked }))
            }
          />
        </div>
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Adding..." : "Add Inventory Item"}
      </Button>
    </form>
  );
}
