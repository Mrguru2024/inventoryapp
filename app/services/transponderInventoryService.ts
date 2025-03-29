import axios from "axios";

interface TransponderKey {
  id: number;
  make: string;
  model: string;
  yearStart?: number;
  yearEnd?: number;
  transponderType: string;
  chipType: string;
  compatibleParts?: string;
  frequency?: string;
  notes?: string;
  dualSystem: boolean;
}

export interface TransponderInventoryItem {
  id: number;
  transponderKeyId: number;
  quantity: number;
  minimumStock: number;
  location: string;
  supplier: string;
  lastOrdered?: Date;
  notes?: string;
  transponderKey: TransponderKey;
}

export const transponderInventoryService = {
  async getInventoryLevels() {
    try {
      const response = await axios.get("/api/inventory");
      return response.data;
    } catch (error) {
      console.error("Error fetching inventory levels:", error);
      throw new Error("Failed to fetch inventory levels");
    }
  },

  async updateStock(id: number, quantity: number) {
    try {
      const response = await axios.put("/api/inventory", { id, quantity });
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw new Error("Failed to update stock");
    }
  },

  async orderStock(item: TransponderInventoryItem) {
    try {
      const response = await axios.post("/api/inventory", item);
      return response.data;
    } catch (error) {
      console.error("Error ordering stock:", error);
      throw new Error("Failed to order stock");
    }
  },

  async getLowStockItems() {
    try {
      const inventory = await this.getInventoryLevels();
      return inventory.filter(
        (item: TransponderInventoryItem) => item.quantity <= item.minimumStock
      );
    } catch (error) {
      console.error("Error getting low stock items:", error);
      throw new Error("Failed to get low stock items");
    }
  },

  async getCompatibleTransponders(chipTypes: string[]) {
    try {
      const inventory = await this.getInventoryLevels();
      return inventory.filter((item: TransponderInventoryItem) =>
        chipTypes.includes(item.transponderKey.chipType)
      );
    } catch (error) {
      console.error("Error getting compatible transponders:", error);
      throw new Error("Failed to get compatible transponders");
    }
  },
};
