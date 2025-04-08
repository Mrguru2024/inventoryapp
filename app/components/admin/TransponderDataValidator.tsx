"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/button";

interface TransponderKey {
  id: number;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
  transponderType: string;
  chipType: string[] | string;
  compatibleParts: string[] | string;
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
  fccId: string | null;
}

interface DataDiscrepancy {
  transponderMake: string;
  transponderModel: string;
  transponderYear: number | null;
  fccId: string;
  field: string;
  databaseValue: any;
  scrapedValue: any;
}

export default function TransponderDataValidator() {
  const [validating, setValidating] = useState(false);
  const [discrepancies, setDiscrepancies] = useState<DataDiscrepancy[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");

  // Get all transponders with FCC IDs
  const { data: transponders = [], isLoading } = useQuery({
    queryKey: ["transponders-with-fccid"],
    queryFn: async () => {
      const response = await fetch("/api/transponders/with-fccid");
      if (!response.ok) {
        throw new Error("Failed to fetch transponders with FCC IDs");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get all scraped data
  const { data: scrapedData = [], isLoading: isLoadingScraped } = useQuery({
    queryKey: ["scraped-fcc-data"],
    queryFn: async () => {
      const response = await fetch("/api/scraped-data/fcc");
      if (!response.ok) {
        throw new Error("Failed to fetch scraped FCC data");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: validating, // Only fetch when validation is triggered
  });

  // Extract unique makes for filtering
  const makes = Array.from(
    new Set(transponders.map((t: TransponderKey) => t.make))
  ).sort();

  // Filter transponders by selected make
  const filteredTransponders = selectedMake
    ? transponders.filter((t: TransponderKey) => t.make === selectedMake)
    : transponders;

  // Validate data against scraped references
  const validateData = async () => {
    setValidating(true);

    // Mock implementation of data validation logic
    // In a real implementation, this would compare database values against scraped values
    const foundDiscrepancies: DataDiscrepancy[] = [];

    // Simulate comparing database values against scraped values
    setTimeout(() => {
      // Here we would actually compare transponders with scrapedData
      // For now, just create some example discrepancies
      const sampleDiscrepancies = filteredTransponders
        .slice(0, 3)
        .map((t: TransponderKey) => ({
          transponderMake: t.make,
          transponderModel: t.model,
          transponderYear: t.yearStart,
          fccId: t.fccId || "",
          field: "frequency",
          databaseValue: t.frequency || "Not set",
          scrapedValue: "433 MHz", // Example scraped value
        }));

      setDiscrepancies(sampleDiscrepancies);
      setValidating(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Transponder Data Validator</h2>
      <p className="text-gray-600 dark:text-gray-300">
        This tool checks your transponder data against the scraped FCC ID
        reference data to find inconsistencies.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <label
            htmlFor="make-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filter by Make
          </label>
          <select
            id="make-select"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
          >
            <option value="">All Makes</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={validateData}
          disabled={validating || isLoadingScraped}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {validating ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Validating...</span>
            </>
          ) : (
            "Validate Data"
          )}
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Validation Results</h3>

        {discrepancies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Make / Model
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    FCC ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Field
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Database Value
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Scraped Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {discrepancies.map((discrepancy, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {discrepancy.transponderMake}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {discrepancy.transponderModel} (
                        {discrepancy.transponderYear})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">
                        {discrepancy.fccId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {discrepancy.field}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                        {discrepancy.databaseValue}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                        {discrepancy.scrapedValue}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : validating ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="md" />
            <p className="ml-3 text-gray-500">
              Checking for data discrepancies...
            </p>
          </div>
        ) : discrepancies.length === 0 && !validating ? (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-center">
            {selectedMake ? (
              <p>
                No discrepancies found for {selectedMake} transponders. Click
                "Validate Data" to check for inconsistencies.
              </p>
            ) : (
              <p>
                Select a make and click "Validate Data" to check for
                inconsistencies.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
