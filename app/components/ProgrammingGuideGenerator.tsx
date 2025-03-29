import { useState } from "react";
import { Book, Copy, Check } from "lucide-react";
import {
  TransponderData,
  TransponderKeyData,
} from "@/app/services/transponderService";
import { TransponderInventoryItem } from "@/app/services/transponderInventoryService";
import { Button } from "@/app/components/ui/button";

interface ProgrammingGuideProps {
  transponder: TransponderKeyData | TransponderData;
  inventory?: TransponderInventoryItem[];
}

export default function ProgrammingGuideGenerator({
  transponder,
  inventory,
}: ProgrammingGuideProps) {
  const [copied, setCopied] = useState(false);

  const generateGuide = () => {
    const yearRange =
      "yearStart" in transponder
        ? `${transponder.yearStart}${
            transponder.yearEnd ? `-${transponder.yearEnd}` : "+"
          }`
        : transponder.year;

    const guide = `
Programming Guide for ${transponder.make} ${transponder.model} (${yearRange})

System Type: ${transponder.transponderType}
Chip Type: ${
      Array.isArray(transponder.chipType)
        ? transponder.chipType.join(", ")
        : transponder.chipType
    }
Compatible Parts: ${
      Array.isArray(transponder.compatibleParts)
        ? transponder.compatibleParts.join(", ")
        : transponder.compatibleParts || "N/A"
    }
Frequency: ${transponder.frequency || "N/A"}
${
  "remoteFrequency" in transponder && transponder.remoteFrequency
    ? `Remote Frequency: ${transponder.remoteFrequency}`
    : ""
}
${transponder.notes ? `Notes: ${transponder.notes}` : ""}
${transponder.dualSystem ? "Dual System: Yes" : "Dual System: No"}

Required Tools:
${getRequiredTools(transponder)}

Programming Steps:
${getProgrammingSteps(transponder)}

${inventory ? getInventoryStatus(transponder, inventory) : ""}
    `.trim();

    return guide;
  };

  const copyGuide = () => {
    const guide = generateGuide();
    navigator.clipboard.writeText(guide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Book className="h-5 w-5" />
          Programming Guide
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={copyGuide}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Guide
            </>
          )}
        </Button>
      </div>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
        {generateGuide()}
      </pre>
    </div>
  );
}

function getRequiredTools(
  transponder: TransponderKeyData | TransponderData
): string {
  const tools = ["Key Programmer"];
  if (transponder.dualSystem) {
    tools.push("Remote Programmer");
  }
  return tools.map((tool) => `- ${tool}`).join("\n");
}

function getProgrammingSteps(
  transponder: TransponderKeyData | TransponderData
): string {
  const steps = [
    "1. Connect the key programmer to the vehicle",
    "2. Select the correct vehicle make and model",
    "3. Choose the appropriate programming mode",
    "4. Follow the on-screen instructions",
  ];
  if (transponder.dualSystem) {
    steps.push("5. Program the remote using the remote programmer");
  }
  return steps.join("\n");
}

function getInventoryStatus(
  transponder: TransponderKeyData | TransponderData,
  inventory: TransponderInventoryItem[]
): string {
  const item = inventory.find(
    (i) => i.transponderType === transponder.transponderType
  );
  if (!item) return "";

  return `
Inventory Status:
- Current Stock: ${item.quantity}
- Minimum Stock: ${item.minimumStock}
- Status: ${item.quantity <= item.minimumStock ? "Low Stock" : "In Stock"}
`;
}
