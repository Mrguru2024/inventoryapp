"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export function StockForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<StockItemFormData>({
    resolver: zodResolver(stockItemSchema),
  });

  const { data: session } = useSession();
  const router = useRouter();
  const isDualSystem = watch("isDualSystem");

  const onSubmit = async (data: StockItemFormData) => {
    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          technicianId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create inventory item");
      }

      toast.success("Inventory item created successfully");
      reset();
      router.refresh();
    } catch (error) {
      console.error("Error creating inventory item:", error);
      toast.error("Failed to create inventory item");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-foreground">
            SKU
          </Label>
          <Input id="sku" {...register("sku")} className="text-foreground" />
          {errors.sku && (
            <p className="text-destructive text-sm">{errors.sku.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-foreground">
            Brand
          </Label>
          <Input
            id="brand"
            {...register("brand")}
            className="text-foreground"
          />
          {errors.brand && (
            <p className="text-destructive text-sm">{errors.brand.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="model" className="text-foreground">
            Model
          </Label>
          <Input
            id="model"
            {...register("model")}
            className="text-foreground"
          />
          {errors.model && (
            <p className="text-destructive text-sm">{errors.model.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-foreground">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            className="text-foreground"
          />
          {errors.quantity && (
            <p className="text-destructive text-sm">
              {errors.quantity.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold" className="text-foreground">
            Low Stock Threshold
          </Label>
          <Input
            id="lowStockThreshold"
            type="number"
            {...register("lowStockThreshold", { valueAsNumber: true })}
            className="text-foreground"
          />
          {errors.lowStockThreshold && (
            <p className="text-destructive text-sm">
              {errors.lowStockThreshold.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-foreground">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="text-foreground"
          />
          {errors.price && (
            <p className="text-destructive text-sm">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseSource" className="text-foreground">
            Purchase Source
          </Label>
          <Input
            id="purchaseSource"
            {...register("purchaseSource")}
            className="text-foreground"
          />
          {errors.purchaseSource && (
            <p className="text-destructive text-sm">
              {errors.purchaseSource.message}
            </p>
          )}
        </div>
      </div>

      {/* Dual System Toggle */}
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="isDualSystem"
          checked={isDualSystem}
          onCheckedChange={(checked) =>
            register("isDualSystem").onChange({ target: { value: checked } })
          }
        />
        <Label
          htmlFor="isDualSystem"
          className="text-foreground cursor-pointer"
        >
          Dual System (Chip + Remote)
        </Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Inventory Item"}
      </Button>
    </form>
  );
}
