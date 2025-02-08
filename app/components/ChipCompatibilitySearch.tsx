'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { TransponderKeyData } from '@/app/services/transponderService';

interface ChipSearchProps {
  transponders: TransponderKeyData[];
  onSelect?: (transponder: TransponderKeyData) => void;
}

export default function ChipCompatibilitySearch({ transponders, onSelect }: ChipSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChip, setSelectedChip] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const allChipTypes = useMemo(() => {
    const chips = new Set<string>();
    transponders.forEach(t => t.chipType.forEach(chip => chips.add(chip)));
    return Array.from(chips).sort();
  }, [transponders]);

  const filteredResults = useMemo(() => {
    if (!searchTerm && !selectedChip) return [];
    
    return transponders.filter(t => {
      const matchesSearch = searchTerm ? 
        `${t.make} ${t.model}`.toLowerCase().includes(searchTerm.toLowerCase()) :
        true;
      
      const matchesChip = selectedChip ?
        t.chipType.includes(selectedChip) :
        true;
        
      return matchesSearch && matchesChip;
    });
  }, [transponders, searchTerm, selectedChip]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search make/model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        {/* Chip Type Filter */}
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full md:w-64 px-4 py-2 text-left border rounded-md flex items-center justify-between dark:bg-gray-800 dark:border-gray-700"
          >
            <span>{selectedChip || 'Select Chip Type'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isExpanded && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2">
                {allChipTypes.map(chip => (
                  <button
                    key={chip}
                    onClick={() => {
                      setSelectedChip(chip === selectedChip ? '' : chip);
                      setIsExpanded(false);
                    }}
                    className={`w-full px-3 py-2 text-left rounded-md ${
                      chip === selectedChip 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults.map(transponder => (
            <button
              key={`${transponder.make}-${transponder.model}-${transponder.yearStart}`}
              onClick={() => onSelect?.(transponder)}
              className="p-4 text-left border rounded-lg hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {transponder.make} {transponder.model}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {transponder.yearStart}{transponder.yearEnd ? `-${transponder.yearEnd}` : '+'}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {transponder.chipType.map(chip => (
                  <span
                    key={chip}
                    className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 