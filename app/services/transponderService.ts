import { prisma } from '../../lib/prisma';

export interface TransponderKeyData {
  make: string;
  model: string;
  yearStart: number;
  yearEnd?: number;
  transponderType: string;
  chipType: string[];
  compatibleParts?: string[];
  notes?: string;
  dualSystem?: boolean;
  alternateChipType?: string[];
}

export const transponderService = {
  async getTransponderByVehicle(make: string, model: string, year: number) {
    const transponder = await prisma.transponderKey.findFirst({
      where: {
        make: make.toUpperCase(),
        model: model.toUpperCase(),
        yearStart: { lte: year },
        OR: [
          { yearEnd: null },
          { yearEnd: { gte: year } }
        ]
      }
    });
    return transponder;
  },

  async addTransponderData(data: TransponderKeyData) {
    return await prisma.transponderKey.create({
      data: {
        ...data,
        make: data.make.toUpperCase(),
        model: data.model.toUpperCase()
      }
    });
  },

  async getCompatibleChips(make: string, model: string, year: number) {
    const transponder = await this.getTransponderByVehicle(make, model, year);
    if (!transponder) return [];

    const chips = [...transponder.chipType];
    if (transponder.dualSystem && transponder.alternateChipType) {
      chips.push(...transponder.alternateChipType);
    }
    return chips;
  }
}; 