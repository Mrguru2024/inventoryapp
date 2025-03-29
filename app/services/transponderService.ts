import axios from "axios";

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
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.make) queryParams.append("make", params.make);
      if (params?.model) queryParams.append("model", params.model);
      if (params?.year) queryParams.append("year", params.year);
      if (params?.type) queryParams.append("type", params.type);

      const response = await axios.get(
        `/api/transponders/search?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching transponders:", error);
      throw new Error("Failed to search transponders");
    }
  }

  async getAllTransponders(): Promise<TransponderData[]> {
    try {
      const response = await axios.get("/api/transponders");
      return response.data;
    } catch (error) {
      console.error("Error fetching transponders:", error);
      throw new Error("Failed to fetch transponders");
    }
  }

  async getTransponderByVehicle(
    make: string,
    model: string,
    year: number
  ): Promise<TransponderData | null> {
    try {
      const response = await axios.get(
        `/api/transponders/vehicle?make=${make}&model=${model}&year=${year}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicle transponder:", error);
      throw new Error("Failed to fetch vehicle transponder");
    }
  }

  async addTransponderData(data: Omit<TransponderData, "id">) {
    try {
      const response = await axios.post("/api/transponders", data);
      return response.data;
    } catch (error) {
      console.error("Error adding transponder:", error);
      throw new Error("Failed to add transponder");
    }
  }

  async deleteTransponder(id: number) {
    try {
      await axios.delete(`/api/transponders/${id}`);
    } catch (error) {
      console.error("Error deleting transponder:", error);
      throw new Error("Failed to delete transponder");
    }
  }

  async getCompatibleChips(transponderId: string) {
    try {
      const response = await axios.get(
        `/api/transponders/${transponderId}/chips`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching compatible chips:", error);
      throw new Error("Failed to fetch compatible chips");
    }
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
