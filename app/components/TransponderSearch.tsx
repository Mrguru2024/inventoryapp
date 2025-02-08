'use client';

import { useState, useEffect, Fragment } from 'react';
import Fuse from 'fuse.js';
import { TransponderKeyData } from '@/app/services/transponderService';
import { Combobox, Disclosure, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, FunnelIcon, ChevronUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface SearchResult {
  item: TransponderKeyData;
  matches: Array<{
    key: string;
    value: string;
    indices: number[][];
  }>;
}

interface Filters {
  make: string;
  yearRange: {
    start: number;
    end: number;
  };
  transponderType: string;
  chipType: string;
  frequency: string;
  hasCompatibleParts: boolean;
}

interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
}

export default function TransponderSearch({ data }: { data: TransponderKeyData[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<TransponderKeyData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced filters
  const [filters, setFilters] = useState<Filters>({
    make: '',
    yearRange: {
      start: 1980,
      end: new Date().getFullYear(),
    },
    transponderType: '',
    chipType: '',
    frequency: '',
    hasCompatibleParts: false,
  });

  // Extract unique values for filters
  const makes = Array.from(new Set(data.map(item => item.make))).sort();
  const transponderTypes = Array.from(new Set(data.map(item => item.transponderType))).sort();
  const chipTypes = Array.from(new Set(data.flatMap(item => 
    Array.isArray(item.chipType) ? item.chipType : [item.chipType]
  ))).sort();

  const fuse = new Fuse(data, {
    keys: [
      { name: 'make', weight: 2 },
      { name: 'model', weight: 2 },
      { name: 'yearStart', weight: 1 },
      { name: 'yearEnd', weight: 1 },
      { name: 'chipType', weight: 1.5 },
      { name: 'transponderType', weight: 1.5 },
    ],
    includeMatches: true,
    threshold: 0.3,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });

  // Validation function
  const validateData = (data: TransponderKeyData[]): boolean => {
    if (!Array.isArray(data)) {
      setError({ message: 'Invalid data format received', type: 'error' });
      return false;
    }
    if (data.length === 0) {
      setError({ message: 'No transponder data available', type: 'warning' });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!validateData(data)) return;

    setIsLoading(true);
    try {
      // Show all results when no query
      if (query.length === 0) {
        let filteredResults = data;

        // Apply filters
        if (filters.make) {
          filteredResults = filteredResults.filter(item => item.make === filters.make);
        }
        if (filters.transponderType) {
          filteredResults = filteredResults.filter(item => item.transponderType === filters.transponderType);
        }
        if (filters.chipType) {
          filteredResults = filteredResults.filter(item => 
            Array.isArray(item.chipType) 
              ? item.chipType.includes(filters.chipType)
              : item.chipType === filters.chipType
          );
        }
        if (filters.hasCompatibleParts) {
          filteredResults = filteredResults.filter(item => 
            item.compatibleParts && 
            (Array.isArray(item.compatibleParts) ? item.compatibleParts.length > 0 : true)
          );
        }

        setResults(filteredResults.map(item => ({ item, matches: [] })));
        if (filteredResults.length === 0) {
          setError({ message: 'No results match your filters', type: 'info' });
        } else {
          setError(null);
        }
        return;
      }

      // Search when query exists
      if (query.length >= 2) {
        const searchResults = fuse.search(query);
        setResults(searchResults);
        if (searchResults.length === 0) {
          setError({ message: 'No results found for your search', type: 'info' });
        } else {
          setError(null);
        }
      }
    } catch (err) {
      setError({ 
        message: 'An error occurred while searching', 
        type: 'error' 
      });
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, data]);

  return (
    <div className="w-full">
      {error && (
        <div className={`mb-4 rounded-lg p-4 ${
          error.type === 'error' ? 'bg-red-50 text-red-700' :
          error.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            {error.message}
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Combobox value={selectedItem} onChange={setSelectedItem}>
            <div className="relative">
              <div className="relative w-full">
                <MagnifyingGlassIcon 
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-gray-900 shadow-sm focus:border-gray-300 focus:ring-0 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-gray-600"
                  placeholder="Search by make, model, year, or chip type..."
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(item: TransponderKeyData) => 
                    item ? `${item.make} ${item.model} (${item.yearStart})` : ''
                  }
                />
              </div>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 sm:text-sm">
                  {results.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-300">
                      Nothing found.
                    </div>
                  ) : (
                    results.map(({ item, matches }) => (
                      <Combobox.Option
                        key={`${item.make}-${item.model}-${item.yearStart}`}
                        value={item}
                        className={({ active }) =>
                          `relative cursor-default select-none py-3 pl-4 pr-9 ${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`
                        }
                      >
                        {({ active }) => (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${active ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {item.make} {item.model}
                              </span>
                              <span className={`ml-2 text-sm ${active ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                {item.yearStart}{item.yearEnd ? `-${item.yearEnd}` : ''}
                              </span>
                            </div>
                            <div className={`mt-1 text-sm ${active ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                              {item.transponderType}
                            </div>
                            <div className={`mt-1 text-sm ${active ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                              Chip: {Array.isArray(item.chipType) ? item.chipType.join(', ') : item.chipType}
                            </div>
                          </div>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>

        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5" />
                Filters
                <ChevronUpIcon
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="absolute right-0 mt-12 w-96 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Make</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={filters.make}
                      onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                    >
                      <option value="">All Makes</option>
                      {makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year Range</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="number"
                        min="1980"
                        max={new Date().getFullYear()}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={filters.yearRange.start}
                        onChange={(e) => setFilters({
                          ...filters,
                          yearRange: { ...filters.yearRange, start: parseInt(e.target.value) }
                        })}
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        min="1980"
                        max={new Date().getFullYear()}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={filters.yearRange.end}
                        onChange={(e) => setFilters({
                          ...filters,
                          yearRange: { ...filters.yearRange, end: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transponder Type</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={filters.transponderType}
                      onChange={(e) => setFilters({ ...filters, transponderType: e.target.value })}
                    >
                      <option value="">All Types</option>
                      {transponderTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chip Type</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={filters.chipType}
                      onChange={(e) => setFilters({ ...filters, chipType: e.target.value })}
                    >
                      <option value="">All Chips</option>
                      {chipTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setFilters({
                      make: '',
                      yearRange: {
                        start: 1980,
                        end: new Date().getFullYear(),
                      },
                      transponderType: '',
                      chipType: '',
                    })}
                  >
                    Reset Filters
                  </button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>

      {selectedItem && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900">Selected Transponder Details</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vehicle</h3>
              <p className="mt-1 text-sm text-gray-900">
                {selectedItem.make} {selectedItem.model} ({selectedItem.yearStart}
                {selectedItem.yearEnd ? `-${selectedItem.yearEnd}` : ''})
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Transponder Type</h3>
              <p className="mt-1 text-sm text-gray-900">{selectedItem.transponderType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Chip Type</h3>
              <p className="mt-1 text-sm text-gray-900">
                {Array.isArray(selectedItem.chipType) 
                  ? selectedItem.chipType.join(', ') 
                  : selectedItem.chipType}
              </p>
            </div>
            {selectedItem.compatibleParts && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Compatible Parts</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {Array.isArray(selectedItem.compatibleParts) 
                    ? selectedItem.compatibleParts.join(', ') 
                    : selectedItem.compatibleParts}
                </p>
              </div>
            )}
            {selectedItem.notes && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 