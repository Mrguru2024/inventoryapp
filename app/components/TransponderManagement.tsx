"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import TransponderIdentifier from "./TransponderIdentifier";
import TransponderInventoryManager from "./TransponderInventoryManager";
import ProgrammingGuideGenerator from "./ProgrammingGuideGenerator";
import {
  transponderService,
  TransponderKeyData,
  TransponderSearchParams,
} from "@/app/services/transponderService";
import {
  transponderInventoryService,
  TransponderInventoryItem,
} from "@/app/services/transponderInventoryService";
import { useToast } from "@/app/components/ui/use-toast";
import LoadingSpinner from "./LoadingSpinner";

export default function TransponderManagement() {
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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all transponder data without any filters initially
      const [transponders, inventory] = await Promise.all([
        transponderService.searchTransponders({}), // Get all data first
        transponderInventoryService.getInventoryLevels(),
      ]);

      // Transform the data to ensure proper typing
      const transformedTransponders = transponders.map(
        (t: TransponderKeyData) => ({
          ...t,
          chipType: Array.isArray(t.chipType)
            ? t.chipType
            : JSON.parse(t.chipType || "[]"),
          compatibleParts: Array.isArray(t.compatibleParts)
            ? t.compatibleParts
            : JSON.parse(t.compatibleParts || "[]"),
        })
      );

      // Store all data
      setTransponderData(transformedTransponders);
      setInventoryLevels(inventory);

      // Log the data for debugging
      console.log("Loaded transponders:", transformedTransponders.length);
      console.log(
        "Unique makes:",
        Array.from(
          new Set(
            transformedTransponders.map((t: TransponderKeyData) => t.make)
          )
        ).length
      );
      console.log(
        "Unique models:",
        Array.from(
          new Set(
            transformedTransponders.map((t: TransponderKeyData) => t.model)
          )
        ).length
      );
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load transponder data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // Remove searchParams from dependencies

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter transponder data based on search params
  const filteredTransponderData = useMemo(() => {
    return transponderData.filter((t) => {
      if (searchParams.make && t.make !== searchParams.make) return false;
      if (searchParams.model && t.model !== searchParams.model) return false;
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

  const getUniqueMakes = useMemo(() => {
    return Array.from(
      new Set(transponderData.map((t: TransponderKeyData) => t.make))
    ).sort();
  }, [transponderData]);

  const getModelsForMake = useCallback(
    (make: string) => {
      return Array.from(
        new Set(
          transponderData
            .filter((t: TransponderKeyData) => t.make === make)
            .map((t: TransponderKeyData) => t.model)
        )
      ).sort();
    },
    [transponderData]
  );

  const getYearsForMakeAndModel = useCallback(
    (make: string, model: string) => {
      const years = new Set<number>();
      transponderData
        .filter((t: TransponderKeyData) => t.make === make && t.model === model)
        .forEach((t: TransponderKeyData) => {
          if ("yearStart" in t && typeof t.yearStart === "number") {
            years.add(t.yearStart);
            if ("yearEnd" in t && typeof t.yearEnd === "number") {
              years.add(t.yearEnd);
            }
          }
        });
      return Array.from(years).sort((a, b) => a - b);
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
    try {
      await transponderInventoryService.updateStock(parseInt(id, 10), quantity);
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
    try {
      await transponderInventoryService.orderStock(item);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Make Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Make
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={searchParams.make || ""}
                onChange={(e) =>
                  handleSearch({ ...searchParams, make: e.target.value })
                }
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

            {/* Model Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Model
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={searchParams.model || ""}
                onChange={(e) =>
                  handleSearch({ ...searchParams, model: e.target.value })
                }
                disabled={!searchParams.make}
                aria-label="Select vehicle model"
              >
                <option value="">All Models</option>
                {searchParams.make &&
                  getModelsForMake(searchParams.make).map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Year
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={searchParams.year || ""}
                onChange={(e) =>
                  handleSearch({
                    ...searchParams,
                    year: e.target.value || undefined,
                  })
                }
                disabled={!searchParams.make || !searchParams.model}
                aria-label="Select vehicle year"
              >
                <option value="">All Years</option>
                {searchParams.make &&
                  searchParams.model &&
                  getYearsForMakeAndModel(
                    searchParams.make,
                    searchParams.model
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Results Display */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Transponder Data
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transponder List */}
              <div className="space-y-4">
                {filteredTransponderData.map((transponder) => (
                  <div
                    key={transponder.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTransponder?.id === transponder.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                    }`}
                    onClick={() => setSelectedTransponder(transponder)}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {transponder.make} {transponder.model}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {"yearStart" in transponder &&
                      typeof transponder.yearStart === "number"
                        ? transponder.yearStart
                        : ""}{" "}
                      -{" "}
                      {"yearEnd" in transponder &&
                      typeof transponder.yearEnd === "number"
                        ? transponder.yearEnd || "Present"
                        : "Present"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Type: {transponder.transponderType}
                    </p>
                  </div>
                ))}
              </div>

              {/* Selected Transponder Details */}
              {selectedTransponder && (
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      {selectedTransponder.make} {selectedTransponder.model}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Years:{" "}
                        {"yearStart" in selectedTransponder &&
                        typeof selectedTransponder.yearStart === "number"
                          ? selectedTransponder.yearStart
                          : ""}{" "}
                        -{" "}
                        {"yearEnd" in selectedTransponder &&
                        typeof selectedTransponder.yearEnd === "number"
                          ? selectedTransponder.yearEnd || "Present"
                          : "Present"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Transponder Type: {selectedTransponder.transponderType}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Chip Types:{" "}
                        {Array.isArray(selectedTransponder.chipType)
                          ? selectedTransponder.chipType.join(", ")
                          : selectedTransponder.chipType}
                      </p>
                      {selectedTransponder.frequency && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Frequency: {selectedTransponder.frequency}
                        </p>
                      )}
                      {selectedTransponder.compatibleParts && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Compatible Parts:{" "}
                          {Array.isArray(selectedTransponder.compatibleParts)
                            ? selectedTransponder.compatibleParts.join(", ")
                            : selectedTransponder.compatibleParts}
                        </p>
                      )}
                      {selectedTransponder.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notes: {selectedTransponder.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Programming Guide */}
                  <ProgrammingGuideGenerator
                    transponder={selectedTransponder}
                  />

                  {/* Inventory Management */}
                  <TransponderInventoryManager
                    inventory={inventoryLevels.filter(
                      (item) =>
                        item.transponderKey.id.toString() ===
                        selectedTransponder.id
                    )}
                    onUpdateStock={handleUpdateStock}
                    onOrderStock={handleOrderStock}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
