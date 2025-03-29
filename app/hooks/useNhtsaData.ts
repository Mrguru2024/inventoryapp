import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UseNhtsaDataProps {
  make?: string;
  model?: string;
}

interface NhtsaResponse {
  Results: Array<{
    Make_ID: number;
    Make_Name: string;
    Model_ID: number;
    Model_Name: string;
    Year: number;
  }>;
}

interface NhtsaMake {
  Make_ID: number;
  Make_Name: string;
}

interface NhtsaModel {
  Model_ID: number;
  Model_Name: string;
}

interface NhtsaYear {
  Year: number;
}

// Fallback data for makes
const FALLBACK_MAKES = [
  "ACURA",
  "AUDI",
  "BMW",
  "CHEVROLET",
  "DODGE",
  "FORD",
  "HONDA",
  "HYUNDAI",
  "INFINITI",
  "KIA",
  "LEXUS",
  "MAZDA",
  "MERCEDES-BENZ",
  "NISSAN",
  "PORSCHE",
  "SUBARU",
  "TOYOTA",
  "VOLKSWAGEN",
  "VOLVO",
];

// Fallback data for models by make
const FALLBACK_MODELS: Record<string, string[]> = {
  ACURA: ["ILX", "MDX", "RDX", "TLX", "NSX"],
  AUDI: [
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "Q3",
    "Q5",
    "Q7",
    "Q8",
    "RS",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7",
    "S8",
    "TT",
  ],
  BMW: [
    "1 Series",
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "6 Series",
    "7 Series",
    "8 Series",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "M2",
    "M3",
    "M4",
    "M5",
    "M8",
  ],
  CHEVROLET: [
    "Camaro",
    "Corvette",
    "Malibu",
    "Silverado",
    "Tahoe",
    "Traverse",
    "Equinox",
    "Blazer",
    "Trax",
  ],
  DODGE: ["Challenger", "Charger", "Durango", "Grand Caravan", "Journey"],
  FORD: [
    "F-150",
    "F-250",
    "F-350",
    "Mustang",
    "Explorer",
    "Escape",
    "Edge",
    "Expedition",
    "Ranger",
  ],
  HONDA: [
    "Accord",
    "Civic",
    "CR-V",
    "HR-V",
    "Odyssey",
    "Pilot",
    "Ridgeline",
    "Insight",
  ],
  HYUNDAI: [
    "Accent",
    "Elantra",
    "Sonata",
    "Tucson",
    "Santa Fe",
    "Palisade",
    "Kona",
    "Venue",
  ],
  INFINITI: ["Q50", "Q60", "Q70", "QX30", "QX50", "QX60", "QX80"],
  KIA: [
    "Forte",
    "K5",
    "Optima",
    "Sorento",
    "Telluride",
    "Sportage",
    "Soul",
    "Seltos",
  ],
  LEXUS: ["ES", "IS", "LS", "NX", "RX", "GX", "LX", "UX", "RC", "LC"],
  MAZDA: ["Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-9", "MX-30"],
  "MERCEDES-BENZ": [
    "A-Class",
    "C-Class",
    "E-Class",
    "S-Class",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "G-Class",
    "AMG GT",
  ],
  NISSAN: [
    "Altima",
    "Maxima",
    "Sentra",
    "Rogue",
    "Murano",
    "Pathfinder",
    "Armada",
    "370Z",
    "GT-R",
  ],
  PORSCHE: [
    "911",
    "Cayenne",
    "Macan",
    "Panamera",
    "Taycan",
    "Cayman",
    "Boxster",
  ],
  SUBARU: [
    "Impreza",
    "Legacy",
    "Outback",
    "Forester",
    "Crosstrek",
    "Ascent",
    "WRX",
    "BRZ",
  ],
  TOYOTA: [
    "Camry",
    "Corolla",
    "RAV4",
    "Highlander",
    "4Runner",
    "Tacoma",
    "Tundra",
    "Sienna",
    "Prius",
    "C-HR",
    "Venza",
  ],
  VOLKSWAGEN: [
    "Jetta",
    "Passat",
    "Tiguan",
    "Atlas",
    "Golf",
    "Arteon",
    "Taos",
    "ID.4",
  ],
  VOLVO: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
};

// Fallback data for years
const FALLBACK_YEARS = Array.from({ length: 25 }, (_, i) => 2024 - i);

const fetchWithFallback = async <T>(
  url: string,
  fallbackData: T
): Promise<T> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return fallbackData;
  }
};

export function useNhtsaData() {
  const [makes, setMakes] = useState<NhtsaMake[]>([]);
  const [models, setModels] = useState<NhtsaModel[]>([]);
  const [years, setYears] = useState<NhtsaYear[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch makes
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json"
        );
        const data = await response.json();
        if (data.Results) {
          setMakes(data.Results);
        } else {
          // Use fallback data if API fails
          setMakes(
            FALLBACK_MAKES.map((make, index) => ({
              Make_ID: index + 1,
              Make_Name: make,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching makes:", err);
        // Use fallback data on error
        setMakes(
          FALLBACK_MAKES.map((make, index) => ({
            Make_ID: index + 1,
            Make_Name: make,
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMakes();
  }, []);

  // Fetch models when make is selected
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setModels([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(
            selectedMake
          )}?format=json`
        );
        const data = await response.json();
        if (data.Results) {
          setModels(data.Results);
        } else {
          // Use fallback data if API fails
          setModels(
            (FALLBACK_MODELS[selectedMake] || []).map((model, index) => ({
              Model_ID: index + 1,
              Model_Name: model,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching models:", err);
        // Use fallback data on error
        setModels(
          (FALLBACK_MODELS[selectedMake] || []).map((model, index) => ({
            Model_ID: index + 1,
            Model_Name: model,
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [selectedMake]);

  // Generate years (current year to 1995)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1994 }, (_, i) => ({
      Year: currentYear - i,
    }));
    setYears(yearOptions);
  }, []);

  return {
    makes,
    models,
    years,
    selectedMake,
    selectedModel,
    selectedYear,
    setSelectedMake,
    setSelectedModel,
    setSelectedYear,
    isLoading,
    error,
  };
}
