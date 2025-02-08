import { Bike, Info } from 'lucide-react';

interface MotorcycleInfoProps {
  model: string;
  transponderType: string;
  chipTypes: string[];
  yearStart: number;
}

export default function MotorcycleInfo({
  model,
  transponderType,
  chipTypes,
  yearStart
}: MotorcycleInfoProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
      <div className="flex items-start gap-2">
        <Bike className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium mb-2">Motorcycle System</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {model} ({yearStart}+)
          </p>

          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Motorcycle transponders often require specialized programming equipment.
                Please ensure you have the correct tools before attempting to program.
              </p>
            </div>
          </div>

          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Transponder System:</h4>
            <p className="text-sm">{transponderType}</p>
          </div>

          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Compatible Chips:</h4>
            <div className="flex flex-wrap gap-2">
              {chipTypes.map(chip => (
                <span key={chip} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 