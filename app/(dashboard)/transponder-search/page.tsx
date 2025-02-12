'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { SearchIcon, DownloadIcon } from 'lucide-react';
import { TransponderUploadModal } from '@/app/components/TransponderUploadModal';

interface TransponderKey {
  id: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string;
  compatibleParts: string | null;
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
  inStock?: boolean;
}

interface FilterOptions {
  makes: string[];
  models: string[];
  years: number[];
  chipTypes: string[];
}

export default function TransponderSearchPage() {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    chipType: '',
  });

  // Get filter options
  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ['filterOptions'],
    queryFn: async () => {
      const { data } = await axios.get('/api/transponder/filters');
      return data;
    }
  });

  // Get filtered models based on selected make
  const { data: modelOptions } = useQuery<string[]>({
    queryKey: ['modelOptions', filters.make],
    queryFn: async () => {
      if (!filters.make) return [];
      const { data } = await axios.get(`/api/transponder/models?make=${filters.make}`);
      return data;
    },
    enabled: !!filters.make
  });

  // Get search results
  const { data: results, isLoading } = useQuery({
    queryKey: ['transponderSearch', filters],
    queryFn: async () => {
      const { data } = await axios.get('/api/transponder/search', {
        params: filters
      });
      return data as TransponderKey[];
    },
    enabled: !!(filters.make || filters.model || filters.year || filters.chipType)
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Transponder Search</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search and manage transponder key data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/api/transponder/template'}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <TransponderUploadModal />
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Select
            value={filters.make}
            onValueChange={(value) => setFilters(prev => ({ ...prev, make: value, model: '' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Make" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions?.makes.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.model}
            onValueChange={(value) => setFilters(prev => ({ ...prev, model: value }))}
            disabled={!filters.make}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions?.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.year}
            onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions?.years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.chipType}
            onValueChange={(value) => setFilters(prev => ({ ...prev, chipType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chip Type" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions?.chipTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="mt-8 text-center">Loading...</div>
        ) : results?.length ? (
          <div className="mt-8 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year Range</TableHead>
                  <TableHead>Transponder</TableHead>
                  <TableHead>Chip Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.make}</TableCell>
                    <TableCell>{key.model}</TableCell>
                    <TableCell>
                      {key.yearStart}
                      {key.yearEnd ? ` - ${key.yearEnd}` : '+'}
                    </TableCell>
                    <TableCell>{key.transponderType}</TableCell>
                    <TableCell>{key.chipType}</TableCell>
                    <TableCell>{key.frequency || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={key.inStock ? 'text-green-500' : 'text-red-500'}>
                        {key.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </TableCell>
                    <TableCell>{key.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">
            No results found. Try adjusting your filters.
          </div>
        )}
      </Card>
    </div>
  );
} 