import { Info, Key } from 'lucide-react';

interface LuxuryVehicleInfoProps {
  transponderType: string;
  compatibleParts: string[];
  isHybrid?: boolean;
  isFSport?: boolean;
}

export default function LuxuryVehicleInfo({
  transponderType,
  compatibleParts,
  isHybrid,
  isFSport
}: LuxuryVehicleInfoProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
      <div className="flex items-start gap-2">
        <Key className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium mb-2">Luxury Vehicle System</h3>
          
          {(isHybrid || isFSport) && (
            <div className="mb-3 flex gap-2">
              {isHybrid && (
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                  Hybrid System
                </span>
              )}
              {isFSport && (
                <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                  F-Sport System
                </span>
              )}
            </div>
          )}

          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Transponder System:</h4>
            <p className="text-sm">{transponderType}</p>
          </div>

          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Compatible OEM Parts:</h4>
            <div className="flex flex-wrap gap-2">
              {compatibleParts.map(part => (
                <span key={part} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  {part}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 