import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const stockItemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  lowStockThreshold: z
    .number()
    .min(0, "Low stock threshold must be 0 or greater"),
  price: z.number().min(0, "Price must be 0 or greater"),
  purchaseSource: z.string().min(1, "Purchase source is required"),
  isDualSystem: z.boolean().default(false),
});

type StockItemFormData = z.infer<typeof stockItemSchema>;

interface StockFormProps {
  onSubmit: (data: StockItemFormData) => void;
  initialData?: StockItemFormData;
}

export function StockForm({ onSubmit, initialData }: StockFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<StockItemFormData>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: initialData,
  });

  const isDualSystem = watch("isDualSystem");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register("sku")} />
          {errors.sku && (
            <p className="text-red-500 text-sm">{errors.sku.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register("brand")} />
          {errors.brand && (
            <p className="text-red-500 text-sm">{errors.brand.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...register("model")} />
          {errors.model && (
            <p className="text-red-500 text-sm">{errors.model.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            {...register("quantity", { valueAsNumber: true })}
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            {...register("lowStockThreshold", { valueAsNumber: true })}
          />
          {errors.lowStockThreshold && (
            <p className="text-red-500 text-sm">
              {errors.lowStockThreshold.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseSource">Purchase Source</Label>
          <Input id="purchaseSource" {...register("purchaseSource")} />
          {errors.purchaseSource && (
            <p className="text-red-500 text-sm">
              {errors.purchaseSource.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isDualSystem">Dual System</Label>
          <Switch
            id="isDualSystem"
            checked={isDualSystem}
            onCheckedChange={(checked) => {
              register("isDualSystem").onChange({ target: { value: checked } });
            }}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Item" : "Add Item"}
      </Button>
    </form>
  );
}
