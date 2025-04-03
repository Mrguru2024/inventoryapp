"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import TransponderIdentifier from "./TransponderIdentifier";
import TransponderInventoryManager from "./TransponderInventoryManager";
import ProgrammingGuideGenerator from "./ProgrammingGuideGenerator";
import {
  TransponderKeyData,
  TransponderSearchParams,
} from "@/app/services/transponderService";
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

export default function TransponderManagement() {
  const { data: session, status: sessionStatus } = useSession();
  const [transponderData, setTransponderData] = useState<TransponderKeyData[]>(
    []
  );
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

  const queryClient = useQueryClient();

  // Memoize the loadData function to prevent recreation on every render
  const loadData = useCallback(async () => {
    if (!session?.accessToken) {
      setLoadingStatus("error");
      setError("No authentication token available");
      return;
    }

    try {
      setLoadingStatus("loading");
      const [transpondersResponse, inventoryResponse] = await Promise.all([
        fetch("/api/transponders", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }),
        fetch("/api/inventory", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }),
      ]);

      if (!transpondersResponse.ok || !inventoryResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [transpondersData, inventoryData] = await Promise.all([
        transpondersResponse.json(),
        inventoryResponse.json(),
      ]);

      if (
        !Array.isArray(transpondersData.transponders) ||
        !Array.isArray(inventoryData.inventory)
      ) {
        throw new Error("Invalid data format received");
      }

      // Batch state updates to prevent multiple re-renders
      setTransponderData(transpondersData.transponders);
      setInventoryLevels(inventoryData.inventory);
      setLoadingStatus("success");
    } catch (error) {
      console.error("Error loading data:", error);
      setLoadingStatus("error");
      setError(error instanceof Error ? error.message : "Failed to load data");
    }
  }, [session?.accessToken]);

  // Use a ref to track the initial load
  const initialLoadRef = useRef(false);

  // Load data only once when component mounts or session changes
  useEffect(() => {
    if (session?.accessToken && !initialLoadRef.current) {
      initialLoadRef.current = true;
      loadData();
    }
  }, [session?.accessToken, loadData]);

  // Filter transponder data based on search params
  const filteredTransponderData = useMemo(() => {
    return transponderData.filter((t) => {
      if (
        searchParams.make &&
        t.make.toLowerCase() !== searchParams.make.toLowerCase()
      )
        return false;
      if (
        searchParams.model &&
        t.model.toLowerCase() !== searchParams.model.toLowerCase()
      )
        return false;
      if (searchParams.year) {
        const yearNum = parseInt(searchParams.year);
        if ("yearStart" in t && typeof t.yearStart === "number") {
          if (t.yearStart > yearNum) return false;
          if (
            "yearEnd" in t &&
            typeof t.yearEnd === "number" &&
            t.yearEnd < yearNum
          )
            return false;
        }
      }
      return true;
    });
  }, [transponderData, searchParams]);

  // Update the getUniqueMakes function to use COMMON_US_MAKES directly
  const getUniqueMakes = useMemo(() => {
    return COMMON_US_MAKES.sort();
  }, []);

  // Update the getModelsForMake function to filter for common models
  const getModelsForMake = useCallback(
    (make: string) => {
      if (!make) return [];
      const models = Array.from(
        new Set(
          transponderData
            .filter((t) => t.make.toLowerCase() === make.toLowerCase())
            .map((t) => t.model)
        )
      );
      return models.sort();
    },
    [transponderData]
  );

  // Update the getYearsForMakeAndModel function to include years 1985-2025
  const getYearsForMakeAndModel = useCallback(
    (make: string, model: string) => {
      if (!make || !model) return [];
      const years = Array.from(
        new Set(
          transponderData
            .filter(
              (t) =>
                t.make.toLowerCase() === make.toLowerCase() &&
                t.model.toLowerCase() === model.toLowerCase()
            )
            .map((t) => t.yearStart)
        )
      ).filter((year) => year >= 1985 && year <= 2025); // Focus on vehicles from 1985 to 2025
      return years.sort((a, b) => b - a); // Sort in descending order
    },
    [transponderData]
  );

  const handleSearch = useCallback((params: TransponderSearchParams) => {
    // Convert year to string if it's a number
    const searchParams = {
      ...params,
      year: params.year ? params.year.toString() : undefined,
    };
    setSearchParams(searchParams);
    // Clear selected transponder when filters change
    setSelectedTransponder(null);
  }, []);

  const handleUpdateStock = async (id: string, quantity: number) => {
    if (!session?.accessToken) return;

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      await loadData(); // Refresh data
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
  };

  const handleOrderStock = async (item: TransponderInventoryItem) => {
    if (!session?.accessToken) return;

    try {
      const response = await fetch(`/api/inventory/${item.id}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      await loadData(); // Refresh data
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
  };

  // Memoize filters to prevent unnecessary re-renders
  const filters = useMemo(() => {
    const filter: any = {};
    if (selectedMake) filter.make = selectedMake;
    if (selectedModel) filter.model = selectedModel;
    if (selectedYear) filter.year = selectedYear;
    if (selectedTransponderType)
      filter.transponderType = selectedTransponderType;
    if (searchTerm) filter.searchTerm = searchTerm;
    return filter;
  }, [
    selectedMake,
    selectedModel,
    selectedYear,
    selectedTransponderType,
    searchTerm,
  ]);

  // Update the debouncedSearch function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setSearchParams((prev) => ({ ...prev, search: value }));
    }, 300),
    []
  );

  // Fetch transponders with optimized query
  const { data: transponders = [], isLoading: queryLoading } = useQuery({
    queryKey: ["transponders", filters],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("Not authenticated");

      const response = await fetch("/api/transponders/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(filters),
      });
      if (!response.ok) throw new Error("Failed to fetch transponders");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    keepPreviousData: true, // Keep showing previous results while loading
    enabled: !!session?.accessToken, // Only run query when we have a token
  });

  // Delete transponder mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) throw new Error("Not authenticated");

      const response = await fetch(`/api/transponders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete transponder");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transponders"] });
    },
  });

  // Memoize filtered results
  const filteredTransponders = useMemo(() => {
    return transponders.filter((t: TransponderKeyData) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        t.make.toLowerCase().includes(term) ||
        t.model.toLowerCase().includes(term) ||
        t.transponderType.toLowerCase().includes(term) ||
        t.chipType.some((chip) => chip.toLowerCase().includes(term)) ||
        t.compatibleParts.some((part) => part.toLowerCase().includes(term)) ||
        (t.notes && t.notes.toLowerCase().includes(term))
      );
    });
  }, [transponders, searchTerm]);

  // Add this function to handle transponder selection
  const handleTransponderSelect = (transponder: TransponderKeyData) => {
    setSelectedTransponderDetails(transponder);
    setIsDetailsModalOpen(true);
  };

  if (loadingStatus === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {loadingStatus === "loading" ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Search and Filters Section */}
          <div className={`${styles.searchSection} ${styles.cardHover}`}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInput}>
                <input
                  type="text"
                  placeholder="Search transponders..."
                  value={searchTerm}
                  onChange={(e) => debouncedSearch(e.target.value)}
                  aria-label="Search transponders"
                  className={styles.interactiveElement}
                />
              </div>
              <button
                onClick={() => {
                  setSelectedMake("");
                  setSelectedModel("");
                  setSelectedYear("");
                  setSelectedTransponderType("");
                  setSearchTerm("");
                }}
                className={`${styles.resetButton} ${styles.interactiveElement}`}
              >
                Reset Filters
              </button>
            </div>

            <div className={styles.filtersGrid}>
              {/* Make Select */}
              <div className={styles.filterContainer}>
                <label htmlFor="make-select" className={styles.filterLabel}>
                  Make
                </label>
                <select
                  id="make-select"
                  className={`${styles.filterSelect} ${styles.interactiveElement}`}
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    setSelectedModel("");
                  }}
                  aria-label="Select vehicle make"
                >
                  <option value="">All Makes</option>
                  {getUniqueMakes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Select */}
              <div className={styles.filterContainer}>
                <label htmlFor="model-select" className={styles.filterLabel}>
                  Model
                </label>
                <select
                  id="model-select"
                  className={`${styles.filterSelect} ${styles.filterSelectDisabled} ${styles.interactiveElement}`}
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedMake}
                  aria-label="Select vehicle model"
                >
                  <option value="">All Models</option>
                  {getModelsForMake(selectedMake).map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Select */}
              <div className={styles.filterContainer}>
                <label htmlFor="year-select" className={styles.filterLabel}>
                  Year
                </label>
                <select
                  id="year-select"
                  className={`${styles.filterSelect} ${styles.interactiveElement}`}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Select vehicle year"
                >
                  <option value="">All Years</option>
                  {getYearsForMakeAndModel(selectedMake, selectedModel)
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </div>

              {/* Transponder Type Select */}
              <div className={styles.filterContainer}>
                <label htmlFor="type-select" className={styles.filterLabel}>
                  Transponder Type
                </label>
                <select
                  id="type-select"
                  className={`${styles.filterSelect} ${styles.interactiveElement}`}
                  value={selectedTransponderType}
                  onChange={(e) => setSelectedTransponderType(e.target.value)}
                  aria-label="Select transponder type"
                >
                  <option value="">All Types</option>
                  {Array.from(
                    new Set(
                      transponderData
                        .filter((t: TransponderKeyData) => {
                          if (
                            selectedMake &&
                            t.make.toLowerCase() !== selectedMake.toLowerCase()
                          )
                            return false;
                          if (
                            selectedModel &&
                            t.model.toLowerCase() !==
                              selectedModel.toLowerCase()
                          )
                            return false;
                          if (
                            selectedYear &&
                            t.yearStart !== parseInt(selectedYear)
                          )
                            return false;
                          return true;
                        })
                        .map((t) => t.transponderType)
                    )
                  ).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Make</th>
                  <th className={styles.tableHeaderCell}>Model</th>
                  <th className={styles.tableHeaderCell}>Year Range</th>
                  <th className={styles.tableHeaderCell}>Type</th>
                  <th className={styles.tableHeaderCell}>Chip Types</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {queryLoading ? (
                  <tr>
                    <td colSpan={6} className={styles.tableCell}>
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : filteredTransponders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.tableCell}>
                      No transponders found
                    </td>
                  </tr>
                ) : (
                  filteredTransponders.map(
                    (transponder: TransponderKeyData) => (
                      <tr
                        key={transponder.id}
                        className={`${styles.tableRow} ${styles.rowHover}`}
                        onClick={() => handleTransponderSelect(transponder)}
                        style={{ cursor: "pointer" }}
                      >
                        <td
                          className={`${styles.tableCell} ${styles.tableCellBold}`}
                        >
                          {transponder.make}
                        </td>
                        <td className={styles.tableCell}>
                          {transponder.model}
                        </td>
                        <td className={styles.tableCell}>
                          {transponder.yearStart} -{" "}
                          {transponder.yearEnd || "Present"}
                        </td>
                        <td className={styles.tableCell}>
                          {transponder.transponderType}
                        </td>
                        <td className={styles.tableCell}>
                          {Array.isArray(transponder.chipType)
                            ? transponder.chipType.join(", ")
                            : transponder.chipType}
                        </td>
                        <td className={styles.tableCell}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransponder(transponder);
                            }}
                            className={`${styles.actionButton} ${styles.interactiveElement}`}
                            title="Edit transponder"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(transponder.id);
                            }}
                            className={`${styles.deleteButton} ${styles.interactiveElement}`}
                            title="Delete transponder"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Selected Transponder Details */}
          {selectedTransponder && (
            <div className={styles.detailsContainer}>
              <div className={`${styles.detailsCard} ${styles.cardHover}`}>
                <h3 className={styles.detailsTitle}>
                  {selectedTransponder.make} {selectedTransponder.model}
                </h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailsSection}>
                    <div>
                      <h4 className={styles.detailsLabel}>Years</h4>
                      <p className={styles.detailsValue}>
                        {selectedTransponder.yearStart} -{" "}
                        {selectedTransponder.yearEnd || "Present"}
                      </p>
                    </div>
                    <div>
                      <h4 className={styles.detailsLabel}>Transponder Type</h4>
                      <p className={styles.detailsValue}>
                        {selectedTransponder.transponderType}
                      </p>
                    </div>
                    <div>
                      <h4 className={styles.detailsLabel}>Chip Types</h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {Array.isArray(selectedTransponder.chipType)
                          ? selectedTransponder.chipType.map((chip, index) => (
                              <span key={index} className={styles.chipTag}>
                                {chip}
                              </span>
                            ))
                          : selectedTransponder.chipType}
                      </div>
                    </div>
                  </div>
                  <div className={styles.detailsSection}>
                    {selectedTransponder.frequency && (
                      <div>
                        <h4 className={styles.detailsLabel}>Frequency</h4>
                        <p className={styles.detailsValue}>
                          {selectedTransponder.frequency}
                        </p>
                      </div>
                    )}
                    {selectedTransponder.compatibleParts && (
                      <div>
                        <h4 className={styles.detailsLabel}>
                          Compatible Parts
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {Array.isArray(selectedTransponder.compatibleParts)
                            ? selectedTransponder.compatibleParts.map(
                                (part, index) => (
                                  <span key={index} className={styles.partTag}>
                                    {part}
                                  </span>
                                )
                              )
                            : selectedTransponder.compatibleParts}
                        </div>
                      </div>
                    )}
                    {selectedTransponder.notes && (
                      <div>
                        <h4 className={styles.detailsLabel}>Notes</h4>
                        <p className={styles.detailsValue}>
                          {selectedTransponder.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Programming Guide */}
              <ProgrammingGuideGenerator transponder={selectedTransponder} />

              {/* Inventory Management */}
              <TransponderInventoryManager
                inventory={inventoryLevels.filter(
                  (item) =>
                    item.transponderKey.id.toString() === selectedTransponder.id
                )}
                onUpdateStock={handleUpdateStock}
                onOrderStock={handleOrderStock}
              />
            </div>
          )}

          {/* Add the details modal */}
          <Dialog
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transponder Details</DialogTitle>
              </DialogHeader>
              {selectedTransponderDetails && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Make</h4>
                      <p>{selectedTransponderDetails.make}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Model</h4>
                      <p>{selectedTransponderDetails.model}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Year Range</h4>
                      <p>
                        {selectedTransponderDetails.yearStart} -{" "}
                        {selectedTransponderDetails.yearEnd || "Present"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">
                        Transponder Type
                      </h4>
                      <p>{selectedTransponderDetails.transponderType}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Chip Types</h4>
                      <p>
                        {Array.isArray(selectedTransponderDetails.chipType)
                          ? selectedTransponderDetails.chipType.join(", ")
                          : selectedTransponderDetails.chipType}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Frequency</h4>
                      <p>{selectedTransponderDetails.frequency || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">
                        Compatible Parts
                      </h4>
                      <p>
                        {Array.isArray(
                          selectedTransponderDetails.compatibleParts
                        )
                          ? selectedTransponderDetails.compatibleParts.join(
                              ", "
                            )
                          : selectedTransponderDetails.compatibleParts || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Dual System</h4>
                      <p>
                        {selectedTransponderDetails.dualSystem ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  {selectedTransponderDetails.notes && (
                    <div>
                      <h4 className="font-medium text-gray-700">Notes</h4>
                      <p>{selectedTransponderDetails.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
