import axios from 'axios';

export interface KeyData {
  partNumber: string;
  year: string;
  make: string;
  model: string;
  fccId: string;
  icNumber: string;
  continentalNumber: string;
  frequency: string;
  battery: string;
  emergencyKey: string;
  buttons: string[];
  manufacturer: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const keyService = {
  async searchByBarcode(barcode: string): Promise<KeyData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/keys/search/${barcode}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch key data');
    }
  },

  async addKey(keyData: KeyData): Promise<KeyData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/keys`, keyData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add key');
    }
  },

  async validateKeyData(keyData: Partial<KeyData>): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/keys/validate`, keyData);
      return response.data.valid;
    } catch (error) {
      throw new Error('Failed to validate key data');
    }
  }
}; 