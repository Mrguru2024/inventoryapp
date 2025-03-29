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
  id: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string;
  compatibleParts: string | null;
  frequency: string | null;
  remoteFrequency?: string | null;
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

export const transponderService = {
  async searchTransponders(params: TransponderSearchParams = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("q", params.search);
      if (params.make) queryParams.append("make", params.make);
      if (params.model) queryParams.append("model", params.model);
      if (params.year) queryParams.append("year", params.year);
      if (params.type) queryParams.append("type", params.type);

      const queryString = queryParams.toString();
      const url = `/api/transponders/search${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching transponders:", error);
      throw new Error("Failed to search transponder data");
    }
  },

  async getTransponderByVehicle(make: string, model: string, year: number) {
    try {
      const response = await axios.get(`/api/transponders/vehicle`, {
        params: { make, model, year },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting transponder by vehicle:", error);
      throw new Error("Failed to get transponder data");
    }
  },

  async addTransponderData(data: Omit<TransponderKeyData, "id">) {
    try {
      const response = await axios.post("/api/transponders", data);
      return response.data;
    } catch (error) {
      console.error("Error adding transponder data:", error);
      throw new Error("Failed to add transponder data");
    }
  },

  async getCompatibleChips(transponderId: string) {
    try {
      const response = await axios.get(
        `/api/transponders/${transponderId}/chips`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting compatible chips:", error);
      throw new Error("Failed to get compatible chips");
    }
  },
};

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
