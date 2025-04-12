"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import { useDebounce } from "@/app/hooks/useDebounce";
import debounce from "lodash/debounce";
import {
  Make,
  Model,
  Year,
  Transponder,
  TransponderType,
  TransponderFilters,
} from "@/app/lib/domain/value-objects";
import { NhtsaApiRepository } from "@/app/lib/infrastructure/repositories";
import { TransponderApiRepository } from "@/app/lib/infrastructure/repositories";
import styles from "./TransponderSearch.module.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { TransponderKeyData } from "@/app/services/transponderService";
import { FccService, FccData } from "@/app/services/fccService";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "@/app/components/ui/modal";

// Create repository instances outside component to prevent recreation
const nhtsaRepository = new NhtsaApiRepository();
const transponderRepository = new TransponderApiRepository();

// Add this constant at the top of the file, after imports
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

export default function TransponderSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<TransponderKeyData[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTransponderType, setSelectedTransponderType] =
    useState<string>("");
  const [selectedTransponder, setSelectedTransponder] =
    useState<TransponderKeyData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFetchingFcc, setIsFetchingFcc] = useState(false);
  const [fccData, setFccData] = useState<FccData[] | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [transponders, setTransponders] = useState<TransponderKeyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get access to the query client for cache invalidation
  const queryClient = useQueryClient();

  const fccService = FccService.getInstance();

  // Use a ref to store the debounced search function
  const debouncedSearchRef = useRef(
    debounce((value: string) => {
    setSearchTerm(value);
      if (value.length >= 2) {
        const filtered = transponders.filter((t: TransponderKeyData) => {
          const searchValue = value.toLowerCase();
          return (
            t.make.toLowerCase().includes(searchValue) ||
            t.model.toLowerCase().includes(searchValue) ||
            t.transponderType.toLowerCase().includes(searchValue) ||
            t.chipType.some((chip) =>
              chip.toLowerCase().includes(searchValue)
            ) ||
            t.compatibleParts.some((part) =>
              part.toLowerCase().includes(searchValue)
            ) ||
            (t.notes && t.notes.toLowerCase().includes(searchValue))
          );
        });
        setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300)
  ).current;

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update the transponders query to include pagination and filtering
  const { data: transpondersData = [], isLoading: isLoadingTransponders } =
    useQuery({
      queryKey: [
        "transponders",
        selectedMake,
        selectedModel,
        selectedYear,
        selectedTransponderType,
      ],
      queryFn: async () => {
        console.log("Fetching transponders with filters:", {
          make: selectedMake,
          model: selectedModel,
          year: selectedYear,
          transponderType: selectedTransponderType,
        });

        const params = new URLSearchParams();
        if (selectedMake) params.append("make", selectedMake);
        if (selectedModel) params.append("model", selectedModel);
        if (selectedYear) params.append("year", selectedYear);
        if (selectedTransponderType)
          params.append("transponderType", selectedTransponderType);

        const url = `/api/transponders?${params.toString()}`;
        console.log("Fetching URL:", url);

        const response = await fetch(url);
        if (!response.ok) {
          const error = await response.json();
          console.error("API error:", error);
          throw new Error(error.message || "Failed to fetch transponders");
        }

        const data = await response.json();
        console.log(`Received ${data.length} transponders from API`);
        return data;
      },
      staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    });

  // Memoize filtered transponders based on search term
  const filteredTransponders = useMemo(() => {
    if (!searchTerm) return transpondersData;

    const term = searchTerm.toLowerCase();
    return transpondersData.filter((t: TransponderKeyData) => {
      const chipTypes = Array.isArray(t.chipType)
        ? t.chipType
        : typeof t.chipType === "string"
        ? t.chipType.split(",").map((c) => c.trim())
        : [];

      const compatibleParts = Array.isArray(t.compatibleParts)
        ? t.compatibleParts
        : typeof t.compatibleParts === "string"
        ? t.compatibleParts.split(",").map((p) => p.trim())
        : [];

      return (
        t.make.toLowerCase().includes(term) ||
        t.model.toLowerCase().includes(term) ||
        t.transponderType.toLowerCase().includes(term) ||
        chipTypes.some((chip) => chip.toLowerCase().includes(term)) ||
        compatibleParts.some((part) => part.toLowerCase().includes(term)) ||
        (t.notes && t.notes.toLowerCase().includes(term))
      );
    });
  }, [transpondersData, searchTerm]);

  // Add the displayedTransponders useMemo here BEFORE any conditional returns
  const displayedTransponders = useMemo(() => {
    // If there's a search term, use filteredTransponders
    if (searchTerm) {
      return filteredTransponders;
    }

    // If selections have been made, use the transpondersData from the query
    // which already has the filters applied from the API
    if (
      selectedMake ||
      selectedModel ||
      selectedYear ||
      selectedTransponderType
    ) {
      return transpondersData;
    }

    // Otherwise use the initial data
    return transponders.length > 0 ? transponders : transpondersData;
  }, [
    filteredTransponders,
    transpondersData,
    transponders,
    searchTerm,
      selectedMake,
      selectedModel,
      selectedYear,
      selectedTransponderType,
  ]);

  // Memoize available makes from actual transponder data
  const availableMakes = useMemo(() => {
    // Use COMMON_US_MAKES instead of filtering from transponders
    return COMMON_US_MAKES.sort((a, b) => a.localeCompare(b));
  }, []);

  // Memoize available models for the selected make
  const availableModels = useMemo(() => {
    if (!selectedMake) return [];
    return Array.from(
      new Set(
        transpondersData
          .filter(
            (t: TransponderKeyData) =>
              t.make.toLowerCase() === selectedMake.toLowerCase()
          )
          .map((t) => t.model)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [transpondersData, selectedMake]);

  // Memoize available years for the selected make and model
  const availableYears = useMemo(() => {
    if (!selectedMake || !selectedModel) return [];
    return Array.from(
      new Set(
        transpondersData
          .filter(
            (t: TransponderKeyData) =>
              t.make.toLowerCase() === selectedMake.toLowerCase() &&
              t.model.toLowerCase() === selectedModel.toLowerCase()
          )
          .map((t) => t.yearStart)
      )
    ).sort((a, b) => b - a);
  }, [transpondersData, selectedMake, selectedModel]);

  // Memoize available transponder types
  const availableTypes = useMemo(() => {
    return Array.from(
      new Set(
        transpondersData
          .filter((t: TransponderKeyData) => {
            if (
              selectedMake &&
              t.make.toLowerCase() !== selectedMake.toLowerCase()
            )
              return false;
            if (
              selectedModel &&
              t.model.toLowerCase() !== selectedModel.toLowerCase()
            )
              return false;
            if (selectedYear && t.yearStart !== parseInt(selectedYear))
              return false;
            return true;
          })
          .map((t) => t.transponderType)
      )
    ).sort();
  }, [transpondersData, selectedMake, selectedModel, selectedYear]);

  const resetFilters = useCallback(() => {
    console.log("Resetting all filters");
    setSelectedMake("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedTransponderType("");
    setSearchTerm("");

    // Invalidate the entire transponders cache
    queryClient.invalidateQueries({ queryKey: ["transponders"] });
  }, [queryClient]);

  const fetchFccData = async (transponder: TransponderKeyData) => {
    setIsFetchingFcc(true);
    try {
      const { make, model, yearStart } = transponder;

      if (!make || !model || !yearStart) {
        console.error("Missing data for FCC lookup", {
          make,
          model,
          yearStart,
        });
        return;
      }

      // First check if we already have an FCC ID in the transponder data
      // This would be from our scraped and processed data
      if (transponder.fccId) {
        console.log(
          `Using existing FCC ID from database: ${transponder.fccId}`
        );

        // Handle chipType properly based on its type
        let chipTypeArray: string[] = [];
        if (Array.isArray(transponder.chipType)) {
          chipTypeArray = transponder.chipType;
        } else if (typeof transponder.chipType === "string") {
          chipTypeArray = transponder.chipType
            .split(",")
            .map((c: string) => c.trim());
        }

        // Handle compatibleParts properly based on its type
        let compatiblePartsArray: string[] = [];
        if (Array.isArray(transponder.compatibleParts)) {
          compatiblePartsArray = transponder.compatibleParts;
        } else if (typeof transponder.compatibleParts === "string") {
          compatiblePartsArray = transponder.compatibleParts
            .split(",")
            .map((p: string) => p.trim());
        }

        setFccData([
          {
            fccId: transponder.fccId,
            make: transponder.make,
            model: transponder.model,
            year: transponder.yearStart || 0,
            chipType: chipTypeArray,
            transponderType: transponder.transponderType,
            compatibleParts: compatiblePartsArray,
            frequency: transponder.frequency || "",
            notes: transponder.notes || "",
            source: "Database",
          },
        ]);
        return;
      }

      // If no FCC ID in database, fetch from external sources
      const data = await fccService.getFccData(make, model, yearStart);
      console.log("FCC data results from external sources:", data);
      setFccData(data);
    } catch (error) {
      console.error("Error fetching FCC data:", error);
    } finally {
      setIsFetchingFcc(false);
    }
  };

  const handleTransponderSelect = async (transponder: TransponderKeyData) => {
    setSelectedTransponder(transponder);
    setIsDetailsModalOpen(true);
    await fetchFccData(transponder);
  };

  useEffect(() => {
    // Fetch transponders on component mount for initial data
    const fetchTransponders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/transponders");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setTransponders(data);
        console.log("Fetched transponders:", data.length);
      } catch (error) {
        console.error("Failed to fetch transponders:", error);
        setError("Failed to load transponders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransponders();
  }, []);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMake = e.target.value;
    console.log(`Make selection changed to: "${newMake}"`);

    // Reset dependent dropdowns
    setSelectedMake(newMake);
    setSelectedModel("");
    setSelectedYear("");
    setSelectedTransponderType("");

    // Clear search term to ensure filtering only happens by dropdown selection
    setSearchTerm("");

    // Invalidate the entire transponders cache to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ["transponders"] });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    console.log(`Model selection changed to: "${newModel}"`);

    // Reset dependent dropdowns
    setSelectedModel(newModel);
    setSelectedYear("");
    setSelectedTransponderType("");

    // Clear search term to ensure filtering only happens by dropdown selection
    setSearchTerm("");

    // Invalidate the transponders cache for this make
    queryClient.invalidateQueries({
      queryKey: ["transponders", selectedMake],
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    console.log(`Year selection changed to: "${newYear}"`);

    // Reset dependent dropdown
    setSelectedYear(newYear);
    setSelectedTransponderType("");

    // Clear search term to ensure filtering only happens by dropdown selection
    setSearchTerm("");

    // Invalidate the transponders cache for this make and model
    queryClient.invalidateQueries({
      queryKey: ["transponders", selectedMake, selectedModel],
    });
  };

  const handleTransponderTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newType = e.target.value;
    console.log(`Transponder type selection changed to: "${newType}"`);

    setSelectedTransponderType(newType);

    // Clear search term to ensure filtering only happens by dropdown selection
    setSearchTerm("");

    // Invalidate the transponders cache for this make, model, and year
    queryClient.invalidateQueries({
      queryKey: ["transponders", selectedMake, selectedModel, selectedYear],
    });
  };

  // Display filtering states during loading
  const LoadingDropdowns = () => (
    <div className={styles.filtersGrid}>
      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Make</label>
        <div className={`${styles.filterSelect} ${styles.loadingSelect}`}>
          <LoadingSpinner size="sm" />
        </div>
      </div>
      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Model</label>
        <div className={`${styles.filterSelect} ${styles.loadingSelect}`}>
          <LoadingSpinner size="sm" />
        </div>
      </div>
      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Year</label>
        <div className={`${styles.filterSelect} ${styles.loadingSelect}`}>
          <LoadingSpinner size="sm" />
        </div>
      </div>
      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Transponder Type</label>
        <div className={`${styles.filterSelect} ${styles.loadingSelect}`}>
          <LoadingSpinner size="sm" />
        </div>
      </div>
    </div>
  );

  // Render the filter dropdowns section
  const renderFilterDropdowns = () => (
    <div className={styles.filtersGrid}>
      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Make</label>
          <select
          value={selectedMake}
            onChange={handleMakeChange}
          className={styles.filterSelect}
            aria-label="Select vehicle make"
          disabled={isLoadingTransponders}
        >
          <option value="">All Makes</option>
          {availableMakes.map((make) => (
            <option key={make} value={make}>
              {make}
              </option>
            ))}
          </select>
        </div>

      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Model</label>
          <select
          value={selectedModel}
            onChange={handleModelChange}
          className={styles.filterSelect}
          disabled={!selectedMake || isLoadingTransponders}
            aria-label="Select vehicle model"
        >
          <option value="">All Models</option>
          {availableModels.length > 0 ? (
            availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))
          ) : (
            <option value="" disabled>
              {selectedMake ? "No models available" : "Select a make first"}
            </option>
          )}
        </select>
        </div>

      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Year</label>
          <select
          value={selectedYear}
            onChange={handleYearChange}
          className={styles.filterSelect}
          disabled={!selectedMake || !selectedModel || isLoadingTransponders}
            aria-label="Select vehicle year"
        >
          <option value="">All Years</option>
          {availableYears.length > 0 ? (
            availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))
          ) : (
            <option value="" disabled>
              {selectedModel ? "No years available" : "Select a model first"}
            </option>
          )}
        </select>
        </div>

      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Transponder Type</label>
          <select
          value={selectedTransponderType}
          onChange={handleTransponderTypeChange}
          className={styles.filterSelect}
          disabled={!selectedMake || !selectedModel || isLoadingTransponders}
            aria-label="Select transponder type"
        >
          <option value="">All Types</option>
          {availableTypes.length > 0 ? (
            availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))
          ) : (
            <option value="" disabled>
              {selectedModel
                ? "No types available"
                : "Select make and model first"}
            </option>
          )}
        </select>
      </div>
    </div>
  );

  // Show loading spinner while initial data is loading
  if (isLoadingTransponders && !transpondersData.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-8">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700 dark:text-gray-300">
          Loading transponder data...
        </p>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle case where no transponders are available
  if (
    (!transpondersData || transpondersData.length === 0) &&
    (!transponders || transponders.length === 0)
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400 text-center">
          <p>No transponder data available.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Use the fetched transponders if React Query hasn't loaded yet
  const makes =
    availableMakes.length > 0
      ? availableMakes
      : Array.from(new Set(transponders.map((t) => t.make))).sort();

  // Get models based on the selected make
  const models = selectedMake
    ? availableModels.length > 0
      ? availableModels
      : Array.from(
          new Set(
            transponders
              .filter(
                (t) => t.make.toLowerCase() === selectedMake.toLowerCase()
              )
              .map((t) => t.model)
          )
        ).sort()
    : [];

  // Get years based on the selected make and model
  const years =
    selectedMake && selectedModel
      ? availableYears.length > 0
        ? availableYears
        : Array.from(
            new Set(
              transponders
                .filter(
                  (t) =>
                    t.make.toLowerCase() === selectedMake.toLowerCase() &&
                    t.model.toLowerCase() === selectedModel.toLowerCase() &&
                    t.yearStart !== null
                )
                .map((t) => t.yearStart as number)
            )
          ).sort((a, b) => b - a)
      : [];

  // Get types based on the selected criteria
  const types =
    selectedMake && selectedModel
      ? availableTypes.length > 0
        ? availableTypes
        : Array.from(
            new Set(
              transponders
                .filter((t) => {
                  if (selectedYear) {
                    return (
                      t.make.toLowerCase() === selectedMake.toLowerCase() &&
                      t.model.toLowerCase() === selectedModel.toLowerCase() &&
                      t.yearStart === parseInt(selectedYear)
                    );
                  }
                  return (
                    t.make.toLowerCase() === selectedMake.toLowerCase() &&
                    t.model.toLowerCase() === selectedModel.toLowerCase()
                  );
                })
                .map((t) => t.transponderType)
            )
          ).sort()
      : [];

  // Update details modal to handle the FCC data array
  const renderDetailsModal = () => {
    if (!selectedTransponder) return null;

    // Get the first FCC data item if available
    const fccDataItem = fccData && fccData.length > 0 ? fccData[0] : null;

    return (
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`${selectedTransponder.make} ${selectedTransponder.model} Details`}
      >
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row w-full gap-4">
            <div className="w-full md:w-1/2">
              <div className="mb-4">
                <strong>Make:</strong> {selectedTransponder?.make}
              </div>
              <div className="mb-4">
                <strong>Model:</strong> {selectedTransponder?.model}
              </div>
              <div className="mb-4">
                <strong>Year:</strong>{" "}
                {selectedTransponder?.yearStart
                  ? `${selectedTransponder.yearStart}${
                      selectedTransponder.yearEnd
                        ? ` - ${selectedTransponder.yearEnd}`
                        : ""
                    }`
                  : "N/A"}
              </div>
              <div className="mb-4">
                <strong>Type:</strong>{" "}
                {selectedTransponder?.transponderType || "N/A"}
              </div>
              <div className="mb-4">
                <strong>FCC ID:</strong>{" "}
                {selectedTransponder?.fccId || "Not available"}
              </div>
              <div className="mb-4">
                <strong>Chip Type:</strong>{" "}
                {Array.isArray(selectedTransponder?.chipType) &&
                selectedTransponder.chipType.length > 0
                  ? selectedTransponder.chipType.join(", ")
                  : typeof selectedTransponder?.chipType === "string"
                  ? selectedTransponder.chipType
                  : "N/A"}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Make:
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedTransponder.make}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Model:
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedTransponder.model}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Year Range:
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedTransponder.yearStart}
                  {selectedTransponder.yearEnd
                    ? ` - ${selectedTransponder.yearEnd}`
                    : " - Present"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Transponder Type:
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedTransponder.transponderType}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Chip Types:
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {Array.isArray(selectedTransponder.chipType)
                    ? selectedTransponder.chipType.join(", ")
                    : selectedTransponder.chipType || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Frequency:
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedTransponder.frequency || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  FCC ID:
                </h3>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedTransponder.fccId || "N/A"}
                  </p>
                  {selectedTransponder.fccId && (
                    <a
                      href={`https://fccid.io/${selectedTransponder.fccId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      (View FCC Data)
                    </a>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Compatible Parts:
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {Array.isArray(selectedTransponder.compatibleParts)
                    ? selectedTransponder.compatibleParts.join(", ")
                    : selectedTransponder.compatibleParts || "N/A"}
                </p>
              </div>
              {selectedTransponder.notes && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                    Notes:
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedTransponder.notes}
                  </p>
                </div>
              )}

              {/* Display additional FCC data if available */}
              {isFetchingFcc && (
                <div className="flex items-center justify-center mt-4">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-gray-600 dark:text-gray-300">
                    Fetching additional data...
                  </span>
                </div>
              )}

              {fccDataItem && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                    Additional Data from {fccDataItem.source}:
                  </h3>
                  <ul className="mt-2 space-y-1 text-gray-900 dark:text-gray-100">
                    {fccDataItem.frequency && (
                      <li>
                        <span className="font-semibold">Frequency:</span>{" "}
                        {fccDataItem.frequency}
                      </li>
                    )}
                    {fccDataItem.chipType &&
                      fccDataItem.chipType.length > 0 && (
                        <li>
                          <span className="font-semibold">Chip Types:</span>{" "}
                          {fccDataItem.chipType.join(", ")}
                        </li>
                      )}
                    {fccDataItem.compatibleParts &&
                      fccDataItem.compatibleParts.length > 0 && (
                        <li>
                          <span className="font-semibold">
                            Compatible Parts:
                          </span>{" "}
                          {fccDataItem.compatibleParts.join(", ")}
                        </li>
                      )}
                    {fccDataItem.price && (
                      <li>
                        <span className="font-semibold">Price:</span> $
                        {fccDataItem.price.toFixed(2)}
                      </li>
                    )}
                    {fccDataItem.notes && (
                      <li>
                        <span className="font-semibold">Notes:</span>{" "}
                        {fccDataItem.notes}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {fccData && fccData.length === 0 && !isFetchingFcc && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                  <p className="text-yellow-700 dark:text-yellow-300">
                    No additional data found from external sources.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper} ref={searchInputRef}>
            <input
              type="text"
              placeholder="Search transponders..."
              onChange={(e) => debouncedSearchRef(e.target.value)}
              className={styles.searchInput}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
              disabled={isLoadingTransponders}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestionsContainer}>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={styles.suggestionItem}
                    onClick={() => {
                      setSearchTerm(`${suggestion.make} ${suggestion.model}`);
                      setShowSuggestions(false);
                      setSuggestions([]);
                      handleTransponderSelect(suggestion);
                    }}
                  >
                    <div className={styles.suggestionTitle}>
                      {suggestion.make} {suggestion.model}
                    </div>
                    <div className={styles.suggestionSubtitle}>
                      {suggestion.yearStart} - {suggestion.yearEnd || "Present"}{" "}
                      • {suggestion.transponderType}
                    </div>
              </div>
            ))}
              </div>
            )}
          </div>
          <button
            onClick={resetFilters}
            className={styles.resetButton}
            disabled={isLoadingTransponders}
          >
            Reset Filters
          </button>
        </div>

        {isLoadingTransponders && transpondersData.length ? (
          <LoadingDropdowns />
        ) : (
          renderFilterDropdowns()
        )}
      </div>

      <div className={styles.resultsSection}>
        {isLoadingTransponders ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading transponders...
            </p>
          </div>
        ) : (
          <div className={styles.resultsGrid}>
            {displayedTransponders.length > 0 ? (
              displayedTransponders.map((transponder: TransponderKeyData) => (
                <div
                  key={transponder.id}
                  className={styles.resultCard}
                  onClick={() => handleTransponderSelect(transponder)}
                  style={{ cursor: "pointer" }}
                >
                  <h3 className={styles.resultTitle}>
                    {transponder.make} {transponder.model}
                  </h3>
                  <div className={styles.resultInfo}>
                    <p>
                      <span className={styles.resultLabel}>Year:</span>{" "}
                      {transponder.yearStart} -{" "}
                      {transponder.yearEnd || "Present"}
                    </p>
                    <p>
                      <span className={styles.resultLabel}>Type:</span>{" "}
                      {transponder.transponderType}
                    </p>
                    {transponder.frequency && (
                      <p>
                        <span className={styles.resultLabel}>Frequency:</span>{" "}
                        {transponder.frequency}
                      </p>
                    )}
                    {transponder.fccId && (
                      <p>
                        <span className={styles.resultLabel}>FCC ID:</span>{" "}
                        <a
                          href={`https://fccid.io/${transponder.fccId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fccLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {transponder.fccId}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <p>No transponders found matching your criteria.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {renderDetailsModal()}
    </div>
  );
}
