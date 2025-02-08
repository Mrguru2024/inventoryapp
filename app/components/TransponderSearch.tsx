'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchTransponders } from '@/app/services/transponderService';
import LoadingSpinner from './LoadingSpinner';
import type { TransponderData } from '@/app/services/transponderService';
import { useDebounce } from '@/app/hooks/useDebounce';

export default function TransponderSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Debug logs
  useEffect(() => {
    console.log('Search term:', searchTerm);
    console.log('Debounced term:', debouncedSearchTerm);
  }, [searchTerm, debouncedSearchTerm]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['transponderSearch', debouncedSearchTerm],
    queryFn: () => searchTransponders(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Debug log
  useEffect(() => {
    console.log('Query results:', results);
  }, [results]);

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search by make, model, or transponder type..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          {isLoading && (
            <div className="absolute right-3 top-2">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {results && results.length > 0 && (
          <div className="space-y-4">
            {results.map((transponder: TransponderData) => (
              <div
                key={`${transponder.make}-${transponder.model}-${transponder.yearStart}`}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">
                  {transponder.make} {transponder.model} ({transponder.yearStart}
                  {transponder.yearEnd ? `-${transponder.yearEnd}` : '+'})
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Type: {transponder.transponderType}</p>
                  <p>Chip: {Array.isArray(transponder.chipType) 
                    ? transponder.chipType.join(', ') 
                    : transponder.chipType}
                  </p>
                  {transponder.compatibleParts && (
                    <div className="mt-2">
                      <p className="font-medium">Compatible Parts:</p>
                      <ul className="list-disc list-inside pl-4">
                        {Array.isArray(transponder.compatibleParts) ? (
                          transponder.compatibleParts.map(part => (
                            <li key={part} className="text-sm">
                              {part}
                              {AFTERMARKET_CROSS_REF[transponder.make]?.map(ref => 
                                ref.oem === part && (
                                  <span className="text-gray-500 ml-2">
                                    (Aftermarket: {ref.aftermarket.join(', ')})
                                    {ref.notes && <span className="italic"> - {ref.notes}</span>}
                                  </span>
                                )
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm">{transponder.compatibleParts}</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {transponder.notes && (
                    <p className="mt-1 text-gray-500">{transponder.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {searchTerm && results?.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 mt-8">
            No transponders found matching your search.
          </div>
        )}
      </div>
    </div>
  );
} 