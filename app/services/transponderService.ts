import axios from "axios";
import { prisma } from "@/lib/prisma";

export interface TransponderKeyData {
  id: string;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
  transponderType: string;
  chipType: string[];
  compatibleParts: string[];
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
}

export interface TransponderData {
  id: number;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
  transponderType: string;
  chipType: string[];
  compatibleParts: string[];
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
}

export interface TransponderSearchParams {
  search?: string;
  make?: string;
  model?: string;
  year?: string;
  type?: string;
}

class TransponderService {
  async searchTransponders(params?: TransponderSearchParams) {
    const whereClause: any = {};

    if (params?.search) {
      whereClause.OR = [
        { make: { contains: params.search.toUpperCase() } },
        { model: { contains: params.search.toUpperCase() } },
        { transponderType: { contains: params.search.toUpperCase() } },
        { chipType: { contains: params.search.toUpperCase() } },
        { compatibleParts: { contains: params.search.toUpperCase() } },
      ];
    }

    if (params?.make) {
      whereClause.make = { equals: params.make.toUpperCase() };
    }

    if (params?.model) {
      whereClause.model = { equals: params.model.toUpperCase() };
    }

    if (params?.year) {
      const yearNum = parseInt(params.year);
      whereClause.AND = [
        { yearStart: { lte: yearNum } },
        {
          OR: [{ yearEnd: { gte: yearNum } }, { yearEnd: null }],
        },
      ];
    }

    if (params?.type) {
      whereClause.transponderType = { equals: params.type.toUpperCase() };
    }

    const transponders = await prisma.transponderKey.findMany({
      where: whereClause,
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
    });

    return transponders.map((t) => ({
      ...t,
      chipType: t.chipType ? JSON.parse(t.chipType) : [],
      compatibleParts: t.compatibleParts ? JSON.parse(t.compatibleParts) : [],
    }));
  }

  async getAllTransponders(): Promise<TransponderData[]> {
    const transponders = await prisma.transponderKey.findMany({
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
    });

    return transponders.map((t) => ({
      ...t,
      chipType: t.chipType ? JSON.parse(t.chipType) : [],
      compatibleParts: t.compatibleParts ? JSON.parse(t.compatibleParts) : [],
    }));
  }

  async getTransponderByVehicle(
    make: string,
    model: string,
    year: number
  ): Promise<TransponderData | null> {
    const transponder = await prisma.transponderKey.findFirst({
      where: {
        make: make.toUpperCase(),
        model: model.toUpperCase(),
        yearStart: { lte: year },
        OR: [{ yearEnd: { gte: year } }, { yearEnd: null }],
      },
    });

    if (!transponder) return null;

    return {
      ...transponder,
      chipType: transponder.chipType ? JSON.parse(transponder.chipType) : [],
      compatibleParts: transponder.compatibleParts
        ? JSON.parse(transponder.compatibleParts)
        : [],
    };
  }

  async addTransponderData(data: Omit<TransponderData, "id">) {
    const transponder = await prisma.transponderKey.create({
      data: {
        ...data,
        chipType: JSON.stringify(data.chipType),
        compatibleParts: JSON.stringify(data.compatibleParts),
      },
    });

    return {
      ...transponder,
      chipType: transponder.chipType ? JSON.parse(transponder.chipType) : [],
      compatibleParts: transponder.compatibleParts
        ? JSON.parse(transponder.compatibleParts)
        : [],
    };
  }

  async deleteTransponder(id: number) {
    await prisma.transponderKey.delete({
      where: { id },
    });
  }

  async getCompatibleChips(transponderId: string) {
    const transponder = await prisma.transponderKey.findUnique({
      where: { id: parseInt(transponderId) },
    });

    if (!transponder) return null;

    return transponder.chipType ? JSON.parse(transponder.chipType) : [];
  }
}

export const transponderService = new TransponderService();

export async function getTransponders() {
  try {
    const response = await axios.get("/api/transponders");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw new Error("Failed to fetch transponder data");
  }
}

export async function getTransponderByVehicle(
  make: string,
  model: string,
  year: number
) {
  try {
    const response = await axios.get(
      `/api/transponders/vehicle?make=${make}&model=${model}&year=${year}`
    );
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw new Error("Failed to fetch vehicle transponder data");
  }
}

export const getTransponderData = async (): Promise<TransponderKeyData[]> => {
  try {
    const response = await axios.get("/api/transponders");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw new Error("Failed to fetch transponder data");
  }
};

export async function searchTransponders(
  searchTerm: string = ""
): Promise<TransponderKeyData[]> {
  try {
    const response = await axios.get(
      `/api/transponders/search?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw new Error("Failed to search transponders");
  }
}

// Helper function to safely parse JSON
function tryParseJSON<T>(
  jsonString: string | null | undefined,
  defaultValue: T
): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}
