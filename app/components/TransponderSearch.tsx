"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTransponderType, setSelectedTransponderType] =
    useState<string>("");
  const [selectedTransponderDetails, setSelectedTransponderDetails] =
    useState<TransponderKeyData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Use a ref to store the debounced search function
  const debouncedSearchRef = useRef(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300)
  ).current;

  // Update the transponders query to include pagination and filtering
  const { data: transponders = [], isLoading: isLoadingTransponders } =
    useQuery({
      queryKey: ["transponders"],
      queryFn: async () => {
        const response = await fetch("/api/transponders");
        if (!response.ok) throw new Error("Failed to fetch transponders");
        return response.json();
      },
      staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    });

  // Memoize filtered transponders
  const filteredTransponders = useMemo(() => {
    return transponders.filter((t: TransponderKeyData) => {
      if (selectedMake && t.make.toUpperCase() !== selectedMake.toUpperCase())
        return false;
      if (
        selectedModel &&
        t.model.toUpperCase() !== selectedModel.toUpperCase()
      )
        return false;
      if (selectedYear && t.yearStart !== parseInt(selectedYear)) return false;
      if (
        selectedTransponderType &&
        t.transponderType !== selectedTransponderType
      )
        return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          t.make.toLowerCase().includes(term) ||
          t.model.toLowerCase().includes(term) ||
          t.transponderType.toLowerCase().includes(term) ||
          t.chipType.some((chip) => chip.toLowerCase().includes(term)) ||
          t.compatibleParts.some((part) => part.toLowerCase().includes(term)) ||
          (t.notes && t.notes.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [
    transponders,
    selectedMake,
    selectedModel,
    selectedYear,
    selectedTransponderType,
    searchTerm,
  ]);

  // Memoize available makes from actual transponder data
  const availableMakes = useMemo(() => {
    const makes = Array.from(
      new Set(transponders.map((t: TransponderKeyData) => t.make))
    );
    return makes.sort((a, b) => a.localeCompare(b));
  }, [transponders]);

  // Memoize available models for the selected make
  const availableModels = useMemo(() => {
    if (!selectedMake) return [];
    return Array.from(
      new Set(
        transponders
          .filter(
            (t: TransponderKeyData) =>
              t.make.toUpperCase() === selectedMake.toUpperCase()
          )
          .map((t) => t.model)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [transponders, selectedMake]);

  // Memoize available years for the selected make and model
  const availableYears = useMemo(() => {
    if (!selectedMake || !selectedModel) return [];
    return Array.from(
      new Set(
        transponders
          .filter(
            (t: TransponderKeyData) =>
              t.make.toUpperCase() === selectedMake.toUpperCase() &&
              t.model.toUpperCase() === selectedModel.toUpperCase()
          )
          .map((t) => t.yearStart)
      )
    ).sort((a, b) => b - a);
  }, [transponders, selectedMake, selectedModel]);

  // Memoize available transponder types
  const availableTypes = useMemo(() => {
    return Array.from(
      new Set(
        transponders
          .filter((t: TransponderKeyData) => {
            if (selectedMake && t.make !== selectedMake) return false;
            if (selectedModel && t.model !== selectedModel) return false;
            if (selectedYear && t.yearStart !== parseInt(selectedYear))
              return false;
            return true;
          })
          .map((t) => t.transponderType)
      )
    ).sort();
  }, [transponders, selectedMake, selectedModel, selectedYear]);

  const resetFilters = useCallback(() => {
    setSelectedMake("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedTransponderType("");
    setSearchTerm("");
  }, []);

  const handleTransponderSelect = (transponder: TransponderKeyData) => {
    setSelectedTransponderDetails(transponder);
    setIsDetailsModalOpen(true);
  };

  // Show loading spinner while initial data is loading
  if (isLoadingTransponders) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Search transponders..."
              onChange={(e) => debouncedSearchRef(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button onClick={resetFilters} className={styles.resetButton}>
            Reset Filters
          </button>
        </div>

        <div className={styles.filtersGrid}>
          <div className={styles.filterContainer}>
            <label className={styles.filterLabel}>Make</label>
            <select
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel("");
                setSelectedYear("");
              }}
              className={styles.filterSelect}
              aria-label="Select vehicle make"
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
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedYear("");
              }}
              className={styles.filterSelect}
              disabled={!selectedMake}
              aria-label="Select vehicle model"
            >
              <option value="">All Models</option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterContainer}>
            <label className={styles.filterLabel}>Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={styles.filterSelect}
              disabled={!selectedModel}
              aria-label="Select vehicle year"
            >
              <option value="">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterContainer}>
            <label className={styles.filterLabel}>Transponder Type</label>
            <select
              value={selectedTransponderType}
              onChange={(e) => setSelectedTransponderType(e.target.value)}
              className={styles.filterSelect}
              aria-label="Select transponder type"
            >
              <option value="">All Types</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.resultsSection}>
        {isLoadingTransponders ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className={styles.resultsGrid}>
            {filteredTransponders.map((transponder: TransponderKeyData) => (
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
                    {transponder.yearStart} - {transponder.yearEnd || "Present"}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
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
                    {Array.isArray(selectedTransponderDetails.compatibleParts)
                      ? selectedTransponderDetails.compatibleParts.join(", ")
                      : selectedTransponderDetails.compatibleParts || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Dual System</h4>
                  <p>{selectedTransponderDetails.dualSystem ? "Yes" : "No"}</p>
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
    </div>
  );
}
