// Types and Interfaces
export interface TransponderSeedData {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;  // Required, not nullable
  transponderType: string;
  chipType: string;  // Will store as JSON string
  frequency: string;
  compatibleParts: string;  // Will store as JSON string
  notes?: string;
}

// Constants
export const VALID_FREQUENCIES = [
  '125 kHz',
  '134.2 kHz',
  '315 MHz',
  '433.92 MHz',
  '434 MHz',
  '868 MHz',
  '902 MHz'
] as const;

type ValidFrequency = typeof VALID_FREQUENCIES[number];

// Validation Rules
export const VALIDATION_RULES = {
  yearRange: {
    min: 1990,
    max: 2024,
    message: (year: number) => 
      `Year must be between ${VALIDATION_RULES.yearRange.min} and ${VALIDATION_RULES.yearRange.max}, got ${year}`
  },
  frequency: {
    values: VALID_FREQUENCIES,
    message: (freq: string) => 
      `Invalid frequency "${freq}". Must be one of: ${VALID_FREQUENCIES.join(', ')}`
  },
  make: {
    minLength: 2,
    maxLength: 20,
    message: (make: string) => 
      `Make must be between ${VALIDATION_RULES.make.minLength} and ${VALIDATION_RULES.make.maxLength} characters`
  }
};

// Helper Functions
export function createTransponderEntry(data: Partial<TransponderSeedData>): TransponderSeedData {
  const entry = {
    make: data.make?.toUpperCase() || '',
    model: data.model?.toUpperCase() || '',
    yearStart: data.yearStart || VALIDATION_RULES.yearRange.min,
    yearEnd: data.yearEnd || VALIDATION_RULES.yearRange.max,
    transponderType: data.transponderType || '',
    chipType: typeof data.chipType === 'object' ? JSON.stringify(data.chipType) : (data.chipType || '[]'),
    frequency: data.frequency || '',
    compatibleParts: typeof data.compatibleParts === 'object' ? JSON.stringify(data.compatibleParts) : (data.compatibleParts || '[]'),
    notes: data.notes
  };

  validateTransponderData(entry);
  return entry;
}

// Validation Functions
export function validateTransponderData(data: TransponderSeedData): void {
  const errors: string[] = [];

  // Validate year range
  if (data.yearStart < VALIDATION_RULES.yearRange.min || data.yearStart > VALIDATION_RULES.yearRange.max) {
    errors.push(VALIDATION_RULES.yearRange.message(data.yearStart));
  }
  if (data.yearEnd < VALIDATION_RULES.yearRange.min || data.yearEnd > VALIDATION_RULES.yearRange.max) {
    errors.push(VALIDATION_RULES.yearRange.message(data.yearEnd));
  }
  if (data.yearEnd < data.yearStart) {
    errors.push(`End year (${data.yearEnd}) cannot be before start year (${data.yearStart})`);
  }

  // Validate make and model
  if (data.make.length < VALIDATION_RULES.make.minLength || 
      data.make.length > VALIDATION_RULES.make.maxLength) {
    errors.push(VALIDATION_RULES.make.message(data.make));
  }

  // Validate JSON fields
  try {
    const chipTypes = JSON.parse(data.chipType);
    if (!Array.isArray(chipTypes)) {
      errors.push('chipType must be a JSON array');
    }
  } catch (e) {
    errors.push('Invalid chipType JSON format');
  }

  try {
    const parts = JSON.parse(data.compatibleParts);
    if (!Array.isArray(parts)) {
      errors.push('compatibleParts must be a JSON array');
    }
  } catch (e) {
    errors.push('Invalid compatibleParts JSON format');
  }

  // Validate frequency
  if (data.frequency && !VALID_FREQUENCIES.includes(data.frequency as ValidFrequency)) {
    errors.push(VALIDATION_RULES.frequency.message(data.frequency));
  }

  // Throw combined errors if any
  if (errors.length > 0) {
    throw new Error(
      `Validation errors for ${data.make} ${data.model}:\n${errors.join('\n')}`
    );
  }
}

// Aftermarket cross-reference data
export interface AftermarketCrossRef {
  oem: string;
  aftermarket: string[];
  notes?: string;
}

export const AFTERMARKET_CROSS_REF: Record<string, AftermarketCrossRef[]> = {
  'MAZDA': [
    {
      oem: 'CC51675RYC',
      aftermarket: ['4D63', 'TP20', 'TPX2', 'XT27', 'K-JMD'],
      notes: 'Texas 4D system (2003-2007)'
    },
    {
      oem: 'KDY5-67-5DY',
      aftermarket: ['ID47', 'PCF7953P'],
      notes: 'Hitag Pro system (2014+)'
    },
    {
      oem: 'WAZSKE13D02',
      aftermarket: ['PCF7953P', 'ID47'],
      notes: 'Modern Hitag Pro system'
    }
  ]
}; 