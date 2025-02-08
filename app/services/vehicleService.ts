import axios from 'axios';

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

// Define relevant automotive manufacturers
const RELEVANT_MAKES = new Set([
  'ACURA',
  'AUDI',
  'BMW',
  'BUICK',
  'CADILLAC',
  'CHEVROLET',
  'CHRYSLER',
  'DODGE',
  'FIAT',
  'FORD',
  'GENESIS',
  'GMC',
  'HONDA',
  'HYUNDAI',
  'INFINITI',
  'JAGUAR',
  'JEEP',
  'KIA',
  'LAND ROVER',
  'LEXUS',
  'LINCOLN',
  'MAZDA',
  'MERCEDES-BENZ',
  'MINI',
  'MITSUBISHI',
  'NISSAN',
  'PORSCHE',
  'RAM',
  'SUBARU',
  'TESLA',
  'TOYOTA',
  'VOLKSWAGEN',
  'VOLVO'
]);

// Name normalization mapping
const MAKE_NAME_MAPPING: { [key: string]: string } = {
  'MERCEDES-BENZ': 'Mercedes-Benz',
  'LAND ROVER': 'Land Rover',
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

export const vehicleService = {
  normalizeMakeName(make: string): string {
    return MAKE_NAME_MAPPING[make.toUpperCase()] || 
           make.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  },

  isRelevantMake(make: string): boolean {
    return RELEVANT_MAKES.has(make.toUpperCase());
  },

  async testApiConnection(): Promise<boolean> {
    try {
      const response = await axios.get<VehicleApiResponse>(
        `${NHTSA_BASE_URL}/GetAllMakes?format=json`
      );
      return response.status === 200 && Array.isArray(response.data.Results);
    } catch (error) {
      console.error('API Connection Test Failed:', error);
      return false;
    }
  },

  async getAllMakes(): Promise<string[]> {
    try {
      const response = await axios.get<VehicleApiResponse>(
        `${NHTSA_BASE_URL}/GetAllMakes?format=json`
      );
      
      if (!response.data.Results?.length) {
        throw new Error('No makes data received from API');
      }

      const makes = response.data.Results
        .map((make: VehicleMake) => make.Make_Name)
        .filter(make => this.isRelevantMake(make))
        .map(make => this.normalizeMakeName(make))
        .sort();

      console.log(`Successfully fetched ${makes.length} relevant makes`);
      return makes;
    } catch (error) {
      console.error('Error fetching makes:', error);
      throw new Error('Failed to fetch vehicle makes');
    }
  },

  async getModelsForMakeYear(make: string, year: string): Promise<string[]> {
    try {
      if (!make || !year) {
        throw new Error('Make and year are required');
      }

      const response = await axios.get<VehicleApiResponse>(
        `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`
      );

      if (!response.data.Results?.length) {
        console.log(`No models found for ${make} ${year}`);
        return [];
      }

      const models = response.data.Results
        .map((model: VehicleModel) => model.Model_Name)
        .filter(Boolean)
        .map(model => model.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' '))
        .sort();

      console.log(`Successfully fetched ${models.length} models for ${make} ${year}`);
      return models;
    } catch (error) {
      console.error(`Error fetching models for ${make} ${year}:`, error);
      throw new Error(`Failed to fetch models for ${make} ${year}`);
    }
  },

  async validateVehicle(make: string, model: string, year: string): Promise<boolean> {
    try {
      if (!make || !model || !year || !this.isRelevantMake(make)) {
        return false;
      }

      const response = await axios.get<VehicleApiResponse>(
        `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`
      );

      const normalizedModel = model.toLowerCase();
      const isValid = response.data.Results.some(
        (m: VehicleModel) => m.Model_Name.toLowerCase() === normalizedModel
      );

      console.log(`Vehicle validation result for ${year} ${make} ${model}: ${isValid}`);
      return isValid;
    } catch (error) {
      console.error('Error validating vehicle:', error);
      return false;
    }
  }
}; 