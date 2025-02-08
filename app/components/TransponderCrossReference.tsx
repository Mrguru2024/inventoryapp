import { useState, useMemo } from 'react';
import { TransponderKeyData } from '@/app/services/transponderService';

interface CrossReferenceProps {
  transponders: TransponderKeyData[];
  onSelect?: (transponder: TransponderKeyData) => void;
}

export default function TransponderCrossReference({
  transponders,
  onSelect
}: CrossReferenceProps) {
  const [selectedChip, setSelectedChip] = useState<string>('');
  
  const allChipTypes = useMemo(() => {
    const chips = new Set<string>();
    transponders.forEach(t => 
      t.chipType.forEach(chip => chips.add(chip))
    );
    return Array.from(chips).sort();
  }, [transponders]);

  const compatibleTransponders = useMemo(() => {
    if (!selectedChip) return [];
    return transponders.filter(t => 
      t.chipType.includes(selectedChip)
    );
  }, [transponders, selectedChip]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Transponder Chip
        </label>
        <select
          value={selectedChip}
          onChange={(e) => setSelectedChip(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select a chip type...</option>
          {allChipTypes.map(chip => (
            <option key={chip} value={chip}>{chip}</option>
          ))}
        </select>
      </div>

      {selectedChip && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Compatible Vehicles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {compatibleTransponders.map(t => (
              <button
                key={t.id}
                onClick={() => onSelect?.(t)}
                className="p-2 text-left hover:bg-gray-50 rounded-md"
              >
                <p className="font-medium">{t.make} {t.model}</p>
                <p className="text-sm text-gray-600">
                  {t.yearStart}{t.yearEnd ? `-${t.yearEnd}` : '+'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 