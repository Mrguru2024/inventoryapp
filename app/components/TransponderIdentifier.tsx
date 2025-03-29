"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import {
  vehicleService,
  Make,
  Model,
  Year,
} from "@/app/services/vehicleService";
import {
  TransponderKeyData,
  TransponderSearchParams,
} from "@/app/services/transponderService";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Loader2, Search, RefreshCcw } from "lucide-react";
import { useToast } from "@/app/components/ui/use-toast";

interface TransponderIdentifierProps {
  data: TransponderKeyData[];
  onSelect: (transponder: TransponderKeyData) => void;
  onSearch: (params: TransponderSearchParams) => void;
}

export default function TransponderIdentifier({
  data,
  onSelect,
  onSearch,
}: TransponderIdentifierProps) {
  const [mounted, setMounted] = useState(false);
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { toast } = useToast();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load makes on mount
  useEffect(() => {
    if (mounted) {
      loadMakes();
    }
  }, [mounted]);

  // Load models when make changes
  useEffect(() => {
    if (mounted && selectedMake) {
      loadModels(selectedMake);
    }
  }, [mounted, selectedMake]);

  // Load years when model changes
  useEffect(() => {
    if (mounted && selectedMake && selectedModel) {
      loadYears(selectedMake, selectedModel);
    }
  }, [mounted, selectedMake, selectedModel]);

  // Memoize the search parameters
  const searchParams = useMemo(() => {
    const params: TransponderSearchParams = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedMake) params.make = selectedMake;
    if (selectedModel) params.model = selectedModel;
    if (selectedYear) params.year = selectedYear;
    return params;
  }, [debouncedSearch, selectedMake, selectedModel, selectedYear]);

  // Trigger search when params change, but only if we have actual changes
  useEffect(() => {
    if (mounted && Object.keys(searchParams).length > 0) {
      onSearch(searchParams);
    }
  }, [mounted, searchParams, onSearch]);

  const loadMakes = useCallback(async () => {
    setIsLoading(true);
    try {
      const makesData = await vehicleService.getAllMakes();
      setMakes(makesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vehicle makes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadModels = useCallback(
    async (make: string) => {
      setIsLoadingModels(true);
      try {
        const modelsData = await vehicleService.getModelsForMake(make);
        setModels(modelsData);
        setSelectedModel("");
        setSelectedYear("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load vehicle models",
          variant: "destructive",
        });
      } finally {
        setIsLoadingModels(false);
      }
    },
    [toast]
  );

  const loadYears = useCallback(
    async (make: string, model: string) => {
      setIsLoadingYears(true);
      try {
        const yearsData = await vehicleService.getYearsForModel(make, model);
        setYears(yearsData);
        setSelectedYear("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load vehicle years",
          variant: "destructive",
        });
      } finally {
        setIsLoadingYears(false);
      }
    },
    [toast]
  );

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setSelectedMake("");
    setSelectedModel("");
    setSelectedYear("");
    setModels([]);
    setYears([]);
  }, []);

  const handleSearchChange = useCallback(
    (type: "make" | "model" | "year" | "search", value: string) => {
      // Batch state updates
      const updates = () => {
        switch (type) {
          case "make":
            setSelectedMake(value);
            setSelectedModel("");
            setSelectedYear("");
            break;
          case "model":
            setSelectedModel(value);
            setSelectedYear("");
            break;
          case "year":
            setSelectedYear(value);
            break;
          case "search":
            setSearchTerm(value);
            break;
        }
      };

      // Execute all state updates
      updates();

      // Only trigger search if we have a value
      if (value) {
        const params: TransponderSearchParams = {};
        switch (type) {
          case "make":
            params.make = value.toUpperCase();
            break;
          case "model":
            params.model = value.toUpperCase();
            break;
          case "year":
            params.year = value;
            break;
          case "search":
            params.search = value;
            break;
        }
        onSearch(params);
      }
    },
    [onSearch]
  );

  const handleTransponderSelect = useCallback(
    (transponder: TransponderKeyData) => {
      onSelect(transponder);
    },
    [onSelect]
  );

  // Memoize the filtered data
  const filteredData = useMemo(() => {
    return data.filter((transponder) => {
      const matchesSearch =
        !searchTerm ||
        transponder.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transponder.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transponder.transponderType
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesMake = !selectedMake || transponder.make === selectedMake;
      const matchesModel =
        !selectedModel || transponder.model === selectedModel;
      const matchesYear =
        !selectedYear || transponder.year.toString() === selectedYear;
      return matchesSearch && matchesMake && matchesModel && matchesYear;
    });
  }, [data, searchTerm, selectedMake, selectedModel, selectedYear]);

  if (!mounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vehicle Search</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by make, model, or transponder type..."
              value={searchTerm}
              onChange={(e) => handleSearchChange("search", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            value={selectedMake}
            onValueChange={(value) => handleSearchChange("make", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map((make, index) => (
                <SelectItem
                  key={`make-${make.MakeId || make.MakeName}-${index}`}
                  value={make.MakeName}
                >
                  {make.MakeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedModel}
            onValueChange={(value) => handleSearchChange("model", value)}
            disabled={!selectedMake || isLoadingModels}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model, index) => (
                <SelectItem
                  key={`model-${model.ModelId || model.ModelName}-${index}`}
                  value={model.ModelName}
                >
                  {model.ModelName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear}
            onValueChange={(value) => handleSearchChange("year", value)}
            disabled={!selectedModel || isLoadingYears}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year, index) => (
                <SelectItem
                  key={`year-${year.Year || index}`}
                  value={year.Year?.toString() || ""}
                >
                  {year.Year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(isLoading || isLoadingModels || isLoadingYears) && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Found {filteredData.length} transponders
            </h3>
            <div className="space-y-2">
              {filteredData.map((transponder) => (
                <div
                  key={transponder.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleTransponderSelect(transponder)}
                >
                  <div className="font-medium">
                    {transponder.transponderType}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transponder.make} {transponder.model} ({transponder.year})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
