import { useState } from 'react';
import { VatsResistorValue, VATS_RESISTOR_VALUES } from '@/app/types/vats';
import { Info, Calculator } from 'lucide-react';

export default function VatsInfo({ 
  system 
}: { 
  system: "VATS" | "PassKey-1" | "PassKey-2" 
}) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [measuredResistance, setMeasuredResistance] = useState<string>('');
  const [matchingValue, setMatchingValue] = useState<VatsResistorValue | null>(null);

  const calculateResistorValue = (resistance: number) => {
    // Account for 10% tolerance
    return VATS_RESISTOR_VALUES.find(value => {
      const ohmsNumeric = parseFloat(value.ohms.replace(/[Ωk\s]/g, '')) * 
        (value.ohms.includes('k') ? 1000 : 1);
      const lowerBound = ohmsNumeric * 0.9;
      const upperBound = ohmsNumeric * 1.1;
      return resistance >= lowerBound && resistance <= upperBound;
    });
  };

  const handleCalculate = () => {
    const resistance = parseFloat(measuredResistance);
    if (!isNaN(resistance)) {
      const match = calculateResistorValue(resistance);
      setMatchingValue(match || null);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium mb-2">{system} Information</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This vehicle uses the {system} anti-theft system, which requires specific resistor values in the key.
          </p>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          title="Resistor Calculator"
        >
          <Calculator className="w-5 h-5" />
        </button>
      </div>

      {/* Historical Information */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="mb-2">
              VATS (Vehicle Anti Theft System) was introduced by GM in 1986 on the Chevrolet Corvette.
              Due to its success in reducing theft rates, GM expanded the system to other models starting in 1988.
            </p>
            <p>
              The system uses a resistor pellet in the key that must match the vehicle's expected resistance value
              within a 10% tolerance range. If the wrong resistance is detected, the system implements a 3-minute 
              lockout before another start attempt can be made.
            </p>
          </div>
        </div>
      </div>

      {/* Resistor Calculator */}
      {showCalculator && (
        <div className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md">
          <h4 className="text-sm font-medium mb-2">Resistor Value Calculator</h4>
          <div className="flex gap-2">
            <input
              type="number"
              value={measuredResistance}
              onChange={(e) => setMeasuredResistance(e.target.value)}
              placeholder="Enter measured resistance (Ω)"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            <button
              onClick={handleCalculate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Calculate
            </button>
          </div>
          {matchingValue && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded-md">
              <p className="text-sm text-green-700 dark:text-green-300">
                Matching VATS Value: {matchingValue.value} (Code: {matchingValue.code})
              </p>
            </div>
          )}
        </div>
      )}

      {/* Resistor Value Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Value</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Code</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Resistance</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Range (±10%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {VATS_RESISTOR_VALUES.map((resistor) => {
              const ohmsNumeric = parseFloat(resistor.ohms.replace(/[Ωk\s]/g, '')) * 
                (resistor.ohms.includes('k') ? 1000 : 1);
              return (
                <tr key={resistor.value}>
                  <td className="px-4 py-2 text-sm">{resistor.value}</td>
                  <td className="px-4 py-2 text-sm">{resistor.code}</td>
                  <td className="px-4 py-2 text-sm">{resistor.ohms}</td>
                  <td className="px-4 py-2 text-sm">
                    {(ohmsNumeric * 0.9).toFixed(0)}Ω - {(ohmsNumeric * 1.1).toFixed(0)}Ω
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Note: System has allowable tolerance of 10%±</p>
        <p className="mt-1">Value #1 (402Ω) was discontinued in 1989 due to reliability issues.</p>
      </div>
    </div>
  );
} 