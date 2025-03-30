"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import { useDebounce } from "@/app/hooks/useDebounce";
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

// Create repository instances outside component to prevent recreation
const nhtsaRepository = new NhtsaApiRepository();
const transponderRepository = new TransponderApiRepository();

export default function TransponderSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [selectedTransponderType, setSelectedTransponderType] =
    useState<TransponderType | null>(null);

  // Increase debounce time to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Memoize filter changes to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Fetch makes with long stale time since they rarely change
  const {
    data: makes = [],
    isLoading: isLoadingMakes,
    error: makesError,
  } = useQuery<Make[]>({
    queryKey: ["makes"],
    queryFn: () => nhtsaRepository.getAllMakes(),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in cache for 7 days
  });

  // Fetch models with caching
  const {
    data: models = [],
    isLoading: isLoadingModels,
    error: modelsError,
  } = useQuery<Model[]>({
    queryKey: ["models", selectedMake?.id],
    queryFn: () =>
      selectedMake ? nhtsaRepository.getModelsForMake(selectedMake) : [],
    enabled: !!selectedMake,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in cache for 7 days
  });

  // Fetch years with caching
  const {
    data: years = [],
    isLoading: isLoadingYears,
    error: yearsError,
  } = useQuery<Year[]>({
    queryKey: ["years", selectedModel?.id],
    queryFn: () =>
      selectedModel ? nhtsaRepository.getYearsForModel(selectedModel) : [],
    enabled: !!selectedModel,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in cache for 7 days
  });

  // Fetch transponder types with long stale time
  const {
    data: transponderTypes = [],
    isLoading: isLoadingTypes,
    error: typesError,
  } = useQuery<string[]>({
    queryKey: ["transponderTypes"],
    queryFn: () => transponderRepository.getAllTransponderTypes(),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in cache for 7 days
  });

  // Memoize filters to prevent unnecessary re-renders
  const filters = useMemo(
    () => ({
      searchTerm: debouncedSearchTerm,
      make: selectedMake || undefined,
      model: selectedModel || undefined,
      year: selectedYear?.value.toString(),
      transponderType: selectedTransponderType || undefined,
    }),
    [
      debouncedSearchTerm,
      selectedMake,
      selectedModel,
      selectedYear,
      selectedTransponderType,
    ]
  );

  // Fetch transponders with optimized caching
  const {
    data: transponders = [],
    isLoading: isLoadingTransponders,
    error: transpondersError,
  } = useQuery<Transponder[]>({
    queryKey: ["transponders", filters],
    queryFn: () => transponderRepository.searchTransponders(filters),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  // Memoize filter change handler
  const handleFilterChange = useCallback(
    (type: "make" | "model" | "year" | "transponderType", value: any) => {
      switch (type) {
        case "make":
          setSelectedMake(value);
          setSelectedModel(null);
          setSelectedYear(null);
          setSelectedTransponderType(null);
          break;
        case "model":
          setSelectedModel(value);
          setSelectedYear(null);
          setSelectedTransponderType(null);
          break;
        case "year":
          setSelectedYear(value);
          setSelectedTransponderType(null);
          break;
        case "transponderType":
          setSelectedTransponderType(value);
          break;
      }
    },
    []
  );

  // Memoize reset handler
  const resetFilters = useCallback(() => {
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedTransponderType(null);
    setSearchTerm("");
  }, []);

  // Memoize select change handlers
  const handleMakeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const make = makes.find((m: Make) => m.id === parseInt(e.target.value));
      handleFilterChange("make", make || null);
    },
    [makes, handleFilterChange]
  );

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const model = models.find(
        (m: Model) => m.id === parseInt(e.target.value)
      );
      handleFilterChange("model", model || null);
    },
    [models, handleFilterChange]
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const year = years.find(
        (y: Year) => y.value === parseInt(e.target.value)
      );
      handleFilterChange("year", year || null);
    },
    [years, handleFilterChange]
  );

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const type = transponderTypes.find((t: string) => t === e.target.value);
      handleFilterChange(
        "transponderType",
        type ? TransponderType.fromString(type) : null
      );
    },
    [transponderTypes, handleFilterChange]
  );

  // Show loading spinner while initial data is loading
  if (isLoadingMakes || isLoadingTransponders) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-96">
          <input
            type="text"
            placeholder="Search transponders..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <select
            value={selectedMake?.id || ""}
            onChange={handleMakeChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select vehicle make"
            disabled={isLoadingMakes}
          >
            <option key="make-all" value="">
              All Makes
            </option>
            {makes.map((make: Make) => (
              <option key={`make-${make.id}`} value={make.id}>
                {make.name}
              </option>
            ))}
          </select>
          {makesError && (
            <p className="mt-1 text-sm text-red-500">Error loading makes</p>
          )}
          {isLoadingMakes && (
            <p className="mt-1 text-sm text-gray-500">Loading makes...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <select
            value={selectedModel?.id || ""}
            onChange={handleModelChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select vehicle model"
            disabled={isLoadingModels || !selectedMake}
          >
            <option key="model-all" value="">
              All Models
            </option>
            {models.map((model: Model) => (
              <option key={`model-${model.id}`} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {modelsError && (
            <p className="mt-1 text-sm text-red-500">Error loading models</p>
          )}
          {isLoadingModels && (
            <p className="mt-1 text-sm text-gray-500">Loading models...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            value={selectedYear?.value || ""}
            onChange={handleYearChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select vehicle year"
            disabled={isLoadingYears || !selectedModel}
          >
            <option key="year-all" value="">
              All Years
            </option>
            {years.map((year: Year) => (
              <option key={`year-${year.value}`} value={year.value}>
                {year.value}
              </option>
            ))}
          </select>
          {yearsError && (
            <p className="mt-1 text-sm text-red-500">Error loading years</p>
          )}
          {isLoadingYears && (
            <p className="mt-1 text-sm text-gray-500">Loading years...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transponder Type
          </label>
          <select
            value={selectedTransponderType?.code || ""}
            onChange={handleTypeChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select transponder type"
            disabled={isLoadingTypes}
          >
            <option key="type-all" value="">
              All Types
            </option>
            {transponderTypes.map((type: string) => (
              <option key={`type-${type}`} value={type}>
                {type}
              </option>
            ))}
          </select>
          {typesError && (
            <p className="mt-1 text-sm text-red-500">Error loading types</p>
          )}
          {isLoadingTypes && (
            <p className="mt-1 text-sm text-gray-500">Loading types...</p>
          )}
        </div>
      </div>

      {/* Results section */}
      <div className="mt-8">
        {isLoadingTransponders ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transponders.map((transponder: Transponder) => (
              <div
                key={transponder.id.value}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg mb-2">
                  {transponder.make.name} {transponder.model.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {transponder.yearStart?.value} - {transponder.yearEnd?.value}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {transponder.transponderType.code}
                </p>
                {transponder.frequency && (
                  <p className="text-sm text-gray-600">
                    Frequency: {transponder.frequency}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
