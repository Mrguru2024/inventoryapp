"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface TransponderKey {
  id: number;
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
  fccId: string | null;
}

export default function TransponderList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch transponders with FCC IDs
  const { data: transponders = [], isLoading } = useQuery({
    queryKey: ["transponders-with-fccid"],
    queryFn: async () => {
      const response = await fetch("/api/transponders/with-fccid");
      if (!response.ok) {
        throw new Error("Failed to fetch transponders with FCC IDs");
      }
      return response.json();
    },
    staleTime: 60 * 1000, // 1 minute
  });

  // Filter transponders based on search term
  const filteredTransponders = transponders.filter(
    (transponder: TransponderKey) => {
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        transponder.make.toLowerCase().includes(term) ||
        transponder.model.toLowerCase().includes(term) ||
        transponder.transponderType.toLowerCase().includes(term) ||
        (transponder.fccId && transponder.fccId.toLowerCase().includes(term)) ||
        (transponder.frequency &&
          transponder.frequency.toLowerCase().includes(term))
      );
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Transponders with FCC ID Data</h2>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                Year
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Type
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
                Frequency
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Compatible Parts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTransponders.length > 0 ? (
              filteredTransponders.map((transponder: TransponderKey) => (
                <tr
                  key={transponder.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transponder.make}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transponder.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {transponder.yearStart}
                    {transponder.yearEnd ? ` - ${transponder.yearEnd}` : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {transponder.transponderType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {transponder.fccId ? (
                      <a
                        href={`/admin/transponders/fcc-id/${transponder.fccId}`}
                        className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {transponder.fccId}
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {transponder.frequency || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {transponder.compatibleParts &&
                    transponder.compatibleParts.length > 0
                      ? transponder.compatibleParts.join(", ")
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {searchTerm
                    ? "No matching transponders found."
                    : "No transponders with FCC ID data available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredTransponders.length} of {transponders.length}{" "}
        transponders with FCC ID data.
      </div>
    </div>
  );
}
