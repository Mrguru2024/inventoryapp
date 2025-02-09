'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { EditIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

interface Key {
  id: string;
  make: string;
  model: string;
  year: string;
  keyType: string;
  transponderType: string | null;
  notes: string | null;
  quantity: number;
  location: string;
}

export default function KeysTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: keys = [], isLoading } = useQuery<Key[]>({
    queryKey: ['keys', searchTerm],
    queryFn: async () => {
      const response = await fetch(`/api/keys?search=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search keys..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Key Type</TableHead>
              <TableHead>Transponder</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.make}</TableCell>
                <TableCell>{key.model}</TableCell>
                <TableCell>{key.year}</TableCell>
                <TableCell>{key.keyType}</TableCell>
                <TableCell>{key.transponderType || 'N/A'}</TableCell>
                <TableCell>{key.quantity}</TableCell>
                <TableCell>{key.location}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/keys/${key.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 