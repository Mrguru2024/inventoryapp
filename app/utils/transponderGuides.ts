import { TransponderKeyData } from '@/app/services/transponderService';

interface ProgrammingStep {
  step: number;
  description: string;
  warning?: string;
  note?: string;
  estimatedTime?: number; // in minutes
  requiredSkillLevel?: 'basic' | 'intermediate' | 'advanced';
}

export function getRequiredTools(transponder: TransponderKeyData): string[] {
  const tools = ['Diagnostic Device'];
  
  switch (transponder.transponderType) {
    case 'Texas Crypto 4D':
      tools.push('4D Duplicator', 'Token Programming Device');
      break;
    case 'Philips Crypto 2':
      tools.push('Hitag2 Programmer', 'Key Cutting Machine');
      break;
    case 'Hitag AES':
      tools.push('Advanced AES Programmer', 'OBD Connection Cable');
      break;
    case 'Megamos 13':
      tools.push('Megamos ID13 Programmer');
      break;
    // Add more cases for different systems
  }

  if (transponder.vatsEnabled) {
    tools.push('VATS Decoder', 'Resistor Kit');
  }

  return tools;
}

export function getProgrammingSteps(transponder: TransponderKeyData): ProgrammingStep[] {
  const steps: ProgrammingStep[] = [
    {
      step: 1,
      description: 'Connect diagnostic device to vehicle OBD port',
      note: 'Ensure good connection and battery voltage above 12V',
      estimatedTime: 2,
      requiredSkillLevel: 'basic'
    }
  ];

  switch (transponder.transponderType) {
    case 'Hitag AES':
      steps.push(
        {
          step: 2,
          description: 'Initialize AES security handshake',
          warning: 'Critical step - ensure stable power supply',
          estimatedTime: 5,
          requiredSkillLevel: 'advanced'
        },
        {
          step: 3,
          description: 'Generate AES authentication token',
          note: 'May require online server connection',
          estimatedTime: 3,
          requiredSkillLevel: 'advanced'
        },
        {
          step: 4,
          description: 'Program AES transponder',
          warning: 'Keep all RF devices away during programming',
          estimatedTime: 8,
          requiredSkillLevel: 'advanced'
        }
      );
      break;

    case 'Philips Crypto 3':
      steps.push(
        {
          step: 2,
          description: 'Read vehicle security data',
          warning: 'Do not interrupt the process',
          estimatedTime: 4,
          requiredSkillLevel: 'intermediate'
        },
        {
          step: 3,
          description: 'Initialize Crypto 3 transponder',
          note: transponder.compatibleParts?.length ? 
            `Use only: ${transponder.compatibleParts.join(', ')}` : undefined,
          estimatedTime: 6,
          requiredSkillLevel: 'intermediate'
        }
      );
      break;
    // Add more cases...
  }

  // System-specific steps
  switch (transponder.transponderType) {
    case 'Texas Crypto 4D':
      steps.push(
        {
          step: 2,
          description: 'Read security access code from ECU',
          warning: 'Do not disconnect during read process'
        },
        {
          step: 3,
          description: 'Prepare 4D transponder using duplicator',
          note: 'Use virgin 4D-64/67 chip'
        },
        {
          step: 4,
          description: 'Program transponder with security data',
          warning: 'Keep all keys away during programming'
        }
      );
      break;
    case 'Philips Crypto 2':
      steps.push(
        {
          step: 2,
          description: 'Enter programming mode via diagnostic device',
          note: 'Follow OEM-specific entry procedure'
        },
        {
          step: 3,
          description: 'Prepare Hitag2 transponder',
          note: transponder.compatibleParts ? 
            `Recommended parts: ${transponder.compatibleParts.join(', ')}` : undefined
        }
      );
      break;
    // Add more cases for different systems
  }

  // Special system handling
  if (transponder.vatsEnabled) {
    steps.push({
      step: steps.length + 1,
      description: 'Measure and match VATS resistance value',
      warning: 'Ensure exact resistance match within 10% tolerance'
    });
  }

  if (transponder.dualSystem) {
    steps.push({
      step: steps.length + 1,
      description: 'Verify correct transponder system for this specific vehicle',
      note: 'Check VIN or existing key to determine correct system'
    });
  }

  // Final verification steps
  steps.push({
    step: steps.length + 1,
    description: 'Test key functionality',
    note: 'Verify all functions: start, lock/unlock, immobilizer'
  });

  return steps;
}

export function getInventoryStatus(
  transponder: TransponderKeyData,
  inventory?: TransponderInventoryItem[]
): string {
  if (!inventory) return '';

  const compatibleItems = inventory.filter(item =>
    item.chipType.some(chip => transponder.chipType.includes(chip))
  );

  if (compatibleItems.length === 0) {
    return '\nWarning: No compatible transponders in stock!';
  }

  return `\nInventory Status:
${compatibleItems.map(item => 
  `- ${item.transponderType}: ${item.quantity} units available (Location: ${item.location})`
).join('\n')}`;
} 