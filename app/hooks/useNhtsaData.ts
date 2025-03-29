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

export function useNhtsaData({ make, model }: UseNhtsaDataProps = {}) {
  const [selectedMake, setSelectedMake] = useState<string | undefined>(make);
  const [selectedModel, setSelectedModel] = useState<string | undefined>(model);

  // Fetch all makes
  const { data: makes = FALLBACK_MAKES, isLoading: isLoadingMakes } = useQuery({
    queryKey: ["makes"],
    queryFn: () =>
      fetchWithFallback("/api/nhtsa?action=getMakes", FALLBACK_MAKES),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Fetch models for selected make
  const { data: models = [], isLoading: isLoadingModels } = useQuery({
    queryKey: ["models", selectedMake],
    queryFn: async () => {
      if (!selectedMake) return [];
      try {
        const response = await fetchWithFallback(
          `/api/nhtsa?action=getModels&make=${encodeURIComponent(
            selectedMake
          )}`,
          FALLBACK_MODELS[selectedMake] || []
        );
        // Ensure we always return an array
        return Array.isArray(response)
          ? response
          : FALLBACK_MODELS[selectedMake] || [];
      } catch (error) {
        console.error("Error fetching models:", error);
        return FALLBACK_MODELS[selectedMake] || [];
      }
    },
    enabled: !!selectedMake,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Fetch years for selected make and model
  const { data: years = FALLBACK_YEARS, isLoading: isLoadingYears } = useQuery({
    queryKey: ["years", selectedMake, selectedModel],
    queryFn: () => {
      if (!selectedMake || !selectedModel) return FALLBACK_YEARS;
      return fetchWithFallback(
        `/api/nhtsa?action=getYears&make=${encodeURIComponent(
          selectedMake
        )}&model=${encodeURIComponent(selectedModel)}`,
        FALLBACK_YEARS
      );
    },
    enabled: !!selectedMake && !!selectedModel,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Update selected values when props change
  useEffect(() => {
    if (make) setSelectedMake(make);
    if (model) setSelectedModel(model);
  }, [make, model]);

  return {
    makes: Array.isArray(makes) ? makes : FALLBACK_MAKES,
    models: Array.isArray(models)
      ? models
      : selectedMake
      ? FALLBACK_MODELS[selectedMake] || []
      : [],
    years: Array.isArray(years) ? years : FALLBACK_YEARS,
    selectedMake,
    selectedModel,
    setSelectedMake,
    setSelectedModel,
    isLoading: isLoadingMakes || isLoadingModels || isLoadingYears,
  };
}
