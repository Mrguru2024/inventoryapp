'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { toast } from '@/app/components/ui/use-toast';

export default function TransponderImport() {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await fetch('/api/transponders/import', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Import failed');
      }

      toast({
        title: 'Success',
        description: 'Transponder data imported successfully',
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Error',
        description: 'Failed to import transponder data',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Import Transponder Data</h2>
      <Button 
        onClick={handleImport} 
        disabled={isImporting}
      >
        {isImporting ? 'Importing...' : 'Import All Transponder Data'}
      </Button>
    </div>
  );
} 