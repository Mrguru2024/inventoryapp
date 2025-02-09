'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchTransponders } from '@/app/services/transponderService';
import LoadingSpinner from './LoadingSpinner';
import type { TransponderData } from '@/app/services/transponderService';
import { useDebounce } from '@/app/hooks/useDebounce';
import { AFTERMARKET_CROSS_REF } from '@/app/lib/transponder-data';

export default function TransponderSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYearRange, setSelectedYearRange] = useState<string>('');
  const [selectedTransponderType, setSelectedTransponderType] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch data with filters
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['transponders', debouncedSearchTerm, selectedMake, selectedModel, selectedTransponderType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (selectedMake) params.append('make', selectedMake);
      if (selectedModel) params.append('model', selectedModel);
      if (selectedTransponderType) params.append('type', selectedTransponderType);

      const queryString = params.toString();
      const url = `/api/transponders${queryString ? `?${queryString}` : ''}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // First filter the results based on search term
  const searchFilteredResults = useMemo(() => {
    if (!results || !Array.isArray(results)) return [];
    if (!debouncedSearchTerm) return results;

    return results.filter(transponder => {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const searchFields = [
        transponder.make,
        transponder.model,
        transponder.transponderType,
        transponder.chipType
      ].map(field => String(field || '').toLowerCase());

      return searchFields.some(field => field.includes(searchLower));
    });
  }, [results, debouncedSearchTerm]);

  // Then apply the dropdown filters
  const filteredResults = useMemo(() => {
    return searchFilteredResults.filter(transponder => {
      // Make filter
      if (selectedMake && transponder.make.toUpperCase() !== selectedMake.toUpperCase()) {
        return false;
      }

      // Model filter
      if (selectedModel && transponder.model.toUpperCase() !== selectedModel.toUpperCase()) {
        return false;
      }

      // Transponder type filter
      if (selectedTransponderType && 
          transponder.transponderType.toUpperCase() !== selectedTransponderType.toUpperCase()) {
        return false;
      }

      return true;
    });
  }, [searchFilteredResults, selectedMake, selectedModel, selectedTransponderType]);

  // Extract unique values for dropdowns
  const { makes, models, transponderTypes } = useMemo(() => {
    const uniqueMakes = [...new Set(results.map(r => r.make))].sort();
    
    const availableModels = [...new Set(
      results
        .filter(r => !selectedMake || r.make === selectedMake)
        .map(r => r.model)
    )].sort();

    const uniqueTypes = [...new Set(
      results
        .filter(r => {
          const makeMatch = !selectedMake || r.make === selectedMake;
          const modelMatch = !selectedModel || r.model === selectedModel;
          return makeMatch && modelMatch;
        })
        .map(r => r.transponderType)
    )].sort();

    return { makes: uniqueMakes, models: availableModels, transponderTypes: uniqueTypes };
  }, [results, selectedMake, selectedModel]);

  // Reset dependent filters
  useEffect(() => {
    if (selectedMake) {
      setSelectedModel('');
      setSelectedTransponderType('');
    }
  }, [selectedMake]);

  useEffect(() => {
    if (selectedModel) {
      setSelectedTransponderType('');
    }
  }, [selectedModel]);

  // Debug logging
  useEffect(() => {
    console.log('Current State:', {
      totalResults: results.length,
      makes: makes.length,
      models: models.length,
      types: transponderTypes.length,
      selectedMake,
      selectedModel,
      selectedType: selectedTransponderType
    });
  }, [results, makes, models, transponderTypes, selectedMake, selectedModel, selectedTransponderType]);

  // Reset filters
  const resetFilters = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedTransponderType('');
    setSearchTerm('');
  };

  // Debug logs
  useEffect(() => {
    console.log('Current state:', {
      makes,
      selectedMake,
      models,
      selectedModel,
      filteredResults: filteredResults.length
    });
  }, [makes, selectedMake, models, selectedModel, filteredResults]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 
        p-4 sm:p-6 rounded-t-xl">
        <div className="max-w-3xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Transponder Search
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Search and filter transponder information by make, model, and type
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {/* Search and Filter Controls */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by make, model, or transponder type..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg 
                focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 
                dark:text-gray-100 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <LoadingSpinner />
              </div>
            )}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Make Filter */}
            <select
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
            >
              <option value="">All Makes</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>

            {/* Model Filter */}
            <select
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
            >
              <option value="">All Models</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>

            {/* Transponder Type Filter */}
            <select
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={selectedTransponderType}
              onChange={(e) => setSelectedTransponderType(e.target.value)}
            >
              <option value="">All Transponder Types</option>
              {transponderTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {(selectedMake || selectedModel || selectedTransponderType) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Active Filters:</span>
              {selectedMake && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm 
                  text-blue-800 dark:text-blue-100">
                  Make: {selectedMake}
                </span>
              )}
              {selectedModel && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm 
                  text-blue-800 dark:text-blue-100">
                  Model: {selectedModel}
                </span>
              )}
              {selectedTransponderType && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm 
                  text-blue-800 dark:text-blue-100">
                  Type: {selectedTransponderType}
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-auto"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Results
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          {/* Results Grid */}
          {filteredResults && filteredResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredResults.map((transponder: TransponderData) => (
                <div
                  key={`${transponder.make}-${transponder.model}-${transponder.yearStart}`}
                  className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 
                    rounded-lg p-5 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                        {transponder.make} {transponder.model}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transponder.yearStart}
                        {transponder.yearEnd ? `-${transponder.yearEnd}` : '+'}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full 
                        text-sm text-blue-800 dark:text-blue-100 whitespace-nowrap">
                        {transponder.transponderType}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-4 text-sm">
                    {/* Chip Type */}
                    <div className="flex flex-wrap gap-x-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Chip:</span>
                      <span className="text-gray-600 dark:text-gray-400 break-words">
                        {Array.isArray(transponder.chipType) 
                          ? transponder.chipType.join(', ') 
                          : transponder.chipType}
                      </span>
                    </div>

                    {/* Compatible Parts */}
                    {transponder.compatibleParts && (
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Compatible Parts:
                        </p>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400 pl-4">
                          {Array.isArray(transponder.compatibleParts) ? (
                            transponder.compatibleParts.map(part => (
                              <li key={part} className="flex flex-col">
                                <span className="break-words">{part}</span>
                                {AFTERMARKET_CROSS_REF[transponder.make]?.map(ref => 
                                  ref.oem === part && (
                                    <span 
                                      key={ref.oem} 
                                      className="text-gray-500 dark:text-gray-400 text-sm mt-1 pl-4"
                                    >
                                      Aftermarket: {ref.aftermarket.join(', ')}
                                    </span>
                                  )
                                )}
                              </li>
                            ))
                          ) : (
                            <li className="break-words">{transponder.compatibleParts}</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Notes */}
                    {transponder.notes && (
                      <p className="italic text-gray-500 dark:text-gray-400 break-words">
                        {transponder.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {searchTerm && filteredResults?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No transponders found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 