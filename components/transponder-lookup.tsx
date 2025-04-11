import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Transponder {
  id: string;
  name: string;
  frequency: string;
  description?: string;
}

interface TransponderLookupProps {
  initialResults?: Transponder[];
  isLoading?: boolean;
  error?: string;
  darkMode?: boolean;
  onSelect?: (transponder: Transponder) => void;
}

export default function TransponderLookup({
  initialResults = [],
  isLoading = false,
  error,
  darkMode = false,
  onSelect,
}: TransponderLookupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState(initialResults);

  const handleSearch = () => {
    // In a real implementation, this would make an API call
    console.log("Searching for:", searchQuery);
  };

  const handleSelect = (transponder: Transponder) => {
    if (onSelect) {
      onSelect(transponder);
    }
  };

  return (
    <div
      data-testid="transponder-lookup"
      className={`p-4 rounded-lg ${
        darkMode ? "dark:bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search transponders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isLoading ? (
        <div data-testid="loading-skeleton" className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-500">Error</p>
          <p>{error}</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          {results.map((transponder) => (
            <Card
              key={transponder.id}
              className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleSelect(transponder)}
            >
              <h3 className="font-medium">{transponder.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {transponder.frequency}
              </p>
              {transponder.description && (
                <p className="text-sm mt-1">{transponder.description}</p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center py-4">No results found</p>
      )}
    </div>
  );
}
