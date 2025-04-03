import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TransponderKeyData } from "@/app/services/transponderService";
import { debounce } from "lodash";

interface TransponderFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function TransponderFilters({
  onFilterChange,
}: TransponderFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTransponderType, setSelectedTransponderType] =
    useState<string>("");

  // Fetch transponders with optimized query
  const { data: transponders = [] } = useQuery({
    queryKey: ["transponders"],
    queryFn: async () => {
      const response = await fetch("/api/transponders");
      if (!response.ok) throw new Error("Failed to fetch transponders");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });

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

  // Debounced filter change
  const debouncedFilterChange = useCallback(
    debounce((newFilters: any) => {
      onFilterChange(newFilters);
    }, 300),
    [onFilterChange]
  );

  // Update filters when they change
  useMemo(() => {
    debouncedFilterChange(filters);
  }, [filters, debouncedFilterChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Make Select */}
        <div className="relative">
          <label
            htmlFor="make-select"
            className="block text-sm font-medium text-gray-700"
          >
            Make
          </label>
          <select
            id="make-select"
            className="form-select"
            value={selectedMake}
            onChange={(e) => {
              setSelectedMake(e.target.value);
              setSelectedModel("");
            }}
            aria-label="Select vehicle make"
          >
            <option value="">All Makes</option>
            {Array.from(
              new Set(transponders.map((t: TransponderKeyData) => t.make))
            ).map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Model Select */}
        <div className="relative">
          <label
            htmlFor="model-select"
            className="block text-sm font-medium text-gray-700"
          >
            Model
          </label>
          <select
            id="model-select"
            className="form-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake}
            aria-label="Select vehicle model"
          >
            <option value="">All Models</option>
            {Array.from(
              new Set(
                transponders
                  .filter(
                    (t: TransponderKeyData) =>
                      t.make.toLowerCase() === selectedMake.toLowerCase()
                  )
                  .map((t) => t.model)
              )
            ).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div className="relative">
          <label
            htmlFor="year-select"
            className="block text-sm font-medium text-gray-700"
          >
            Year
          </label>
          <select
            id="year-select"
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Select vehicle year"
          >
            <option value="">All Years</option>
            {Array.from(
              new Set(
                transponders
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
                    return true;
                  })
                  .map((t) => t.yearStart)
              )
            )
              .sort((a, b) => b - a)
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>

        {/* Transponder Type Select */}
        <div className="relative">
          <label
            htmlFor="type-select"
            className="block text-sm font-medium text-gray-700"
          >
            Transponder Type
          </label>
          <select
            id="type-select"
            className="form-select"
            value={selectedTransponderType}
            onChange={(e) => setSelectedTransponderType(e.target.value)}
            aria-label="Select transponder type"
          >
            <option value="">All Types</option>
            {Array.from(
              new Set(
                transponders
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
            ).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <label
          htmlFor="search-input"
          className="block text-sm font-medium text-gray-700"
        >
          Search
        </label>
        <input
          id="search-input"
          type="text"
          className="form-input w-full"
          placeholder="Search transponders..."
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search transponders"
        />
      </div>
    </div>
  );
}
