"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { transponderService } from "@/app/services/transponderService";
import LoadingSpinner from "./LoadingSpinner";
import type { TransponderData } from "@/app/services/transponderService";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useTransponderData } from "@/app/hooks/useTransponderData";
import { useNhtsaData } from "@/app/hooks/useNhtsaData";
import Fuse from "fuse.js";

interface TransponderResponse {
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

export default function TransponderSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTransponderType, setSelectedTransponderType] =
    useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: transponderData, isLoading: isLoadingTransponders } =
    useTransponderData();
  const {
    makes,
    models,
    years,
    setSelectedMake: setNhtsaMake,
    setSelectedModel: setNhtsaModel,
    isLoading: isLoadingNhtsa,
  } = useNhtsaData();

  // Add these state variables after the existing useState declarations
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<TransponderResponse[]>([]);

  // Fetch data with filters
  const {
    data: results = [],
    isLoading,
    error,
  } = useQuery<TransponderResponse[]>({
    queryKey: [
      "transponders",
      debouncedSearchTerm,
      selectedMake,
      selectedModel,
      selectedYear,
      selectedTransponderType,
    ],
    queryFn: async () => {
      try {
        return await transponderService.searchTransponders({
          search: debouncedSearchTerm,
          make: selectedMake,
          model: selectedModel,
          year: selectedYear,
          type: selectedTransponderType,
        });
      } catch (error) {
        console.error("Error fetching transponder data:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Extract unique values for dropdowns
  const { transponderTypes } = useMemo(() => {
    if (!results || !Array.isArray(results)) {
      return {
        transponderTypes: [],
      };
    }

    // Get available transponder types
    const availableTypes = Array.from(
      new Set(
        results
          .filter((r) => {
            const makeMatch =
              !selectedMake ||
              r.make.toLowerCase() === selectedMake.toLowerCase();
            const modelMatch =
              !selectedModel ||
              r.model.toLowerCase() === selectedModel.toLowerCase();
            const yearMatch =
              !selectedYear ||
              (r.yearStart &&
                parseInt(selectedYear) >= r.yearStart &&
                (!r.yearEnd || parseInt(selectedYear) <= r.yearEnd));
            return makeMatch && modelMatch && yearMatch;
          })
          .map((r) => r.transponderType)
      )
    ).sort();

    return {
      transponderTypes: availableTypes,
    };
  }, [results, selectedMake, selectedModel, selectedYear]);

  // Reset dependent filters
  useEffect(() => {
    if (selectedMake) {
      setSelectedModel("");
      setSelectedYear("");
      setSelectedTransponderType("");
    }
  }, [selectedMake]);

  useEffect(() => {
    if (selectedModel) {
      setSelectedYear("");
      setSelectedTransponderType("");
    }
  }, [selectedModel]);

  useEffect(() => {
    if (selectedYear) {
      setSelectedTransponderType("");
    }
  }, [selectedYear]);

  const resetFilters = () => {
    setSelectedMake("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedTransponderType("");
    setSearchTerm("");
    setNhtsaMake("");
    setNhtsaModel("");
  };

  // Memoize the filtered results
  const filteredResults = useMemo(() => {
    if (!results || !Array.isArray(results)) return [];

    let filtered = results;

    // Apply search query
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.make.toLowerCase().includes(query) ||
          t.model.toLowerCase().includes(query) ||
          t.transponderType.toLowerCase().includes(query) ||
          t.chipType.some((chip) => chip.toLowerCase().includes(query)) ||
          t.compatibleParts.some((part) =>
            part.toLowerCase().includes(query)
          ) ||
          (t.notes && t.notes.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (selectedMake) {
      filtered = filtered.filter(
        (t) => t.make.toLowerCase() === selectedMake.toLowerCase()
      );
    }

    if (selectedModel) {
      filtered = filtered.filter(
        (t) => t.model.toLowerCase() === selectedModel.toLowerCase()
      );
    }

    if (selectedYear) {
      const yearNum = parseInt(selectedYear);
      filtered = filtered.filter(
        (t) =>
          t.yearStart &&
          yearNum >= t.yearStart &&
          (!t.yearEnd || yearNum <= t.yearEnd)
      );
    }

    if (selectedTransponderType) {
      filtered = filtered.filter(
        (t) =>
          t.transponderType.toLowerCase() ===
          selectedTransponderType.toLowerCase()
      );
    }

    // Log the number of filtered results for debugging
    console.log(`Filtered results: ${filtered.length}`);
    const filteredMakes = Array.from(new Set(filtered.map((t) => t.make)));
    console.log(`Filtered manufacturers: ${filteredMakes.join(", ")}`);

    return filtered;
  }, [
    results,
    searchTerm,
    selectedMake,
    selectedModel,
    selectedYear,
    selectedTransponderType,
  ]);

  // Batch state updates for filter changes
  const handleFilterChange = useCallback(
    (type: "make" | "model" | "year" | "transponderType", value: string) => {
      const updates = () => {
        switch (type) {
          case "make":
            setSelectedMake(value);
            setSelectedModel("");
            setSelectedYear("");
            setSelectedTransponderType("");
            setNhtsaMake(value);
            break;
          case "model":
            setSelectedModel(value);
            setSelectedYear("");
            setSelectedTransponderType("");
            setNhtsaModel(value);
            break;
          case "year":
            setSelectedYear(value);
            setSelectedTransponderType("");
            break;
          case "transponderType":
            setSelectedTransponderType(value);
            break;
        }
      };

      updates();
    },
    []
  );

  // Handle make selection
  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel("");
    setSelectedYear("");
    setNhtsaMake(make);
  };

  // Handle model selection
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedYear("");
    setNhtsaModel(model);
  };

  // Add this function before the return statement
  const handleSearchInput = useCallback(
    (value: string) => {
      setSearchTerm(value);
      if (value.length >= 2) {
        const fuse = new Fuse(results, {
          keys: [
            { name: "make", weight: 0.4 },
            { name: "model", weight: 0.3 },
            { name: "transponderType", weight: 0.2 },
            { name: "chipType", weight: 0.05 },
            { name: "compatibleParts", weight: 0.05 },
          ],
          threshold: 0.3,
          includeScore: true,
          minMatchCharLength: 2,
        });

        const searchResults = fuse.search(value);
        const uniqueSuggestions = Array.from(
          new Set(searchResults.slice(0, 5).map((result) => result.item))
        );
        setSuggestions(uniqueSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [results]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading transponder data:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transponders..."
            value={searchTerm}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700 w-full"
            aria-label="Search transponders"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(suggestion.make + " " + suggestion.model);
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }}
                >
                  <div className="font-medium">
                    {suggestion.make} {suggestion.model}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {suggestion.transponderType}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <select
          id="make"
          value={selectedMake}
          onChange={(e) => handleMakeChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          aria-label="Select vehicle make"
        >
          <option value="">All Makes</option>
          {makes.map((make) => (
            <option key={make.Make_ID} value={make.Make_Name}>
              {make.Make_Name}
            </option>
          ))}
        </select>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading || !selectedMake}
          aria-label="Select vehicle model"
        >
          <option value="">All Models</option>
          {Array.isArray(models) &&
            models.map((model) => (
              <option key={model.Model_ID} value={model.Model_Name}>
                {model.Model_Name}
              </option>
            ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
          aria-label="Select vehicle year"
        >
          <option value="">All Years</option>
          {years.map((yearObj) => (
            <option key={yearObj.Year} value={yearObj.Year}>
              {yearObj.Year}
            </option>
          ))}
        </select>
        <select
          value={selectedTransponderType}
          onChange={(e) =>
            handleFilterChange("transponderType", e.target.value)
          }
          className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          aria-label="Select transponder type"
          disabled={!selectedYear}
        >
          <option value="">All Types</option>
          {transponderTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Found {filteredResults.length} transponders
      </div>

      {/* Results list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map((transponder) => (
          <div
            key={transponder.id}
            className="p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {transponder.make} {transponder.model}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transponder.yearStart} - {transponder.yearEnd || "Present"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Type: {transponder.transponderType}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Frequency: {transponder.frequency || "N/A"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chip Types: {transponder.chipType.join(", ")}
            </p>
            {transponder.notes && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Notes: {transponder.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Reset filters button */}
      {(selectedMake ||
        selectedModel ||
        selectedYear ||
        selectedTransponderType ||
        searchTerm) && (
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
