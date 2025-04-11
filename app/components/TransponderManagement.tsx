"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import TransponderIdentifier from "./TransponderIdentifier";
import TransponderInventoryManager from "./TransponderInventoryManager";
import ProgrammingGuideGenerator from "./ProgrammingGuideGenerator";
import { TransponderKeyData } from "@/app/services/transponderService";
import { TransponderInventoryItem } from "@/app/services/transponderInventoryService";
import { useToast } from "@/app/components/ui/use-toast";
import LoadingSpinner from "./LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import styles from "./TransponderManagement.module.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

// Add common US & Domestic vehicle makes
const COMMON_US_MAKES = [
  "Chevrolet",
  "Ford",
  "Dodge",
  "Chrysler",
  "Jeep",
  "GMC",
  "Buick",
  "Cadillac",
  "Lincoln",
  "Tesla",
  "Ram",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Toyota",
  "Honda",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru",
  "Volvo",
  "Lexus",
  "Acura",
  "Infiniti",
  "Porsche",
  "Land Rover",
  "Range Rover",
  "Jaguar",
  "Alfa Romeo",
  "Fiat",
  "Maserati",
  "Bentley",
  "Rolls-Royce",
  "Ferrari",
  "Lamborghini",
  "McLaren",
  "Aston Martin",
  "Lotus",
  "Rivian",
  "Lucid",
  "Polestar",
  "Genesis",
  "Mini",
  "Smart",
  "Fisker",
  "Bollinger",
  "Lordstown",
  "Nikola",
  "Canoo",
  "Faraday Future",
  "Karma",
  "DeLorean",
  "Hennessey",
  "Saleen",
  "Shelby",
  "Roush",
  "Callaway",
];

// Add common US & Domestic vehicle models
const COMMON_US_MODELS = {
  Chevrolet: [
    "Silverado",
    "Malibu",
    "Impala",
    "Camaro",
    "Corvette",
    "Tahoe",
    "Suburban",
    "Equinox",
    "Traverse",
    "Cruze",
    "Sonic",
    "Spark",
    "Colorado",
    "Blazer",
    "Trailblazer",
  ],
  Ford: [
    "F-150",
    "F-250",
    "F-350",
    "Mustang",
    "Explorer",
    "Escape",
    "Edge",
    "Focus",
    "Fusion",
    "Taurus",
    "Expedition",
    "Ranger",
    "Bronco",
    "EcoSport",
  ],
  Dodge: [
    "Charger",
    "Challenger",
    "Durango",
    "Grand Caravan",
    "Journey",
    "Ram",
    "Dart",
    "Avenger",
    "Caliber",
    "Nitro",
    "Magnum",
  ],
  Chrysler: [
    "300",
    "Pacifica",
    "Town & Country",
    "Sebring",
    "Concorde",
    "LHS",
    "New Yorker",
    "Imperial",
    "Fifth Avenue",
  ],
  Jeep: [
    "Grand Cherokee",
    "Cherokee",
    "Wrangler",
    "Compass",
    "Renegade",
    "Liberty",
    "Patriot",
    "Commander",
  ],
  GMC: [
    "Sierra",
    "Yukon",
    "Acadia",
    "Terrain",
    "Canyon",
    "Envoy",
    "Jimmy",
    "Sonoma",
  ],
  Buick: [
    "Enclave",
    "Encore",
    "LaCrosse",
    "Regal",
    "Lucerne",
    "Rendezvous",
    "Rainier",
    "Terraza",
  ],
  Cadillac: [
    "Escalade",
    "CTS",
    "ATS",
    "XTS",
    "SRX",
    "DTS",
    "DeVille",
    "Seville",
  ],
  Lincoln: [
    "Navigator",
    "MKX",
    "MKZ",
    "MKC",
    "MKS",
    "Town Car",
    "Continental",
    "Aviator",
  ],
  Tesla: [
    "Model S",
    "Model 3",
    "Model X",
    "Model Y",
    "Cybertruck",
    "Roadster",
    "Semi",
  ],
  Ram: ["1500", "2500", "3500", "ProMaster", "ProMaster City", "C/V"],
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
    "Z4",
    "i3",
    "i4",
    "i7",
    "iX",
    "M2",
    "M3",
    "M4",
    "M5",
    "M8",
    "X3 M",
    "X4 M",
    "X5 M",
    "X6 M",
  ],
  MercedesBenz: [
    "A-Class",
    "C-Class",
    "E-Class",
    "S-Class",
    "CLA",
    "CLS",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "G-Class",
    "AMG GT",
    "EQS",
    "EQE",
    "EQB",
    "EQA",
    "SL",
    "SLC",
    "Maybach",
  ],
  Audi: [
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
    "e-tron",
    "e-tron GT",
    "RS3",
    "RS4",
    "RS5",
    "RS6",
    "RS7",
    "R8",
    "TT",
  ],
  Rivian: ["R1T", "R1S", "EDV"],
  Lucid: ["Air", "Gravity"],
  Polestar: ["1", "2", "3", "4", "5"],
  Genesis: ["G70", "G80", "G90", "GV70", "GV80", "GV60"],
};

