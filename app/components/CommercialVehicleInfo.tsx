import { Info } from 'lucide-react';

interface CommercialVehicleInfoProps {
  series: string;
  models: string[];
  transponderType: string;
  chipTypes: string[];
}

export default function CommercialVehicleInfo({
  series,
  models,
  transponderType,
  chipTypes
}: CommercialVehicleInfoProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
      <div className="flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium mb-2">{series} Series Information</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            This vehicle belongs to the {series}-series commercial vehicle line.
            All models in this series use the same transponder system.
          </p>
          
          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Compatible Models:</h4>
            <div className="flex flex-wrap gap-2">
              {models.map(model => (
                <span key={model} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                  {model}
                </span>
              ))}
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