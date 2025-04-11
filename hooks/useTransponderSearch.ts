import { useState } from "react";

interface TransponderSearchResult {
  id: string;
  name: string;
  frequency: string;
  manufacturer: string;
  compatibleModels: string[];
}

export function useTransponderSearch() {
  const [results, setResults] = useState<TransponderSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call
      const response = await fetch(`/api/transponders/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    results,
    isLoading,
    error,
  };
}