// Update the Session interface at the top of the file
interface Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    role: string;
  };
  expires: string;
}

// Update the TransponderSearchParams interface
interface TransponderSearchParams {
  make?: string;
  model?: string;
  year?: string;
  transponderType?: "SMART" | "TRANSPONDER" | "REMOTE" | string;
  search?: string;
}

export default function TransponderManagement() {
  const { data: session, status: sessionStatus } = useSession();
  const [inventoryLevels, setInventoryLevels] = useState<
    TransponderInventoryItem[]
  >([]);
  const [selectedTransponder, setSelectedTransponder] =
    useState<TransponderKeyData | null>(null);
  const [searchParams, setSearchParams] = useState<TransponderSearchParams>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTransponderType, setSelectedTransponderType] =
    useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedTransponderDetails, setSelectedTransponderDetails] =
    useState<TransponderKeyData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Update the useQuery implementation
  const { data: transponders = [], isLoading: isTranspondersLoading } =
    useQuery({
      queryKey: ["transponders", searchParams] as const,
      queryFn: async () => {
        if (!session?.user) {
          console.log("No session available");
          return [] as TransponderKeyData[];
        }

        try {
          const queryParams = new URLSearchParams();
          if (searchParams.make) queryParams.append("make", searchParams.make);
          if (searchParams.model)
            queryParams.append("model", searchParams.model);
          if (searchParams.year) queryParams.append("year", searchParams.year);
          if (searchParams.transponderType)
            queryParams.append("transponderType", searchParams.transponderType);

          const response = await fetch(
            `/api/transponders?${queryParams.toString()}`
          );

          if (!response.ok) {
            throw new Error(await response.text());
          }

          const data = await response.json();
          return data as TransponderKeyData[];
        } catch (error) {
          console.error("Error fetching transponders:", error);
          return [] as TransponderKeyData[];
        }
      },
      staleTime: 5 * 60 * 1000,
      enabled: !!session?.user,
    });

  // Update the filter function with proper types and optimize memoization
  const filteredTransponderData = useMemo(() => {
    if (!transponders?.length) return [];

    const { make, model, year, transponderType } = searchParams;

    return transponders.filter((t: TransponderKeyData) => {
      const makeMatch = !make || t.make.toLowerCase() === make.toLowerCase();
      const modelMatch =
        !model || t.model.toLowerCase() === model.toLowerCase();
      const typeMatch =
        !transponderType || t.transponderType === transponderType;

      let yearMatch = true;
      if (year) {
        const yearNum = parseInt(year);
        if (t.yearStart && typeof t.yearStart === "number") {
          yearMatch =
            t.yearStart <= yearNum &&
            (!t.yearEnd ||
              (typeof t.yearEnd === "number" && t.yearEnd >= yearNum));
        }
      }

      return makeMatch && modelMatch && yearMatch && typeMatch;
    });
  }, [transponders, searchParams]);

  // Update the handlers to prevent cascading updates
  const handleMakeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const make = e.target.value;
      setSelectedMake(make);
      setSelectedModel("");
      setSelectedYear("");
      setSearchParams((prev) => ({
        ...prev,
        make: make || undefined,
        model: undefined,
        year: undefined,
      }));
    },
    []
  );

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const model = e.target.value;
      setSelectedModel(model);
      setSelectedYear("");
      setSearchParams((prev) => ({
        ...prev,
        model: model || undefined,
        year: undefined,
      }));
    },
    []
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const year = e.target.value;
      setSelectedYear(year);
      setSearchParams((prev) => ({
        ...prev,
        year: year || undefined,
      }));
    },
    []
  );

  // Update the getUniqueMakes function to use COMMON_US_MAKES directly
  const getUniqueMakes = useMemo(() => {
    return COMMON_US_MAKES.sort();
  }, []);

  // Update the getModelsForMake function with proper typing
  const getModelsForMake = useCallback(
    (make: string): string[] => {
      if (!make) return [];
      const models = Array.from(
        new Set(
          transponders
            .filter(
              (t: TransponderKeyData) =>
                t.make.toLowerCase() === make.toLowerCase()
            )
            .map((t: TransponderKeyData) => t.model)
        )
      );
      return models.sort();
    },
    [transponders]
  );

  // Update the getYearsForMakeAndModel function with proper typing
  const getYearsForMakeAndModel = useCallback(
    (make: string, model: string): string[] => {
      if (!make || !model) return [];
      const years = Array.from(
        new Set(
          transponders
            .filter(
              (t: TransponderKeyData) =>
                t.make.toLowerCase() === make.toLowerCase() &&
                t.model.toLowerCase() === model.toLowerCase()
            )
            .map((t: TransponderKeyData) => t.yearStart)
        )
      ).filter(
        (year): year is number =>
          typeof year === "number" && year >= 1985 && year <= 2025
      );
      return years.map(String).sort((a, b) => parseInt(b) - parseInt(a));
    },
    [transponders]
  );

  const handleSearch = useCallback((params: any) => {
    // Convert year to string if it's a number
    const searchParams = {
      ...params,
      year: params.year ? params.year.toString() : undefined,
    };
    setSearchParams(searchParams);
    // Clear selected transponder when filters change
    setSelectedTransponder(null);
  }, []);

  // Update the loadData function
  const loadData = useCallback(async () => {
    if (!session?.user) return;

    try {
      const response = await fetch("/api/inventory");

      if (!response.ok) {
        throw new Error("Failed to load inventory data");
      }

      const data = await response.json();
      setInventoryLevels(data);
    } catch (error) {
      console.error("Error loading inventory data:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    }
  }, [session?.user, toast]);

  // Update the stock handlers
  const handleUpdateStock = useCallback(
    async (id: string, quantity: number) => {
      if (!session?.user) return;

      try {
        const response = await fetch(`/api/inventory/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        });

        if (!response.ok) {
          throw new Error("Failed to update stock");
        }

        await loadData();
        toast({
          title: "Success",
          description: "Stock updated successfully",
        });
      } catch (error) {
        console.error("Error updating stock:", error);
        toast({
          title: "Error",
          description: "Failed to update stock",
          variant: "destructive",
        });
      }
    },
    [session?.user, loadData, toast]
  );

  const handleOrderStock = useCallback(
    async (item: TransponderInventoryItem) => {
      if (!session?.user) return;

      try {
        const response = await fetch(`/api/inventory/${item.id}/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          throw new Error("Failed to place order");
        }

        await loadData();
        toast({
          title: "Success",
          description: "Stock order placed successfully",
        });
      } catch (error) {
        console.error("Error ordering stock:", error);
        toast({
          title: "Error",
          description: "Failed to place stock order",
          variant: "destructive",
        });
      }
    },
    [session?.user, loadData, toast]
  );

  // Optimize the filters memo to prevent unnecessary updates
  const filters = useMemo(
    () => ({
      make: selectedMake || undefined,
      model: selectedModel || undefined,
      year: selectedYear || undefined,
      transponderType: selectedTransponderType || undefined,
      searchTerm: searchTerm || undefined,
    }),
    [
      selectedMake,
      selectedModel,
      selectedYear,
      selectedTransponderType,
      searchTerm,
    ]
  );

  // Update the debouncedSearch function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setSearchParams((prev) => ({ ...prev, search: value }));
    }, 300),
    []
  );

  // Update the delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) throw new Error("Not authenticated");

      const response = await fetch(`/api/transponders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transponder");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transponders"] });
    },
  });

  // Optimize the filtered results to prevent deep recursion
  const filteredTransponders = useMemo(() => {
    if (!searchTerm) return transponders;

    const term = searchTerm.toLowerCase();
    return transponders.filter((t: TransponderKeyData) => {
      const searchableFields = [
        t.make,
        t.model,
        t.transponderType,
        ...(t.chipType || []),
        ...(t.compatibleParts || []),
        t.notes || "",
      ].map((field) => String(field).toLowerCase());

      return searchableFields.some((field) => field.includes(term));
    });
  }, [transponders, searchTerm]);

  // Add this function to handle transponder selection
  const handleTransponderSelect = (transponder: TransponderKeyData) => {
    setSelectedTransponderDetails(transponder);
    setIsDetailsModalOpen(true);
  };

  // Update the models effect to be more efficient
  useEffect(() => {
    if (!selectedMake || !transponders?.length) {
      setAvailableModels([]);
      return;
    }

    const makeLower = selectedMake.toLowerCase();
    const models = new Set<string>();

    for (const t of transponders) {
      if (t.make.toLowerCase() === makeLower) {
        models.add(t.model);
      }
    }

    setAvailableModels(Array.from(models).sort());
  }, [selectedMake, transponders]);

  // Update the years effect to be more efficient
  useEffect(() => {
    if (!selectedMake || !selectedModel || !transponders?.length) {
      setAvailableYears([]);
      return;
    }

    const makeLower = selectedMake.toLowerCase();
    const modelLower = selectedModel.toLowerCase();
    const years = new Set<string>();
    const currentYear = new Date().getFullYear();

    for (const t of transponders) {
      if (
        t.make.toLowerCase() === makeLower &&
        t.model.toLowerCase() === modelLower &&
        typeof t.yearStart === "number" &&
        t.yearStart >= 1985 &&
        t.yearStart <= currentYear
      ) {
        years.add(t.yearStart.toString());
      }
    }

    setAvailableYears(Array.from(years).sort((a, b) => Number(b) - Number(a)));
  }, [selectedMake, selectedModel, transponders]);

  // Update sortedTransponders to use transponders instead of transponderData
  const sortedTransponders = useMemo(() => {
    return [...transponders].sort((a, b) => {
      const yearStartA = a.yearStart?.toString() || "";
      const yearStartB = b.yearStart?.toString() || "";
      return yearStartB.localeCompare(yearStartA);
    });
  }, [transponders]);

  if (loadingStatus === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Transponder Management</h1>

      <div className={styles.filtersContainer}>
        <select
          value={selectedMake}
          onChange={handleMakeChange}
          className={styles.select}
          aria-label="Select vehicle make"
        >
          <option value="">Select Make</option>
          {getUniqueMakes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={handleModelChange}
          className={styles.select}
          disabled={!selectedMake}
          aria-label="Select vehicle model"
        >
          <option value="">Select Model</option>
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={handleYearChange}
          className={styles.select}
          disabled={!selectedModel}
          aria-label="Select vehicle year"
        >
          <option value="">Select Year</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedTransponderType}
          onChange={(e) => {
            const type = e.target.value;
            setSelectedTransponderType(type);
            setSearchParams({
              ...searchParams,
              transponderType: type || undefined,
            });
          }}
          className={styles.select}
          aria-label="Select transponder type"
        >
          <option value="">Select Type</option>
          <option value="SMART">Smart Key</option>
          <option value="TRANSPONDER">Transponder Key</option>
          <option value="REMOTE">Remote Key</option>
        </select>
      </div>

      {isTranspondersLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : filteredTransponderData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransponderData.map((transponder) => (
            <div
              key={transponder.id}
              className={`${styles.detailsContainer} ${styles.cardHover}`}
              onClick={() => handleTransponderSelect(transponder)}
            >
              <h3 className={styles.detailsTitle}>
                {transponder.make} {transponder.model}
              </h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailsSection}>
                  <div>
                    <h4 className={styles.detailsLabel}>Years</h4>
                    <p className={styles.detailsValue}>
                      {transponder.yearStart} -{" "}
                      {transponder.yearEnd || "Present"}
                    </p>
                  </div>
                  <div>
                    <h4 className={styles.detailsLabel}>Transponder Type</h4>
                    <p className={styles.detailsValue}>
                      {transponder.transponderType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          No transponders found matching the selected criteria.
        </div>
      )}

      {/* Selected Transponder Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-600 text-gray-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-50">
              Transponder Details
            </DialogTitle>
          </DialogHeader>
          {selectedTransponderDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300">Make</h4>
                  <p className="text-gray-100">
                    {selectedTransponderDetails.make}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300">Model</h4>
                  <p className="text-gray-100">
                    {selectedTransponderDetails.model}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300">
                    Year Range
                  </h4>
                  <p className="text-gray-100">
                    {selectedTransponderDetails.yearStart} -{" "}
                    {selectedTransponderDetails.yearEnd || "Present"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300">
                    Transponder Type
                  </h4>
                  <p className="text-gray-100">
                    {selectedTransponderDetails.transponderType}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add TransponderCard component if it's missing
interface TransponderCardProps {
  transponder: TransponderKeyData;
  onSelect: (transponder: TransponderKeyData) => void;
}

function TransponderCard({ transponder, onSelect }: TransponderCardProps) {
  return (
    <div
      className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(transponder)}
    >
      <h3 className="text-lg font-semibold">
        {transponder.make} {transponder.model}
      </h3>
      <p className="text-sm text-gray-600">
        {transponder.yearStart} - {transponder.yearEnd || "Present"}
      </p>
      <p className="text-sm text-gray-600">{transponder.transponderType}</p>
    </div>
  );
}
