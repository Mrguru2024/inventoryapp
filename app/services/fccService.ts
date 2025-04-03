import axios from "axios";

export interface FccData {
  fccId: string;
  frequency: string;
  make: string;
  model: string;
  year: number;
  chipType: string[];
  transponderType: string;
  compatibleParts: string[];
  notes?: string;
  price?: number;
  sku?: string;
  source: string;
}

/**
 * Service for fetching FCC data from external sources
 * Uses a proxy API to avoid CORS issues
 */
export class FccService {
  private static instance: FccService;

  private constructor() {}

  public static getInstance(): FccService {
    if (!FccService.instance) {
      FccService.instance = new FccService();
    }
    return FccService.instance;
  }

  /**
   * Get FCC data from our proxy API that fetches from multiple sources
   */
  async getFccData(
    make: string,
    model: string,
    year: number
  ): Promise<FccData[]> {
    try {
      console.log(`Fetching FCC data for: ${make} ${model} ${year}`);

      // Use our proxy API to avoid CORS issues
      const response = await axios.get(`/api/fcc-proxy`, {
        params: { make, model, year },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} FCC data results`);
        return response.data;
      } else {
        console.warn("Invalid response format from FCC proxy:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching FCC data:", error);
      return [];
    }
  }

  async getFccDataByFccId(fccId: string): Promise<FccData | null> {
    try {
      const response = await axios.get(
        `https://www.uhshardware.com/api/fcc/${fccId}`
      );
      if (response.data) {
        return {
          fccId: response.data.fccId,
          make: response.data.make,
          model: response.data.model,
          year: response.data.year,
          frequency: response.data.frequency,
          chipType: response.data.chipType,
          transponderType: response.data.transponderType,
          compatibleParts: response.data.compatibleParts,
          notes: response.data.notes,
          price: response.data.price,
          sku: response.data.sku,
          source: response.data.source,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching FCC data by ID:", error);
      return null;
    }
  }
}
