'use client';

import { useState, useCallback } from 'react';
import { TransponderKeyData } from '@/app/services/transponderService';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronDown, 
  RotateCcw,
  SortAsc,
  SortDesc 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { makes, getModelsForMakeAndYear, years } from '@/app/data/vehicleData';
import { getTranspondersByVehicle } from '@/app/services/transponderService';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

type SortField = 'chipType' | 'transponderType' | 'frequency';
type SortOrder = 'asc' | 'desc';

export default function ChipCompatibilitySearch() {
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [results, setResults] = useState<TransponderKeyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [chipTypeFilter, setChipTypeFilter] = useState<string>('');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('');
  const [transponderTypeFilter, setTransponderTypeFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('chipType');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const availableModels = selectedMake && selectedYear 
    ? getModelsForMakeAndYear(selectedMake, selectedYear)
    : [];

  const resetFilters = () => {
    setChipTypeFilter('');
    setFrequencyFilter('');
    setTransponderTypeFilter('');
    setSortField('chipType');
    setSortOrder('asc');
  };

  const resetAll = () => {
    resetFilters();
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setResults([]);
    setError(null);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedResults = results
    .filter(transponder => {
      const matchesChipType = !chipTypeFilter || 
        transponder.chipType.toLowerCase().includes(chipTypeFilter.toLowerCase());
      const matchesFrequency = !frequencyFilter || 
        transponder.frequency.toLowerCase().includes(frequencyFilter.toLowerCase());
      const matchesTransponderType = !transponderTypeFilter || 
        transponder.transponderType.toLowerCase().includes(transponderTypeFilter.toLowerCase());
      
      return matchesChipType && matchesFrequency && matchesTransponderType;
    })
    .sort((a, b) => {
      const compareValue = (aVal: string, bVal: string) => {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      };

      return compareValue(a[sortField], b[sortField]);
    });

  const handleSearch = useCallback(async () => {
    if (!selectedMake || !selectedModel || !selectedYear) {
      setError('Please select all vehicle details');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const transponders = await getTranspondersByVehicle(
        selectedMake,
        selectedModel,
        selectedYear
      );
      setResults(transponders);
      if (transponders.length === 0) {
        setError('No transponders found for this vehicle');
      }
    } catch (error) {
      console.error('Error fetching transponders:', error);
      setError('Failed to fetch transponder data. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMake, selectedModel, selectedYear]);

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedMake} onValueChange={setSelectedMake}>
            <SelectTrigger>
              <SelectValue placeholder="Select Make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map((make) => (
                <SelectItem key={make} value={make}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
            disabled={!selectedMake}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
            disabled={!selectedMake || !selectedYear}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>

            <Button
              variant="outline"
              onClick={resetAll}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-1 block">Chip Type</label>
                <Input
                  placeholder="Filter by chip type..."
                  value={chipTypeFilter}
                  onChange={(e) => setChipTypeFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Frequency</label>
                <Input
                  placeholder="Filter by frequency..."
                  value={frequencyFilter}
                  onChange={(e) => setFrequencyFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Transponder Type</label>
                <Input
                  placeholder="Filter by transponder type..."
                  value={transponderTypeFilter}
                  onChange={(e) => setTransponderTypeFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('chipType')}
                  className="flex items-center gap-2"
                >
                  Chip Type
                  {sortField === 'chipType' && (
                    sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('transponderType')}
                  className="flex items-center gap-2"
                >
                  Transponder Type
                  {sortField === 'transponderType' && (
                    sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('frequency')}
                  className="flex items-center gap-2"
                >
                  Frequency
                  {sortField === 'frequency' && (
                    sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {filteredAndSortedResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedResults.map((transponder) => (
            <Card key={transponder.id} className="overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700">
                <h3 className="font-semibold text-lg">
                  {transponder.chipType}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {transponder.make} {transponder.model} ({transponder.yearStart}-{transponder.yearEnd})
                </p>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                    <p className="text-sm">{transponder.transponderType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Frequency</p>
                    <p className="text-sm">{transponder.frequency}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Compatible Parts</p>
                  <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded mt-1">
                    {transponder.compatibleParts}
                  </p>
                </div>

                {transponder.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</p>
                    <p className="text-sm mt-1">{transponder.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
        </div>
      )}
    </div>
  );
} 