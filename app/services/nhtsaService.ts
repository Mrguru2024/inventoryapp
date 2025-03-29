import axios from "axios";

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api";
const NHTSA_API_KEY = process.env.NHTSA_API_KEY || "demo"; // Use 'demo' as fallback for testing
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache duration

export interface NHTSAVehicleInfo {
  make: string;
  model: string;
  year: number;
  bodyStyle?: string;
  engineType?: string;
  transmissionType?: string;
  fuelType?: string;
  trim?: string;
  series?: string;
  vin: string;
}

export interface NHTSAResponse {
  Count: number;
  Message: string;
  Results: Array<{
    Variable: string;
    Value: string;
    ValueId?: string;
  }>;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class NHTService {
  private static instance: NHTService;
  private lastRequestTime: number = 0;
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests
  private makesCache: CacheEntry<string[]> | null = null;
  private modelsCache: Record<string, CacheEntry<string[]>> = {};
  private yearsCache: Record<string, CacheEntry<number[]>> = {};
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  private constructor() {}

  public static getInstance(): NHTService {
    if (!NHTService.instance) {
      NHTService.instance = new NHTService();
    }
    return NHTService.instance;
  }

  private async delayForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  private isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
    if (!cache) return false;
    return Date.now() - cache.timestamp < CACHE_DURATION;
  }

  private async processRequestQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        await request();
      }
      await this.delayForRateLimit();
    }
    this.isProcessingQueue = false;
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          await this.delayForRateLimit();

          const queryParams = new URLSearchParams({
            format: "json",
            api_key: NHTSA_API_KEY,
            ...params,
          });

          const response = await axios.get(
            `${NHTSA_BASE_URL}${endpoint}?${queryParams}`
          );
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      });

      this.processRequestQueue();
    });
  }

  public async getAllMakes(): Promise<string[]> {
    if (this.isCacheValid(this.makesCache)) {
      return this.makesCache!.data;
    }

    try {
      const response = await this.makeRequest<NHTSAResponse>(
        "/vehicles/GetAllMakes"
      );
      const makes = response.Results.map((result) => result.Value);
      this.makesCache = {
        data: makes,
        timestamp: Date.now(),
      };
      return makes;
    } catch (error) {
      console.error("Error getting all makes:", error);
      // Return a fallback list of common makes for testing
      return [
        "BMW",
        "TOYOTA",
        "HONDA",
        "FORD",
        "CHEVROLET",
        "NISSAN",
        "HYUNDAI",
        "KIA",
        "VOLKSWAGEN",
        "AUDI",
        "MERCEDES-BENZ",
        "LEXUS",
        "ACURA",
        "INFINITI",
        "MAZDA",
        "SUBARU",
        "VOLVO",
        "PORSCHE",
        "JEEP",
      ];
    }
  }

  public async getModelsForMake(make: string): Promise<string[]> {
    if (this.isCacheValid(this.modelsCache[make])) {
      return this.modelsCache[make].data;
    }

    try {
      const response = await this.makeRequest<NHTSAResponse>(
        "/vehicles/GetModelsForMake",
        {
          make: make,
        }
      );
      const models = response.Results.map((result) => result.Value);
      this.modelsCache[make] = {
        data: models,
        timestamp: Date.now(),
      };
      return models;
    } catch (error) {
      console.error("Error getting models for make:", error);
      // Return a fallback list of common models for testing
      return ["MODEL1", "MODEL2", "MODEL3"];
    }
  }

  public async getYearsForMakeModel(
    make: string,
    model: string
  ): Promise<number[]> {
    const cacheKey = `${make}-${model}`;
    if (this.isCacheValid(this.yearsCache[cacheKey])) {
      return this.yearsCache[cacheKey].data;
    }

    try {
      const currentYear = new Date().getFullYear();
      const years: number[] = [];

      // Get models for the last 30 years
      for (let year = currentYear; year >= currentYear - 30; year--) {
        const response = await this.makeRequest<NHTSAResponse>(
          "/vehicles/GetModelsForMakeYear",
          {
            make: make,
            modelyear: year.toString(),
          }
        );

        if (response.Results.some((result) => result.Value === model)) {
          years.push(year);
        }
      }

      this.yearsCache[cacheKey] = {
        data: years,
        timestamp: Date.now(),
      };
      return years;
    } catch (error) {
      console.error("Error getting years for make and model:", error);
      // Return a fallback list of recent years for testing
      const currentYear = new Date().getFullYear();
      return [currentYear, currentYear - 1, currentYear - 2];
    }
  }

  public async decodeVIN(
    vin: string,
    modelYear?: number
  ): Promise<NHTSAVehicleInfo | null> {
    try {
      const response = await this.makeRequest<NHTSAResponse>(
        `/vehicles/DecodeVin/${vin}`,
        {
          modelyear: modelYear?.toString() || "",
        }
      );

      if (response.Count === 0) {
        return null;
      }

      const result = response.Results.reduce((acc, curr) => {
        acc[curr.Variable] = curr.Value;
        return acc;
      }, {} as Record<string, string>);

      return {
        make: result["Make"] || "",
        model: result["Model"] || "",
        year: parseInt(result["Model Year"] || "0"),
        bodyStyle: result["Body Style"] || undefined,
        engineType: result["Engine Model"] || undefined,
        transmissionType: result["Transmission Style"] || undefined,
        fuelType: result["Fuel Type - Primary"] || undefined,
        trim: result["Trim"] || undefined,
        series: result["Series"] || undefined,
        vin: vin,
      };
    } catch (error) {
      console.error("Error decoding VIN:", error);
      return null;
    }
  }
}
