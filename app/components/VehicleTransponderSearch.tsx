"use client";

import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import {
  Check,
  AlertTriangle,
  ChevronDown,
  Loader2,
  KeyRound,
  RefreshCcw,
  Search,
  X,
  Filter,
  SplitSquareHorizontal,
  Clock,
  Trash2,
} from "lucide-react";
import { Listbox, Transition, Switch, Combobox, Tab } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  TransponderKeyData,
  getTransponders,
} from "@/app/services/transponderService";
import { fuzzySearch } from "@/app/services/searchService";
import { SearchSuggestion, RecentSearch } from "@/app/types/search";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import debounce from "lodash/debounce";
import logger from "@/app/utils/logger";
import SearchAnalyticsService from "@/app/services/analyticsService";
import { useQuery } from "@tanstack/react-query";
import { TransponderFilters } from "@/app/lib/domain/value-objects";

interface Make {
  MakeId: number;
  MakeName: string;
}

interface Model {
  ModelId: number;
  ModelName: string;
}

interface SearchResult {
  vehicle: {
    make: string;
    model: string;
  };
  transponders: TransponderKeyData[];
}

interface FilterOptions {
  chipTypes: string[];
  frequencies: string[];
  yearRange: [number, number];
}

interface SearchSuggestion {
  id: string;
  type: "make" | "model" | "chipType" | "transponderType";
  value: string;
}

// Add validation types
interface ValidationError {
  field: string;
  message: string;
}

// Add detailed loading state interface
interface DetailedLoadingState {
  makes: boolean;
  models: boolean;
  transponders: boolean;
  search: boolean;
  filters: boolean;
  comparison: boolean;
}

interface SearchHistory {
  id: string;
  query: string;
  type: "make" | "model" | "chipType" | "transponderType";
  timestamp: number;
}

const RECENT_SEARCHES_KEY = "recent-searches";
const MAX_RECENT_SEARCHES = 5;

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
      <h3 className="text-red-800 dark:text-red-200 font-medium">
        Something went wrong:
      </h3>
      <pre className="text-sm text-red-600 dark:text-red-300 mt-2">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

const KeyboardHint = ({
  shortcut,
  action,
}: {
  shortcut: string;
  action: string;
}) => (
  <div className="flex items-center justify-between px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
    <span>{action}</span>
    <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
      {shortcut}
    </kbd>
  </div>
);

