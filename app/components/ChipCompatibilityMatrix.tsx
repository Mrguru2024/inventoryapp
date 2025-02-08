import { useMemo } from 'react';
import { TransponderKeyData } from '@/app/services/transponderService';

interface MatrixProps {
  transponders: TransponderKeyData[];
}

export default function ChipCompatibilityMatrix({ transponders }: MatrixProps) {
  const { chipTypes, makeModels, matrix } = useMemo(() => {
    const chips = new Set<string>();
    const vehicles = new Set<string>();
    
    transponders.forEach(t => {
      t.chipType.forEach(chip => chips.add(chip));
      vehicles.add(`${t.make} ${t.model}`);
    });

    const chipArray = Array.from(chips).sort();
    const vehicleArray = Array.from(vehicles).sort();
    
    const compatibilityMatrix = vehicleArray.map(vehicle => {
      const vehicleTransponders = transponders.filter(t => 
        `${t.make} ${t.model}` === vehicle
      );
      
      return chipArray.map(chip => 
        vehicleTransponders.some(t => t.chipType.includes(chip))
      );
    });

    return {
      chipTypes: chipArray,
      makeModels: vehicleArray,
      matrix: compatibilityMatrix
    };
  }, [transponders]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Vehicle
            </th>
            {chipTypes.map(chip => (
              <th key={chip} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {chip}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {makeModels.map((vehicle, rowIndex) => (
            <tr key={vehicle}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {vehicle}
              </td>
              {matrix[rowIndex].map((isCompatible, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                  {isCompatible ? (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">✗</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 