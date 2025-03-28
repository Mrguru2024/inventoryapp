"use client";

import { useState, useEffect } from "react";
import TransponderIdentifier from "./TransponderIdentifier";
import TransponderInventoryManager from "./TransponderInventoryManager";
import ProgrammingGuideGenerator from "./ProgrammingGuideGenerator";
import {
  transponderService,
  TransponderKeyData,
} from "@/app/services/transponderService";
import {
  transponderInventoryService,
  TransponderInventoryItem,
} from "@/app/services/transponderInventoryService";
import { useToast } from "@/app/components/ui/use-toast";
import { getTransponderData } from "@/app/services/transponderService";

export default function TransponderManagement() {
  const [transponderData, setTransponderData] = useState<TransponderKeyData[]>(
    []
  );
  const [inventoryLevels, setInventoryLevels] = useState<
    TransponderInventoryItem[]
  >([]);
  const [selectedTransponder, setSelectedTransponder] =
    useState<TransponderKeyData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transponders, inventory] = await Promise.all([
        getTransponderData(),
        transponderInventoryService.getInventoryLevels(),
      ]);
      setTransponderData(transponders);
      setInventoryLevels(inventory);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transponder data",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStock = async (id: string, quantity: number) => {
    try {
      await transponderInventoryService.updateStock(id, quantity);
      await loadData(); // Refresh data
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const handleOrderStock = async (item: TransponderInventoryItem) => {
    // Implement order logic
    toast({
      title: "Success",
      description: `Order placed for ${item.transponderType}`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Transponder Lookup</h2>
          <TransponderIdentifier
            data={transponderData}
            onSelect={setSelectedTransponder}
          />
        </div>

        {selectedTransponder && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Programming Guide</h2>
            <ProgrammingGuideGenerator
              transponder={selectedTransponder}
              inventory={inventoryLevels}
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
        <TransponderInventoryManager
          inventory={inventoryLevels}
          onUpdateStock={handleUpdateStock}
          onOrderStock={handleOrderStock}
        />
      </div>
    </div>
  );
}
