"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Inventory } from "@prisma/client";

interface InventoryFormProps {
  initialData?: Partial<Inventory>;
  onSubmit: (data: any) => Promise<void>;
  isAdmin?: boolean;
}

export function InventoryForm({
  initialData,
  onSubmit,
  isAdmin = false,
}: InventoryFormProps) {
  const [formData, setFormData] = useState({
    sku: initialData?.sku || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    stockCount: initialData?.stockCount || 0,
    lowStockThreshold: initialData?.lowStockThreshold || 5,
    price: initialData?.price || 0,
    fccId: initialData?.fccId || "",
    frequency: initialData?.frequency || "",
    purchaseSource: initialData?.purchaseSource || "",
    isSmartKey: initialData?.isSmartKey || false,
    isTransponderKey: initialData?.isTransponderKey || false,
    carMake: initialData?.carMake || "",
    carModel: initialData?.carModel || "",
    carYear: initialData?.carYear || new Date().getFullYear(),
    notes: initialData?.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockCount">Stock Count</Label>
          <Input
            id="stockCount"
            type="number"
            value={formData.stockCount}
            onChange={(e) =>
              setFormData({ ...formData, stockCount: parseInt(e.target.value) })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) =>
              setFormData({
                ...formData,
                lowStockThreshold: parseInt(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fccId">FCC ID</Label>
          <Input
            id="fccId"
            value={formData.fccId}
            onChange={(e) =>
              setFormData({ ...formData, fccId: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Input
            id="frequency"
            value={formData.frequency}
            onChange={(e) =>
              setFormData({ ...formData, frequency: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseSource">Purchase Source</Label>
          <Input
            id="purchaseSource"
            value={formData.purchaseSource}
            onChange={(e) =>
              setFormData({ ...formData, purchaseSource: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carMake">Car Make</Label>
          <Input
            id="carMake"
            value={formData.carMake}
            onChange={(e) =>
              setFormData({ ...formData, carMake: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carModel">Car Model</Label>
          <Input
            id="carModel"
            value={formData.carModel}
            onChange={(e) =>
              setFormData({ ...formData, carModel: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carYear">Car Year</Label>
          <Input
            id="carYear"
            type="number"
            value={formData.carYear}
            onChange={(e) =>
              setFormData({ ...formData, carYear: parseInt(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isSmartKey"
            checked={formData.isSmartKey}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isSmartKey: checked as boolean })
            }
          />
          <Label htmlFor="isSmartKey">Smart Key</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isTransponderKey"
            checked={formData.isTransponderKey}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isTransponderKey: checked as boolean })
            }
          />
          <Label htmlFor="isTransponderKey">Transponder Key</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Inventory" : "Add Inventory"}
      </Button>
    </form>
  );
}
