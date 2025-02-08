import { useState, useMemo } from 'react';
import { Search, ChipIcon, Key, Info } from 'lucide-react';
import { TransponderKeyData } from '@/app/services/transponderService';

interface TransponderIdentifierProps {
  data: TransponderKeyData[];
  onSelect?: (transponder: TransponderKeyData) => void;
}

export default function TransponderIdentifier({ data, onSelect }: TransponderIdentifierProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'make' | 'chip' | 'year'>('make');
  const [selectedTransponder, setSelectedTransponder] = useState<TransponderKeyData | null>(null);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(item => {
      switch (filterType) {
        case 'make':
          return `${item.make} ${item.model}`.toLowerCase().includes(term);
        case 'chip':
          return item.chipType.some(chip => chip.toLowerCase().includes(term));
        case 'year':
          return item.yearStart.toString().includes(term) || 
                 (item.yearEnd?.toString() || '').includes(term);
        default:
          return false;
      }
    });
  }, [data, searchTerm, filterType]);

  const compatibleTransponders = useMemo(() => {
    if (!selectedTransponder) return [];
    return data.filter(item => 
      item.id !== selectedTransponder.id && 
      item.chipType.some(chip => selectedTransponder.chipType.includes(chip))
    );
  }, [data, selectedTransponder]);

  const handleTransponderSelect = (transponder: TransponderKeyData) => {
    setSelectedTransponder(transponder);
    onSelect?.(transponder);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transponders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md dark:bg-gray-800"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'make' | 'chip' | 'year')}
          className="px-4 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="make">Make/Model</option>
          <option value="chip">Chip Type</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((transponder) => (
          <div
            key={`${transponder.make}-${transponder.model}-${transponder.yearStart}`}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedTransponder?.id === transponder.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handleTransponderSelect(transponder)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{transponder.make} {transponder.model}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {transponder.yearStart}{transponder.yearEnd ? `-${transponder.yearEnd}` : '+'}
                </p>
              </div>
              <ChipIcon className="h-5 w-5 text-blue-500" />
            </div>
            
            <div className="mt-2">
              <p className="text-sm font-medium">System: {transponder.transponderType}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {transponder.chipType.map((chip) => (
                  <span
                    key={chip}
                    className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Transponder Details */}
      {selectedTransponder && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Selected Transponder Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">System Information</h4>
              <dl className="space-y-1">
                <dt className="text-sm text-gray-500">Type</dt>
                <dd>{selectedTransponder.transponderType}</dd>
                <dt className="text-sm text-gray-500 mt-2">Compatible Chips</dt>
                <dd className="flex flex-wrap gap-1">
                  {selectedTransponder.chipType.map((chip) => (
                    <span key={chip} className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 rounded">
                      {chip}
                    </span>
                  ))}
                </dd>
              </dl>
            </div>

            {selectedTransponder.compatibleParts && (
              <div>
                <h4 className="font-medium mb-2">Compatible Parts</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedTransponder.compatibleParts.map((part) => (
                    <span key={part} className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 rounded">
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compatible Vehicles Section */}
          {compatibleTransponders.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Vehicles with Compatible Transponders</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {compatibleTransponders.map((transponder) => (
                  <div
                    key={`${transponder.make}-${transponder.model}-${transponder.yearStart}`}
                    className="p-2 text-sm border rounded"
                  >
                    <p className="font-medium">{transponder.make} {transponder.model}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {transponder.yearStart}{transponder.yearEnd ? `-${transponder.yearEnd}` : '+'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 