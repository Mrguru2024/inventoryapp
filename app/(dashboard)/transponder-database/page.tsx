import { Metadata } from 'next';
import VehicleTransponderSearch from '@/app/components/VehicleTransponderSearch';

export const metadata: Metadata = {
  title: 'Transponder Database | Key Programming Assistant',
  description: 'Search and explore vehicle transponder key information',
};

export default function TransponderDatabasePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transponder Database</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search for vehicle transponder information by make, model, or transponder type
        </p>
      </div>

      <VehicleTransponderSearch />
    </div>
  );
} 