export default function VehicleTransponderSearch() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [transponders, setTransponders] = useState<TransponderKeyData[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedTransponders, setComparedTransponders] = useState<
    TransponderKeyData[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [loadingStates, setLoadingStates] = useState<DetailedLoadingState>({
    makes: false,
    models: false,
    transponders: false,
    search: false,
    filters: false,
    comparison: false,
  });
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [popularSearches, setPopularSearches] = useState<
    { query: string; count: number }[]
  >([]);

  // Add categories
  const categories = [
    { id: "all", name: "All" },
    { id: "makes", name: "Makes" },
    { id: "models", name: "Models" },
    { id: "chips", name: "Chip Types" },
    { id: "transponders", name: "Transponders" },
  ];

  // Add data validation
  const validateTransponderData = (
    data: TransponderKeyData[]
  ): ValidationError[] => {
    const errors: ValidationError[] = [];

    data.forEach((transponder) => {
      if (!transponder.make) {
        errors.push({
          field: "make",
          message: `Missing make for transponder ${transponder.id}`,
        });
      }
      if (!transponder.model) {
        errors.push({
          field: "model",
          message: `Missing model for transponder ${transponder.id}`,
        });
      }
      if (!transponder.yearStart) {
        errors.push({
          field: "yearStart",
          message: `Missing year start for transponder ${transponder.id}`,
        });
      }
      if (!transponder.chipType || transponder.chipType.length === 0) {
        errors.push({
          field: "chipType",
          message: `Missing chip type for transponder ${transponder.id}`,
        });
      }
    });

    return errors;
  };

  // Enhanced data fetching with better error handling
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingStates((prev) => ({
        ...prev,
        makes: true,
        transponders: true,
      }));
      try {
        logger.info("Fetching initial data...");

        // Fetch makes from NHTSA API
        const makesResponse = await fetch(
          "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json"
        );
        if (!makesResponse.ok) {
          throw new Error(`NHTSA API error: ${makesResponse.statusText}`);
        }
        const makesData = await makesResponse.json();
        logger.debug("Makes data received:", makesData);

        if (makesData.Results) {
          setMakes(makesData.Results);
        }

        // Fetch transponder data with error handling
        const transpondersData = await getTransponders();
        if (!transpondersData.length) {
          logger.warn("No transponder data received");
        } else {
          logger.debug("Transponders data received:", transpondersData);
        }

        // Validate transponder data
        const validationErrors = validateTransponderData(transpondersData);
        if (validationErrors.length > 0) {
          logger.warn("Validation errors found:", validationErrors);
          setValidationErrors(validationErrors);
        }

        setTransponders(transpondersData);
      } catch (error) {
        logger.error("Error fetching initial data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load initial data"
        );
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          makes: false,
          transponders: false,
        }));
      }
    };

    fetchInitialData();
  }, []);

  // Enhanced models fetching
  const fetchModels = useCallback(async (make: string) => {
    setLoadingStates((prev) => ({ ...prev, models: true }));
    try {
      logger.info(`Fetching models for make: ${make}`);

      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(
          make
        )}?format=json`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      logger.debug("Models data received:", data);

      if (data.Results && Array.isArray(data.Results)) {
        setModels(data.Results);
      } else {
        setModels([]);
        logger.warn("No valid models data received");
      }
    } catch (error) {
      logger.error(`Error fetching models for ${make}:`, error);
      setModels([]);
      setError(`Failed to load models for ${make}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, models: false }));
    }
  }, []);

  // Update handleMakeChange to properly handle make selection
  const handleMakeChange = useCallback(
    (make: Make | null) => {
      setSelectedMake(make);
      setSelectedModel(null);
      setSearchResults(null);
      if (make) {
        fetchModels(make.MakeName);
      } else {
        setModels([]);
      }
    },
    [fetchModels]
  );

  // Update handleModelChange to properly handle model selection
  const handleModelChange = useCallback(
    (model: Model | null) => {
      setSelectedModel(model);
      if (model && selectedMake) {
        const matchingTransponders = transponders.filter(
          (t) =>
            t.make.toLowerCase() === selectedMake.MakeName.toLowerCase() &&
            t.model.toLowerCase() === model.ModelName.toLowerCase()
        );

        setSearchResults({
          vehicle: {
            make: selectedMake.MakeName,
            model: model.ModelName,
          },
          transponders: matchingTransponders,
        });
      } else {
        setSearchResults(null);
      }
    },
    [selectedMake, transponders]
  );

  // Initialize filters when transponders are loaded
  useEffect(() => {
    if (transponders.length > 0) {
      const chipTypes = new Set<string>();
      const frequencies = new Set<string>();
      let minYear = Infinity;
      let maxYear = -Infinity;

      transponders.forEach((t) => {
        // Add chip types
        if (Array.isArray(t.chipType)) {
          t.chipType.forEach((chip) => chipTypes.add(chip));
        }

        // Add frequency if it exists
        if (t.frequency) {
          frequencies.add(t.frequency);
        }

        // Update year range
        if (t.yearStart) {
          minYear = Math.min(minYear, t.yearStart);
        }
        if (t.yearEnd) {
          maxYear = Math.max(maxYear, t.yearEnd);
        } else {
          maxYear = Math.max(maxYear, new Date().getFullYear());
        }
      });

      // Set default values if no data found
      if (minYear === Infinity) minYear = 1990;
      if (maxYear === -Infinity) maxYear = new Date().getFullYear();

      setFilters({
        chipTypes: Array.from(chipTypes).sort(),
        frequencies: Array.from(frequencies).sort(),
        yearRange: [minYear, maxYear],
      });

      // Log filter initialization
      logger.debug("Filters initialized:", {
        chipTypes: Array.from(chipTypes).length,
        frequencies: Array.from(frequencies).length,
        yearRange: [minYear, maxYear],
      });
    }
  }, [transponders]);

  // Add state for selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    chipTypes: new Set<string>(),
    frequencies: new Set<string>(),
    yearRange: [0, 0],
  });

  // Update selected filters when filters are initialized
  useEffect(() => {
    if (filters) {
      setSelectedFilters({
        chipTypes: new Set(),
        frequencies: new Set(),
        yearRange: filters.yearRange,
      });
    }
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (type: "chipTypes" | "frequencies" | "yearRange", value: any) => {
      setSelectedFilters((prev) => {
        const newFilters = { ...prev };

        switch (type) {
          case "chipTypes":
            if (prev.chipTypes.has(value)) {
              prev.chipTypes.delete(value);
            } else {
              prev.chipTypes.add(value);
            }
            break;
          case "frequencies":
            if (prev.frequencies.has(value)) {
              prev.frequencies.delete(value);
            } else {
              prev.frequencies.add(value);
            }
            break;
          case "yearRange":
            newFilters.yearRange = value;
            break;
        }

        return newFilters;
      });
    },
    []
  );

  // Update the filter panel JSX
  const FilterPanel = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-white dark:bg-gray-800 border rounded-lg p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chip Types */}
        <div>
          <h4 className="font-medium mb-2">Chip Types</h4>
          <div className="space-y-2">
            {filters?.chipTypes.map((chip) => (
              <label key={chip} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.chipTypes.has(chip)}
                  onChange={() => handleFilterChange("chipTypes", chip)}
                  className="rounded"
                />
                <span>{chip}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Frequencies */}
        <div>
          <h4 className="font-medium mb-2">Frequencies</h4>
          <div className="space-y-2">
            {filters?.frequencies.map((freq) => (
              <label key={freq} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.frequencies.has(freq)}
                  onChange={() => handleFilterChange("frequencies", freq)}
                  className="rounded"
                />
                <span>{freq}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Year Range */}
        <div>
          <h4 className="font-medium mb-2">Year Range</h4>
          <div className="space-y-4">
            <input
              type="range"
              min={filters?.yearRange[0]}
              max={filters?.yearRange[1]}
              value={selectedFilters.yearRange[1]}
              onChange={(e) =>
                handleFilterChange("yearRange", [
                  selectedFilters.yearRange[0],
                  parseInt(e.target.value),
                ])
              }
              className="w-full"
              aria-label="Year range slider"
            />
            <div className="flex justify-between text-sm">
              <span>{selectedFilters.yearRange[0]}</span>
              <span>{selectedFilters.yearRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleCompareToggle = (transponder: TransponderKeyData) => {
    setComparedTransponders((prev) => {
      const exists = prev.find((t) => t.id === transponder.id);
      if (exists) {
        return prev.filter((t) => t.id !== transponder.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, transponder];
    });
  };

  // Generate search suggestions from transponders
  const generateSuggestions = useMemo(() => {
    const suggestions: SearchSuggestion[] = [];

    transponders.forEach((t) => {
      // Add make suggestions
      if (!suggestions.some((s) => s.value === t.make)) {
        suggestions.push({
          id: `make-${t.make}`,
          type: "make",
          value: t.make,
        });
      }

      // Add model suggestions
      if (!suggestions.some((s) => s.value === t.model)) {
        suggestions.push({
          id: `model-${t.model}`,
          type: "model",
          value: t.model,
        });
      }

      // Add chip type suggestions
      t.chipType.forEach((chip) => {
        if (!suggestions.some((s) => s.value === chip)) {
          suggestions.push({
            id: `chip-${chip}`,
            type: "chipType",
            value: chip,
          });
        }
      });

      // Add transponder type suggestions
      if (!suggestions.some((s) => s.value === t.transponderType)) {
        suggestions.push({
          id: `transponder-${t.transponderType}`,
          type: "transponderType",
          value: t.transponderType,
        });
      }
    });

    return suggestions;
  }, [transponders]);

  // Improved search algorithm with fuzzy matching
  const getSearchScore = (text: string, query: string): number => {
    text = text.toLowerCase();
    query = query.toLowerCase();

    if (text === query) return 1;
    if (text.startsWith(query)) return 0.8;
    if (text.includes(query)) return 0.6;

    let score = 0;
    const words = query.split(" ");
    for (const word of words) {
      if (text.includes(word)) score += 0.4;
    }

    return score;
  };

  // Enhanced filtered suggestions with better scoring
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return generateSuggestions
      .map((suggestion) => ({
        ...suggestion,
        score: getSearchScore(suggestion.value, searchQuery),
      }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [generateSuggestions, searchQuery]);

  // Handle search selection
  const handleSearchSelection = useCallback(
    (value: string) => {
      const selected = generateSuggestions.find((s) => s.value === value);
      if (!selected) return;

      // Filter transponders based on selection type
      const filtered = transponders.filter((t) => {
        switch (selected.type) {
          case "make":
            return t.make.toLowerCase() === value.toLowerCase();
          case "model":
            return t.model.toLowerCase() === value.toLowerCase();
          case "chipType":
            return t.chipType.some(
              (chip) => chip.toLowerCase() === value.toLowerCase()
            );
          case "transponderType":
            return t.transponderType.toLowerCase() === value.toLowerCase();
          default:
            return false;
        }
      });

      setSearchResults({
        vehicle: { make: "", model: "" },
        transponders: filtered,
      });

      // Add to search history
      addToSearchHistory(value, selected.type);
    },
    [generateSuggestions, transponders, addToSearchHistory]
  );

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches
  const addRecentSearch = (suggestion: SearchSuggestion) => {
    const newRecent: RecentSearch = {
      id: suggestion.id,
      query: suggestion.value,
      timestamp: Date.now(),
      type: suggestion.type,
    };

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.id !== suggestion.id);
      const updated = [newRecent, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Load popular searches
  useEffect(() => {
    const popular = SearchAnalyticsService.getPopularSearches();
    setPopularSearches(popular);
  }, []);

  // Optimize handleSearch with proper dependencies
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }

      setLoadingStates((prev) => ({ ...prev, search: true }));

      try {
        const results = transponders.filter((t) => {
          const searchLower = query.toLowerCase();

          // Filter based on active category
          switch (activeCategory) {
            case "makes":
              return t.make.toLowerCase().includes(searchLower);
            case "models":
              return t.model.toLowerCase().includes(searchLower);
            case "chips":
              return t.chipType.some((chip) =>
                chip.toLowerCase().includes(searchLower)
              );
            case "transponders":
              return t.transponderType.toLowerCase().includes(searchLower);
            default:
              return (
                t.make.toLowerCase().includes(searchLower) ||
                t.model.toLowerCase().includes(searchLower) ||
                t.transponderType.toLowerCase().includes(searchLower) ||
                t.chipType.some((chip) =>
                  chip.toLowerCase().includes(searchLower)
                )
              );
          }
        });

        // Log search analytics
        await SearchAnalyticsService.logSearch({
          query,
          category: activeCategory,
          timestamp: Date.now(),
          resultsCount: results.length,
          filters: filters,
        });

        setSearchResults({
          vehicle: { make: "", model: "" },
          transponders: results,
        });
      } catch (error) {
        console.error("Search error:", error);
        setError("Failed to perform search");
      } finally {
        setLoadingStates((prev) => ({ ...prev, search: false }));
      }
    }, 300),
    [transponders, activeCategory, filters]
  );

  // Add this function to handle search history
  const addToSearchHistory = (value: string, type: SearchHistory["type"]) => {
    setSearchHistory((prev) => {
      const newHistory = [
        {
          id: `${Date.now()}-${value}`,
          query: value,
          type,
          timestamp: Date.now(),
        },
        ...prev.filter((h) => h.query !== value).slice(0, 9), // Keep last 10 unique searches
      ];
      localStorage.setItem(
        "transponder-search-history",
        JSON.stringify(newHistory)
      );
      return newHistory;
    });
  };

  // Load search history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("transponder-search-history");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse search history:", error);
      }
    }
  }, []);

  // Update the SearchField component
  const SearchField = () => (
    <div className="flex-1 relative">
      <div className="flex gap-2">
        <Combobox
          value={searchQuery}
          onChange={(value: string) => {
            setSearchQuery(value);
            handleSearchSelection(value);
            if (value) {
              const suggestion = generateSuggestions.find(
                (s) => s.value === value
              );
              if (suggestion) {
                addToSearchHistory(value, suggestion.type);
              }
            }
          }}
        >
          <div className="relative w-full">
            <div className="relative">
              <Search
                className={`absolute left-3 top-2.5 h-5 w-5 ${
                  isLoadingSuggestions
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-400"
                }`}
              />
              <Combobox.Input
                className="pl-10 pr-10 py-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="Search makes, models, or transponders..."
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchQuery(value);
                  handleSearch(value);
                }}
                value={searchQuery}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults(null);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-20">
              <Tab.Group>
                <Tab.List className="flex space-x-1 p-1">
                  {categories.map((category) => (
                    <Tab
                      key={category.id}
                      className={({ selected }) =>
                        `px-3 py-1.5 text-sm rounded-md transition-colors ${
                          selected
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      {category.name}
                    </Tab>
                  ))}
                </Tab.List>
              </Tab.Group>
            </div>

            {/* Enhanced Suggestions Display */}
            <Transition
              show={!!searchQuery}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Combobox.Options className="absolute z-10 mt-12 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredSuggestions.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                    Nothing found.
                  </div>
                ) : (
                  filteredSuggestions.map((suggestion) => (
                    <Combobox.Option
                      key={suggestion.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-blue-600 text-white dark:bg-blue-900 dark:text-blue-100"
                            : "text-gray-900 dark:text-gray-100"
                        }`
                      }
                      value={suggestion.value}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {suggestion.value}
                            <span
                              className={`ml-2 text-sm ${
                                active
                                  ? "text-blue-100"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              {suggestion.type}
                            </span>
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>

        {/* Enhanced History Button */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`px-3 py-2 rounded-md border relative ${
            showHistory
              ? "bg-blue-50 border-blue-200 text-blue-600"
              : "bg-white border-gray-200 text-gray-600"
          }`}
        >
          <Clock className="h-5 w-5" />
          {searchHistory.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-blue-500 text-white rounded-full">
              {searchHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* Search History Dropdown */}
      <AnimatePresence>
        {showHistory && searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700"
          >
            <div className="p-2 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Recent Searches
              </h3>
              <button
                onClick={() => {
                  setSearchHistory([]);
                  localStorage.removeItem("transponder-search-history");
                }}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Clear search history"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {searchHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSearchQuery(item.query);
                    handleSearchSelection(item.query);
                    setShowHistory(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-900 dark:text-gray-100">
                      {item.query}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="ml-auto text-xs text-gray-500 capitalize">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Add loading state components
  const LoadingOverlay = ({
    children,
    loading,
  }: {
    children: React.ReactNode;
    loading: boolean;
  }) => (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      )}
      {children}
    </div>
  );

  const LoadingIndicator = ({ message }: { message: string }) => (
    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{message}</span>
    </div>
  );

  // Enhanced results display component
  const TransponderCard = ({
    transponder,
  }: {
    transponder: TransponderKeyData;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {transponder.transponderType}
            </h4>
            {transponder.dualSystem && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                Dual System
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {transponder.make} {transponder.model}
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {transponder.yearStart} - {transponder.yearEnd || "Present"}
            </span>
          </div>
        </div>
        {transponder.frequency && (
          <span className="text-sm px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {transponder.frequency}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Chip Types:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {transponder.chipType.map((chip) => (
              <span
                key={chip}
                className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {transponder.compatibleParts &&
          transponder.compatibleParts.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Compatible Parts:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {transponder.compatibleParts.map((part) => (
                  <span
                    key={part}
                    className="px-2 py-1 text-xs rounded bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          )}

        {transponder.notes && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
            {transponder.notes}
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => handleCompareToggle(transponder)}
          className="text-sm px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        >
          Compare
        </button>
        <button
          onClick={() => handleDetails(transponder)}
          className="text-sm px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Details
        </button>
      </div>
    </motion.div>
  );

  // Add popular searches component
  const PopularSearches = () => (
    <div className="mt-2">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Popular Searches
      </h4>
      <div className="mt-1 flex flex-wrap gap-2">
        {popularSearches.map(({ query, count }) => (
          <button
            key={query}
            onClick={() => {
              setSearchQuery(query);
              handleSearch(query);
            }}
            className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1"
          >
            <span>{query}</span>
            <span className="text-gray-400">({count})</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Memoize filters to prevent unnecessary re-renders
  const filtersMemo = useMemo(() => {
    const filter: TransponderFilters = {};
    if (selectedMake) filter.make = selectedMake;
    if (selectedModel) filter.model = selectedModel;
    if (searchQuery) filter.searchTerm = searchQuery;
    return filter;
  }, [selectedMake, selectedModel, searchQuery]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchQuery(term);
    }, 300),
    []
  );

  // Fetch transponders with optimized query
  const {
    data: filteredTransponders = [],
    isLoading: isLoadingFilteredTransponders,
  } = useQuery({
    queryKey: ["transponders", filtersMemo],
    queryFn: async () => {
      const response = await fetch("/api/transponders/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtersMemo),
      });
      if (!response.ok) throw new Error("Failed to fetch transponders");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    keepPreviousData: true, // Keep showing previous results while loading
  });

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="space-y-6">
        {/* Loading Status Bar */}
        {Object.entries(loadingStates).some(([_, isLoading]) => isLoading) && (
          <div className="fixed top-0 left-0 right-0 bg-blue-500 h-1 z-50">
            <div className="h-full bg-blue-300 animate-pulse" />
          </div>
        )}

        {/* Loading States Display */}
        <div className="space-y-1">
          {Object.entries(loadingStates).map(
            ([key, isLoading]) =>
              isLoading && (
                <LoadingIndicator
                  key={key}
                  message={`Loading ${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }...`}
                />
              )
          )}
        </div>

        {/* Wrap sections with LoadingOverlay */}
        <LoadingOverlay loading={loadingStates.makes || loadingStates.models}>
          {/* Show validation errors if any */}
          {validationErrors.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
              <h4 className="text-yellow-800 dark:text-yellow-200 font-medium">
                Data Validation Warnings
              </h4>
              <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchField />
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 flex items-center gap-2 bg-white dark:bg-gray-700 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                title="Toggle filter options"
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-4 py-2 flex items-center gap-2 border rounded-md ${
                  compareMode
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <SplitSquareHorizontal className="h-5 w-5" />
                Compare
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && filters && <FilterPanel />}
          </AnimatePresence>

          {/* Selection Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make Selection */}
            <Listbox value={selectedMake} onChange={handleMakeChange}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-blue-500 dark:focus-visible:border-blue-400">
                  <span className="block truncate">
                    {selectedMake ? selectedMake.MakeName : "Select Make"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {makes.map((make) => (
                      <Listbox.Option
                        key={make.MakeId}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-blue-600 text-white dark:bg-blue-900 dark:text-blue-100"
                              : "text-gray-900 dark:text-gray-100"
                          }`
                        }
                        value={make}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {make.MakeName}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active
                                    ? "text-white dark:text-blue-100"
                                    : "text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

            {/* Model Selection */}
            <Listbox
              value={selectedModel}
              onChange={handleModelChange}
              disabled={!selectedMake}
            >
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-blue-500 dark:focus-visible:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="block truncate">
                    {selectedModel ? selectedModel.ModelName : "Select Model"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {models.map((model) => (
                      <Listbox.Option
                        key={model.ModelId}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-blue-600 text-white dark:bg-blue-900 dark:text-blue-100"
                              : "text-gray-900 dark:text-gray-100"
                          }`
                        }
                        value={model}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {model.ModelName}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active
                                    ? "text-white dark:text-blue-100"
                                    : "text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </LoadingOverlay>

        <LoadingOverlay loading={loadingStates.transponders}>
          {/* Comparison View */}
          {compareMode && comparedTransponders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Feature
                    </th>
                    {comparedTransponders.map((t) => (
                      <th
                        key={t.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {t.transponderType}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Comparison rows */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      Chip Types
                    </td>
                    {comparedTransponders.map((t) => (
                      <td
                        key={t.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                      >
                        {t.chipType.join(", ")}
                      </td>
                    ))}
                  </tr>
                  {/* Add more comparison rows */}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {filteredTransponders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Compatible Transponders
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTransponders.map((transponder) => (
                    <TransponderCard
                      key={transponder.id}
                      transponder={transponder}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LoadingOverlay>
      </div>
    </ErrorBoundary>
  );
}
