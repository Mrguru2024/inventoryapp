import { useState } from 'react';
import { Book, Copy, Check } from 'lucide-react';
import { TransponderKeyData } from '@/app/services/transponderService';

interface ProgrammingGuideProps {
  transponder: TransponderKeyData;
  inventory?: TransponderInventoryItem[];
}

export default function ProgrammingGuideGenerator({
  transponder,
  inventory
}: ProgrammingGuideProps) {
  const [copied, setCopied] = useState(false);

  const generateGuide = () => {
    const guide = `
Programming Guide for ${transponder.make} ${transponder.model} (${transponder.yearStart}${transponder.yearEnd ? `-${transponder.yearEnd}` : '+'})

System Type: ${transponder.transponderType}
Compatible Chips: ${transponder.chipType.join(', ')}
${transponder.compatibleParts ? `OEM Parts: ${transponder.compatibleParts.join(', ')}` : ''}

Required Tools:
${getRequiredTools(transponder)}

Programming Steps:
${getProgrammingSteps(transponder)}

Notes:
${transponder.notes || 'No special notes'}
${getInventoryStatus(transponder, inventory)}
    `.trim();

    return guide;
  };

  const copyGuide = () => {
    navigator.clipboard.writeText(generateGuide());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Book className="h-5 w-5" />
          Programming Guide
        </h3>
        <button
          onClick={copyGuide}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Guide
            </>
          )}
        </button>
      </div>

      <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto">
        <code>{generateGuide()}</code>
      </pre>
    </div>
  );
} 