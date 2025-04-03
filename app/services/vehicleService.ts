import axios from "axios";

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

// Define relevant automotive manufacturers
const RELEVANT_MAKES = new Set([
  "ACURA",
  "AUDI",
  "BMW",
  "BUICK",
  "CADILLAC",
  "CHEVROLET",
  "CHRYSLER",
  "DODGE",
  "FIAT",
  "FORD",
  "GENESIS",
  "GMC",
  "HONDA",
  "HYUNDAI",
  "INFINITI",
  "JAGUAR",
  "JEEP",
  "KIA",
  "LAND ROVER",
  "LEXUS",
  "LINCOLN",
  "MAZDA",
  "MERCEDES-BENZ",
  "MINI",
  "MITSUBISHI",
  "NISSAN",
  "PORSCHE",
  "RAM",
  "SUBARU",
  "TESLA",
  "TOYOTA",
  "VOLKSWAGEN",
  "VOLVO",
]);

// Name normalization mapping
const MAKE_NAME_MAPPING: { [key: string]: string } = {
  "MERCEDES-BENZ": "Mercedes-Benz",
  "LAND ROVER": "Land Rover",
  // Add any other name normalizations here
};

export interface VehicleApiResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: any[];
}

export interface VehicleMake {
  Make_ID: number;
  Make_Name: string;
}

export interface VehicleModel {
  Model_ID: number;
  Model_Name: string;
  Make_ID: number;
  Make_Name: string;
}

export interface Make {
  MakeId: number;
  MakeName: string;
}

export interface Model {
  ModelId: number;
  ModelName: string;
}

export interface Year {
  Year: number;
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
}

class VehicleService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = NHTSA_BASE_URL;
  }

  normalizeMakeName(make: string): string {
    return (
      MAKE_NAME_MAPPING[make.toUpperCase()] ||
      make
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    );
  }

  isRelevantMake(make: string): boolean {
    return RELEVANT_MAKES.has(make.toUpperCase());
  }

  async testApiConnection(): Promise<boolean> {
    try {
      const response = await axios.get<VehicleApiResponse>(
        `${this.baseUrl}/GetAllMakes?format=json`
      );
      return response.status === 200 && Array.isArray(response.data.Results);
    } catch (error) {
      console.error("API Connection Test Failed:", error);
      return false;
    }
  }

  async getAllMakes(): Promise<Make[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getallmakes?format=json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Filter and normalize makes
      const filteredMakes = data.Results.filter((make: any) =>
        this.isRelevantMake(make.Make_Name)
      )
        .map((make: any) => ({
          MakeId: make.Make_ID,
          MakeName: this.normalizeMakeName(make.Make_Name),
        }))
        .sort((a: Make, b: Make) => a.MakeName.localeCompare(b.MakeName));

      return filteredMakes;
    } catch (error) {
      console.error("Error fetching makes:", error);
      // Return fallback makes if API fails
      return Object.keys(MAKE_NAME_MAPPING)
        .map((make, index) => ({
          MakeId: index + 1,
          MakeName: this.normalizeMakeName(make),
        }))
        .sort((a, b) => a.MakeName.localeCompare(b.MakeName));
    }
  }

  async getModelsForMake(make: string): Promise<Model[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/getmodelsformake/${encodeURIComponent(
          make
        )}?format=json`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.Results;
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  }

  async getYearsForModel(make: string, model: string): Promise<Year[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/getmodelyearinterval/${encodeURIComponent(
          make
        )}/${encodeURIComponent(model)}?format=json`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.Results;
    } catch (error) {
      console.error("Error fetching years:", error);
      throw error;
    }
  }

  async validateVehicle(
    make: string,
    model: string,
    year: string
  ): Promise<boolean> {
    try {
      if (!make || !model || !year || !this.isRelevantMake(make)) {
        return false;
      }

      const response = await axios.get<VehicleApiResponse>(
        `${this.baseUrl}/GetModelsForMakeYear/make/${encodeURIComponent(
          make
        )}/modelyear/${year}?format=json`
      );

      const normalizedModel = model.toLowerCase();
      const isValid = response.data.Results.some(
        (m: VehicleModel) => m.Model_Name.toLowerCase() === normalizedModel
      );

      console.log(
        `Vehicle validation result for ${year} ${make} ${model}: ${isValid}`
      );
      return isValid;
    } catch (error) {
      console.error("Error validating vehicle:", error);
      return false;
    }
  }
}

export const vehicleService = new VehicleService();
