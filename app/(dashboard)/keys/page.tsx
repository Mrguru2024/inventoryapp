"use client";

import { Suspense } from 'react';
import KeysTable from '@/app/components/KeysTable';
import KeysTableSkeleton from '@/app/components/KeysTableSkeleton';
import AddKeyModal from '@/app/components/AddKeyModal';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';

export default function KeysPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Keys Inventory</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Key
        </Button>
      </div>

      <AddKeyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Suspense fallback={<KeysTableSkeleton />}>
        <KeysTable />
      </Suspense>
    </div>
  );
} 