import {
  Make,
  Model,
  Year,
  Transponder,
  TransponderFilters,
  TransponderType,
  TransponderId,
} from "../domain/value-objects";
import { NhtsaRepository, TransponderRepository } from "../domain/repositories";

export class NhtsaApiRepository implements NhtsaRepository {
  private readonly baseUrl = "/api/nhtsa";
  private makesCache: Make[] = [];
  private modelsCache = new Map<number, Model[]>();
  private yearsCache: Year[] = [];

  // Prioritized makes in order of popularity in the US market
  private readonly prioritizedMakes = [
    // Domestic
    "FORD",
    "CHEVROLET",
    "DODGE",
    "CHRYSLER",
    "JEEP",
    "RAM",
    "GMC",
    "BUICK",
    "CADILLAC",
    "LINCOLN",
    // Major Imports
    "TOYOTA",
    "HONDA",
    "NISSAN",
    "HYUNDAI",
    "KIA",
    "VOLKSWAGEN",
    "BMW",
    "MERCEDES-BENZ",
    "AUDI",
    "MAZDA",
    "SUBARU",
    "VOLVO",
    "LEXUS",
    "INFINITI",
    "ACURA",
    "PORSCHE",
  ];

  private getMakePriority(makeName: string): number {
    const index = this.prioritizedMakes.indexOf(makeName.toUpperCase());
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  async getAllMakes(): Promise<Make[]> {
    try {
      // Return cached makes if available
      if (this.makesCache.length > 0) {
        return this.makesCache;
      }

      const response = await fetch(`${this.baseUrl}?endpoint=getallmakes`);
      if (!response.ok) {
        throw new Error(`Failed to fetch makes: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.Results || !Array.isArray(data.Results)) {
        return [];
      }

      // Map and sort makes by priority
      this.makesCache = data.Results.map((result: any) =>
        Make.fromNhtsa({
          Make_ID: result.Make_ID,
          Make_Name: result.Make_Name,
        })
      ).sort((a, b) => {
        const priorityA = this.getMakePriority(a.name);
        const priorityB = this.getMakePriority(b.name);
        if (priorityA === priorityB) {
          return a.name.localeCompare(b.name);
        }
        return priorityA - priorityB;
      });

      return this.makesCache;
    } catch (error) {
      console.error("Error fetching makes:", error);
      return [];
    }
  }

  async getModelsForMake(make: Make): Promise<Model[]> {
    try {
      // Return cached models if available
      if (this.modelsCache.has(make.id)) {
        return this.modelsCache.get(make.id)!;
      }

      const response = await fetch(
        `${this.baseUrl}?endpoint=getmodelsformake&make=${encodeURIComponent(
          make.name
        )}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.Results || !Array.isArray(data.Results)) {
        return [];
      }

      const models = data.Results.map((result: any) =>
        Model.fromNhtsa({
          Model_ID: result.Model_ID,
          Model_Name: result.Model_Name,
          Make_ID: make.id,
        })
      );

      // Cache the models
      this.modelsCache.set(make.id, models);
      return models;
    } catch (error) {
      console.error("Error fetching models:", error);
      return [];
    }
  }

  async getYearsForModel(model: Model): Promise<Year[]> {
    try {
      // Return cached years if available
      if (this.yearsCache.length > 0) {
        return this.yearsCache;
      }

      const currentYear = new Date().getFullYear();
      this.yearsCache = Array.from({ length: currentYear - 1994 }, (_, i) =>
        Year.fromNhtsa({ Year: currentYear - i })
      );

      return this.yearsCache;
    } catch (error) {
      console.error("Error generating years:", error);
      return [];
    }
  }
}

export class TransponderApiRepository implements TransponderRepository {
  private readonly baseUrl = "/api/transponders";
  private transponderTypesCache: string[] = [];
  private searchCache = new Map<string, Transponder[]>();

  async searchTransponders(
    filters: TransponderFilters
  ): Promise<Transponder[]> {
    try {
      // Create a cache key from the filters
      const cacheKey = JSON.stringify(filters);

      // Return cached results if available
      if (this.searchCache.has(cacheKey)) {
        return this.searchCache.get(cacheKey)!;
      }

      const response = await fetch(`${this.baseUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to search transponders: ${response.statusText}`
        );
      }

      const data = await response.json();
      const transponders = data.map(this.mapToTransponder);

      // Cache the results
      this.searchCache.set(cacheKey, transponders);
      return transponders;
    } catch (error) {
      console.error("Error searching transponders:", error);
      return [];
    }
  }

  async getTransponderById(id: string): Promise<Transponder | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch transponder: ${response.statusText}`);
      }
      const data = await response.json();
      return this.mapToTransponder(data);
    } catch (error) {
      console.error("Error fetching transponder:", error);
      return null;
    }
  }

  async getAllTransponderTypes(): Promise<string[]> {
    try {
      // Return cached types if available
      if (this.transponderTypesCache.length > 0) {
        return this.transponderTypesCache;
      }

      const response = await fetch(`${this.baseUrl}/types`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch transponder types: ${response.statusText}`
        );
      }

      this.transponderTypesCache = await response.json();
      return this.transponderTypesCache;
    } catch (error) {
      console.error("Error fetching transponder types:", error);
      return [];
    }
  }

  private mapToTransponder(data: any): Transponder {
    return new Transponder(
      new TransponderId(data.id),
      new Make(data.make.id, data.make.name),
      new Model(data.model.id, data.model.name, data.model.makeId),
      data.yearStart ? Year.fromNhtsa({ Year: data.yearStart }) : null,
      data.yearEnd ? Year.fromNhtsa({ Year: data.yearEnd }) : null,
      TransponderType.fromString(data.transponderType),
      data.chipTypes,
      data.compatibleParts,
      data.frequency,
      data.notes,
      data.dualSystem
    );
  }
}
