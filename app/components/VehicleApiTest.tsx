"use client";

import { useEffect, useState } from "react";
import { vehicleService } from "@/app/services/vehicleService";

export default function VehicleApiTest() {
  const [apiStatus, setApiStatus] = useState<"testing" | "success" | "error">(
    "testing"
  );
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [models, setModels] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Generate years array from 1995 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1995 + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      const isConnected = await vehicleService.testApiConnection();
      setApiStatus(isConnected ? "success" : "error");
      if (isConnected) {
        const makesList = await vehicleService.getAllMakes();
        setMakes(makesList.map((make) => make.MakeName));
      }
    } catch (error) {
      setApiStatus("error");
      setError("Failed to connect to NHTSA API");
    }
  };

  const handleMakeChange = async (make: string) => {
    setSelectedMake(make);
    if (make && selectedYear) {
      await fetchModels(make, selectedYear);
    }
  };

  const handleYearChange = async (year: string) => {
    setSelectedYear(year);
    if (selectedMake && year) {
      await fetchModels(selectedMake, year);
    }
  };

  const fetchModels = async (make: string, year: string) => {
    try {
      setError("");
      const modelsList = await vehicleService.getModelsForMakeYear(make, year);
      setModels(modelsList);
    } catch (error) {
      setError("Failed to fetch models");
      setModels([]);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">NHTSA API Test</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span>API Status:</span>
          {apiStatus === "testing" && (
            <span className="text-yellow-500">Testing...</span>
          )}
          {apiStatus === "success" && (
            <span className="text-green-500">Connected</span>
          )}
          {apiStatus === "error" && <span className="text-red-500">Error</span>}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="make-select"
              className="block text-sm font-medium mb-1"
            >
              Make
            </label>
            <select
              id="make-select"
              value={selectedMake}
              onChange={(e) => handleMakeChange(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              aria-label="Select vehicle make"
            >
              <option value="">Select Make</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="year-select"
              className="block text-sm font-medium mb-1"
            >
              Year
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              aria-label="Select vehicle year"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="model-select"
              className="block text-sm font-medium mb-1"
            >
              Model
            </label>
            <select
              id="model-select"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              disabled={!models.length}
              aria-label="Select vehicle model"
            >
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {makes.length > 0 && (
            <p>
              Loaded {makes.length} makes and {models.length} models
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
