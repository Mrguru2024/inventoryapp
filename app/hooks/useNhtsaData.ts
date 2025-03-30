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
const FALLBACK_MAKES: NhtsaMake[] = [
  { Make_ID: 1, Make_Name: "ACURA" },
  { Make_ID: 2, Make_Name: "AUDI" },
  { Make_ID: 3, Make_Name: "BMW" },
  { Make_ID: 4, Make_Name: "CHEVROLET" },
  { Make_ID: 5, Make_Name: "DODGE" },
  { Make_ID: 6, Make_Name: "FORD" },
  { Make_ID: 7, Make_Name: "HONDA" },
  { Make_ID: 8, Make_Name: "HYUNDAI" },
  { Make_ID: 9, Make_Name: "INFINITI" },
  { Make_ID: 10, Make_Name: "KIA" },
  { Make_ID: 11, Make_Name: "LEXUS" },
  { Make_ID: 12, Make_Name: "MAZDA" },
  { Make_ID: 13, Make_Name: "MERCEDES-BENZ" },
  { Make_ID: 14, Make_Name: "NISSAN" },
  { Make_ID: 15, Make_Name: "PORSCHE" },
  { Make_ID: 16, Make_Name: "SUBARU" },
  { Make_ID: 17, Make_Name: "TOYOTA" },
  { Make_ID: 18, Make_Name: "VOLKSWAGEN" },
  { Make_ID: 19, Make_Name: "VOLVO" },
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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return fallbackData;
  }
};

export function useNhtsaData({ make, model }: UseNhtsaDataProps = {}) {
  const [makes, setMakes] = useState<NhtsaMake[]>([]);
  const [models, setModels] = useState<NhtsaModel[]>([]);
  const [years, setYears] = useState<NhtsaYear[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch makes
  const { data: makesData } = useQuery({
    queryKey: ["makes"],
    queryFn: async () => {
      const response = await fetchWithFallback(
        "/api/nhtsa?endpoint=getallmakes",
        { Results: FALLBACK_MAKES, Count: FALLBACK_MAKES.length }
      );
      return response.Results;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  useEffect(() => {
    if (makesData) {
      setMakes(makesData);
    }
  }, [makesData]);

  // Fetch models when make is selected
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setModels([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWithFallback(
          `/api/nhtsa?endpoint=getmodelsformake&make=${encodeURIComponent(
            selectedMake
          )}`,
          {
            Results:
              FALLBACK_MODELS[selectedMake]?.map((model) => ({
                Model_ID: 0,
                Model_Name: model,
              })) || [],
          }
        );
        setModels(data.Results || []);
      } catch (error) {
        console.error("Error fetching models:", error);
        setError("Failed to fetch models");
        setModels(
          FALLBACK_MODELS[selectedMake]?.map((model) => ({
            Model_ID: 0,
            Model_Name: model,
          })) || []
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [selectedMake]);

  // Generate years
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
    setSelectedMake,
    setSelectedModel,
    isLoading,
    error,
  };
}
