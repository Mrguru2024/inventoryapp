import { prisma } from '../../lib/prisma';

export interface TransponderInventoryItem {
  id: string;
  transponderType: string;
  chipType: string[];
  quantity: number;
  minimumStock: number;
  location: string;
  supplier: string;
  lastOrdered?: Date;
  notes?: string;
}

export const transponderInventoryService = {
  async getInventoryLevels() {
    return await prisma.transponderInventory.findMany({
      orderBy: { transponderType: 'asc' }
    });
  },

  async updateStock(id: string, quantity: number) {
    return await prisma.transponderInventory.update({
      where: { id },
      data: { quantity }
    });
  },

  async getLowStockItems() {
    return await prisma.transponderInventory.findMany({
      where: {
        quantity: {
          lte: prisma.transponderInventory.fields.minimumStock
        }
      }
    });
  },

  async getCompatibleTransponders(chipTypes: string[]) {
    return await prisma.transponderInventory.findMany({
      where: {
        chipType: {
          hasSome: chipTypes
        }
      }
    });
  }
}; 