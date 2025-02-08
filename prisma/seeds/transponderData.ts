interface TransponderSeed {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string;
  compatibleParts: string | null;
  frequency: ValidFrequency | null;
  remoteFrequency?: ValidFrequency | null;
  notes: string | null;
  dualSystem: boolean;
  partNumberPattern?: keyof typeof PART_NUMBER_PATTERNS;
}

interface AftermarketCrossRef {
  oem: string;
  aftermarket: string[];
  notes?: string;
}

// Validation constants
const VALID_CHIP_TYPES = [
  // Basic types
  'H', '8A', 'H8A', 'G', '46',
  
  // Texas Instruments
  '4C', 'ID4C', '4D60', 'ID60', '4D63', 'ID63', '4D64',
  'DST80', 'ID63-6F', 'DST40',
  
  // Philips/NXP
  'ID33', 'ID42', 'ID44', 'ID46', 'ID47', 'ID4A',
  'PCF7930', 'PCF7931', 'PCF7935', 'PCF7936', 'PCF7939',
  'PCF7939FA', 'PCF7939MA', 'PCF7941', 'PCF7945F',
  'PCF7952', 'PCF7953', 'PCF7953M', 'PCF7953Mx', 'PCF7953P',
  
  // Hitag Family
  'Hitag-2', 'HITAG3', 'NCF29A1M', 'HITAG-AES',
  
  // Aftermarket
  'TPX1', 'TPX2', 'TPX7', 'GTI', 'XT27', 'K-JMD',
  
  // Megamos Family
  'ID13', 'ID48', 'ID49',
  
  // Philips/NXP Additional
  'PCF7953A', 'PCF7953AT', 'PCF7953P',
  
  // Texas Instruments Additional
  'ID4C', '4D60', '4D63', 'DST80', 'ID63-6F',
  
  // Philips/NXP Additional
  'PCF7945A', 'PCF7939FA', 'PCF7953A',
  
  // Aftermarket
  'TPX1', 'TPX2', 'TPX7', 'TP02', 'TP06', 'TP20', 'TP33',
  'K-JMD', 'XT27',
  
  // Megamos Family
  'T6', 'TP05', 'TP08',
  
  // Philips Additional
  'PCF7946', 'PCF7936AS', 'PCF7945AC', 'TPX4', 'TP12',
  
  // Toyota Specific
  'ID67', 'ID70', 'ID72', 'ID74', 'ID75',
  '4D67', '4D70', '4D72', '4D74', '4D75',
  'G', 'H', 'H8A',
  
  // Aftermarket Additional
  'TPX1', 'TPX2', 'TP07', 'CN1', 'CN2', 'CN5',
  'TX1', 'TX2', 'YS-01',
  
  // Alfa Romeo Specific
  'ID33', 'ID44', 'ID46', 'ID48', 'ID4A', 'ID51',
  'PCF7930', 'PCF7931', 'PCF7935', 'PCF7936', 'PCF7941', 'PCF7946',
  
  // GMC Specific
  'PCF7937E', 'PCF7952E', 'PCF7961E',
  'ID46E', 'TP12GM', 'T14', 'CN3', 'XT27A66',
  
  // Jeep Specific
  '4D64', 'ID4A', 'ID88',
  'PCF7941AT', 'PCF7961', 'PCF7953M',
  'TP12CH', 'TP21',
  
  // Mazda Specific
  'ID12', 'ID33', '4D60', '4D63', 'ID63-6F',
  'TK5561', 'PCF7953P', 'PCF7953M',
  'TP04', 'TP17', 'TP20', 'DST80'
] as const;

// Define frequency type
type ValidFrequency = typeof VALID_FREQUENCIES[number];

const VALID_FREQUENCIES = [
  '125 kHz',    // LF transponder frequency
  '134.2 kHz',  // LF alternate
  '315 MHz',    // RF North America
  '433.92 MHz', // RF Europe
  '434 MHz',    // RF Europe alternate
  '868 MHz',    // RF Europe high frequency
  '902 MHz'     // RF North America high frequency
] as const;

const PART_NUMBER_PATTERNS = {
  FORD_7S7T: /^7S7T-15K601-[A-Z]{2}$/,
  FORD_H1BT: /^H1BT-15K601-[A-Z]{2}$/,
  FORD_HC3T: /^HC3T-15K601-[A-Z]{2}$/,
  FORD_DS7T: /^DS7T-15K601-[A-Z]{2}$/,
  FORD_GK2T: /^GK2T-15K601-[A-Z]{2}$/,
  FORD_164R: /^164-R[0-9]{4}$/,
  FORD_M3N: /^M3N-[A-Z0-9]+$/,
  STRATTEC: /^5[0-9]{6}$/,
  JAGUAR_HK83: /^HK83-15K601-[A-Z]{2}$/,
  JAGUAR_CH22: /^CH22-15K601-[A-Z]{2}$/,
  JAGUAR_KR55: /^KR55WK[0-9]{5}$/,
  JAGUAR_T4A: /^T4A[0-9]{5}$/,
  JAGUAR_EW93: /^EW93-15K601-[A-Z]{2}$/,
  JAGUAR_AW93: /^AW93-15K601-[A-Z]{2}$/,
  LINCOLN_M3N: /^M3N-[A-Z0-9]+$/,
  LINCOLN_164R: /^164-R[0-9]{4}$/,
  LINCOLN_BA1T: /^BA1T-15K601-[A-Z]{2}$/,
  LINCOLN_DP5T: /^DP5T-15K601-[A-Z]{2}$/,
  LINCOLN_EJ7T: /^EJ7T-15K601-[A-Z]{2}$/,
  PORSCHE_7L5: /^7L5[0-9]{6}$/,
  PORSCHE_5WK: /^5WK[0-9]{5}$/,
  TOYOTA_89904: /^89904-[0-9A-Z]{5}$/,
  TOYOTA_89070: /^89070-[0-9A-Z]{5}$/,
  TOYOTA_89785: /^89785-[0-9]{5}$/,
  TOYOTA_HYQ14: /^HYQ14[A-Z]{3}$/,
  TOYOTA_HYQ12: /^HYQ12[A-Z]{3}$/,
  ALFA_156: /^156[0-9]{6}$/,
  ALFA_717: /^717[0-9]{5}$/,
  ALFA_684: /^684[0-9]{5}[A-Z]{2}$/,
  GMC_HYQ: /^HYQ[0-9A-Z]{2,4}$/,
  GMC_M3N: /^M3N-?[0-9]{8}$/,
  JEEP_OHT: /^OHT[0-9]{6}[A-Z]{2}$/,
  JEEP_IYZ: /^IYZ-[A-Z0-9]{4}$/,
  JEEP_M3N: /^M3N[0-9]{8}$/,
  JEEP_68: /^68[0-9]{6}[A-Z]{2}$/,
  MAZDA_CC: /^CC[0-9]{2}-67-5[A-Z]{3}$/,
  MAZDA_NE: /^NE[0-9]{2}-67-5[A-Z]{3}$/,
  MAZDA_KDY: /^KDY[0-9]-67-5[A-Z]{2,3}$/,
  MAZDA_WAZSKE: /^WAZSKE[0-9]{2}D[0-9]{2}$/,
  MAZDA_5WK: /^5WK[0-9]{5}[A-Z]?$/
} as const;

// Add Toyota chip generation types and validation
const TOYOTA_CHIP_GENERATIONS = {
  '4C': ['4C', 'TPX1', 'TP07', 'CN1', 'TX1'] as const,
  '4D': ['4D67', 'ID67', 'TPX2', 'CN2', 'CN5', 'TX2', 'YS-01'] as const,
  'G': ['4D72', 'ID72', 'DST80', 'G'] as const,
  'H': ['4D74', '4D75', 'ID74', 'ID75', 'H'] as const
} as const;

// Create a type for all valid Toyota chips
type ToyotaChipType = typeof TOYOTA_CHIP_GENERATIONS[keyof typeof TOYOTA_CHIP_GENERATIONS][number];

// Expand Toyota cross-reference data
const AFTERMARKET_CROSS_REF: Record<string, AftermarketCrossRef[]> = {
  'TOYOTA': [
    // H-chip systems
    {
      oem: '89904-58360',
      aftermarket: ['TPX2', 'CN2', 'CN5', 'K-JMD', 'YS-01'],
      notes: 'H-chip system (2015+)'
    },
    {
      oem: 'HYQ14FBA',
      aftermarket: ['TPX2', 'CN2', 'K-JMD'],
      notes: 'G-chip system (2010-2015)'
    },
    {
      oem: '89070-02880',
      aftermarket: ['TPX2', 'CN2', 'K-JMD'],
      notes: 'H-chip system (2013+)'
    },
    // G-chip systems
    {
      oem: 'HYQ12BBY',
      aftermarket: ['TPX2', 'CN5', 'YS-01'],
      notes: 'G-chip system (2011-2018)'
    },
    // 4D systems
    {
      oem: '89904-28091',
      aftermarket: ['TPX2', 'CN2', 'K-JMD'],
      notes: '4D67 system (2006-2014)'
    }
  ],
  'ALFA ROMEO': [
    {
      oem: '156119222',
      aftermarket: ['ID4A', 'ID51'],
      notes: 'Hitag AES system (2016+)'
    },
    {
      oem: '71775511',
      aftermarket: ['PCF7936', 'XT27', 'K-JMD'],
      notes: 'Crypto 2 system with PCF7946 MCU'
    }
  ],
  'GMC': [
    {
      oem: 'HYQ14EA',
      aftermarket: ['PCF7937E', 'PCF7961E'],
      notes: 'Hitag 2 Extended system'
    },
    {
      oem: 'M3N32337100',
      aftermarket: ['PCF7952E', 'PCF7937E'],
      notes: 'Modern Hitag 2 system'
    }
  ],
  'JEEP': [
    {
      oem: 'OHT692427AA',
      aftermarket: ['PCF7936', 'PCF7941AT', 'TP12CH'],
      notes: 'Crypto 2 system (2005-2007)'
    },
    {
      oem: 'M3N5W783X',
      aftermarket: ['PCF7961', 'XT27A66', 'K-JMD'],
      notes: 'Hitag 2 system (2008-2017)'
    },
    {
      oem: '68105078AE',
      aftermarket: ['PCF7953', 'ID4A'],
      notes: 'Hitag AES system (2015+)'
    }
  ],
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

// Validation function
function validateTransponderData(data: TransponderSeed): void {
  try {
    const chipTypes = JSON.parse(data.chipType);
    if (!Array.isArray(chipTypes)) {
      throw new Error(`Invalid chipType format for ${data.make} ${data.model}`);
    }
    
    chipTypes.forEach(chip => {
      if (!VALID_CHIP_TYPES.includes(chip)) {
        console.error(`Available chip types:`, VALID_CHIP_TYPES);
        throw new Error(
          `Invalid chip type "${chip}" for ${data.make} ${data.model}. Please check VALID_CHIP_TYPES.`
        );
      }
    });

    // Updated frequency validation
    if (data.frequency) {
      const isValidFrequency = VALID_FREQUENCIES.includes(data.frequency as ValidFrequency);
      if (!isValidFrequency) {
        console.error(`Available frequencies:`, VALID_FREQUENCIES);
        throw new Error(
          `Invalid frequency "${data.frequency}" for ${data.make} ${data.model}`
        );
      }
    }

    if (data.remoteFrequency) {
      const isValidRemoteFreq = VALID_FREQUENCIES.includes(data.remoteFrequency as ValidFrequency);
      if (!isValidRemoteFreq) {
        console.error(`Available frequencies:`, VALID_FREQUENCIES);
        throw new Error(
          `Invalid remote frequency "${data.remoteFrequency}" for ${data.make} ${data.model}`
        );
      }
    }

    // Validate part number pattern if specified
    if (data.partNumberPattern && data.compatibleParts) {
      const pattern = PART_NUMBER_PATTERNS[data.partNumberPattern];
      const parts = JSON.parse(data.compatibleParts);
      
      parts.forEach((part: string) => {
        // Only validate if we have a pattern and it contains an underscore
        if (data.partNumberPattern && data.partNumberPattern.includes('_')) {
          const [make, series] = data.partNumberPattern.split('_');
          if (part.startsWith(series)) {
            if (!part.match(pattern)) {
              throw new Error(
                `Invalid part number format: ${part} for pattern ${data.partNumberPattern}`
              );
            }
          }
        }
      });
    }

    if (data.dualSystem && !data.remoteFrequency) {
      throw new Error(
        `Dual system ${data.make} ${data.model} must specify remoteFrequency`
      );
    }

    validateFrequencyRange(data.frequency);
    if (data.remoteFrequency) {
      validateFrequencyRange(data.remoteFrequency);
    }

    if (data.make === "TOYOTA") {
      validateToyotaData(data);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Validation error for ${data.make} ${data.model}:`, error.message);
    }
    throw error;
  }
}

// Add validation for frequency ranges
function validateFrequencyRange(frequency: ValidFrequency | null): void {
  if (!frequency) return;
  
  const [value, unit] = frequency.split(' ');
  const numValue = parseFloat(value);
  
  switch (unit) {
    case 'kHz':
      if (numValue < 100 || numValue > 150) {
        throw new Error(`Invalid kHz frequency: ${frequency}`);
      }
      break;
    case 'MHz':
      if (numValue < 300 || numValue > 1000) {
        throw new Error(`Invalid MHz frequency: ${frequency}`);
      }
      break;
    default:
      throw new Error(`Invalid frequency unit: ${unit}`);
  }
}

// Update Toyota validation function
function validateToyotaData(data: TransponderSeed): void {
  if (data.make !== "TOYOTA") return;

  const chipTypes = JSON.parse(data.chipType) as string[];
  
  // Validate chip generation consistency
  let matchedGeneration = false;
  for (const [gen, chips] of Object.entries(TOYOTA_CHIP_GENERATIONS)) {
    const hasAllChips = chipTypes.every((chip) => 
      (chips as readonly string[]).includes(chip)
    );
    if (hasAllChips) {
      matchedGeneration = true;
      break;
    }
  }

  if (!matchedGeneration) {
    throw new Error(
      `Invalid chip combination for Toyota ${data.model} (${data.yearStart}). ` +
      `Chips must match a specific generation (4C, 4D, G, or H).`
    );
  }

  // Update part number validation to include 89785 series
  if (data.compatibleParts) {
    const parts = JSON.parse(data.compatibleParts);
    parts.forEach((part: string) => {
      if (data.yearStart >= 2010) {
        if (!part.match(/^(89904|89070|89785|HYQ1[24])/)) {
          throw new Error(
            `Invalid Toyota part number format for post-2010 vehicle: ${part}`
          );
        }
      }
    });
  }
}

// Update the Ford F-150 entry
const fordEntries: TransponderSeed[] = [
  {
    make: "FORD",
    model: "F-150",
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: "Philips Crypto 3",
    chipType: JSON.stringify(["PCF7953P", "PCF7939FA"]),
    compatibleParts: JSON.stringify(["164-R8163"]), // Removed incompatible part number
    frequency: "902 MHz" as ValidFrequency,
    notes: "128-Bit HiTAG Pro system with proximity key functionality",
    dualSystem: false,
    partNumberPattern: "FORD_164R"
  },
  {
    make: "FORD",
    model: "FOCUS",
    yearStart: 2015,
    yearEnd: 2018,
    transponderType: "Philips Crypto 3",
    chipType: JSON.stringify(["ID47", "PCF7939FA", "PCF7953P"]),
    compatibleParts: JSON.stringify(["H1BT-15K601-BA"]),
    frequency: "434 MHz" as ValidFrequency,
    notes: "Proximity key system with HiTAG Pro encryption",
    dualSystem: false,
    partNumberPattern: "FORD_H1BT"
  },
  // ... other Ford entries
];

// Alternative approach: Create separate entries for different part number patterns
const fordF150Entry: TransponderSeed[] = [
  {
    make: "FORD",
    model: "F-150",
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: "Philips Crypto 3",
    chipType: JSON.stringify(["PCF7953P", "PCF7939FA"]),
    compatibleParts: JSON.stringify(["164-R8163"]),
    frequency: "902 MHz" as ValidFrequency,
    notes: "OEM Ford part number",
    dualSystem: false,
    partNumberPattern: "FORD_164R"
  },
  {
    make: "FORD",
    model: "F-150",
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: "Philips Crypto 3",
    chipType: JSON.stringify(["PCF7953P", "PCF7939FA"]),
    compatibleParts: JSON.stringify(["M3N-A2C93142300"]),
    frequency: "902 MHz" as ValidFrequency,
    notes: "Aftermarket compatible part",
    dualSystem: false,
    partNumberPattern: "FORD_M3N"
  }
];

// Update the Ford Explorer entry to handle different part number patterns
const fordExplorerEntry: TransponderSeed[] = [
  {
    make: "FORD",
    model: "EXPLORER",
    yearStart: 2016,
    yearEnd: 2017,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["DST80", "ID63-6F"]),
    compatibleParts: JSON.stringify([
      "DS7T-15K601-CM", "DS7T-15K601-CL"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    remoteFrequency: "868 MHz" as ValidFrequency,
    notes: "OEM Ford proximity key",
    dualSystem: true,
    partNumberPattern: "FORD_DS7T"
  },
  {
    make: "FORD",
    model: "EXPLORER",
    yearStart: 2016,
    yearEnd: 2017,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["DST80", "ID63-6F"]),
    compatibleParts: JSON.stringify(["164-R7988"]),
    frequency: "125 kHz" as ValidFrequency,
    remoteFrequency: "868 MHz" as ValidFrequency,
    notes: "Aftermarket compatible key",
    dualSystem: true,
    partNumberPattern: "FORD_164R"
  }
];

// Add Jaguar entries
const jaguarEntries: TransponderSeed[] = [
  // F-PACE with T4A part number
  {
    make: "JAGUAR",
    model: "F-PACE",
    yearStart: 2016,
    yearEnd: null,
    transponderType: "Hitag Pro",
    chipType: JSON.stringify(["PCF7953P", "ID49"]),
    compatibleParts: JSON.stringify(["T4A12802"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Modern Hitag Pro system with proximity features",
    dualSystem: false,
    partNumberPattern: "JAGUAR_T4A"
  },
  // F-PACE with HK83 part numbers
  {
    make: "JAGUAR",
    model: "F-PACE",
    yearStart: 2016,
    yearEnd: null,
    transponderType: "Hitag Pro",
    chipType: JSON.stringify(["PCF7953P", "ID49"]),
    compatibleParts: JSON.stringify([
      "HK83-15K601-BB",
      "HK83-15K601-AA"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Modern Hitag Pro system with proximity features",
    dualSystem: false,
    partNumberPattern: "JAGUAR_HK83"
  },
  // XF with CH22 part numbers
  {
    make: "JAGUAR",
    model: "XF",
    yearStart: 2013,
    yearEnd: 2018,
    transponderType: "Hitag Pro",
    chipType: JSON.stringify(["PCF7953P", "ID49"]),
    compatibleParts: JSON.stringify([
      "CH22-15K601-BB"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Advanced encryption system with multiple compatible keys",
    dualSystem: false,
    partNumberPattern: "JAGUAR_CH22"
  },
  // XF with HK83 part numbers
  {
    make: "JAGUAR",
    model: "XF",
    yearStart: 2013,
    yearEnd: 2018,
    transponderType: "Hitag Pro",
    chipType: JSON.stringify(["PCF7953P", "ID49"]),
    compatibleParts: JSON.stringify([
      "HK83-15K601-AA"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Advanced encryption system with multiple compatible keys",
    dualSystem: false,
    partNumberPattern: "JAGUAR_HK83"
  }
];

// Update Lincoln entries to include aftermarket references
const lincolnEntries: TransponderSeed[] = [
  // Aviator with OEM parts
  {
    make: "LINCOLN",
    model: "AVIATOR",
    yearStart: 2020,
    yearEnd: null,
    transponderType: "HiTAG Pro",
    chipType: JSON.stringify(["ID47", "PCF7939FA", "PCF7953P"]),
    compatibleParts: JSON.stringify(["M3N-A2C931426"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "128-Bit HiTAG Pro system - OEM key",
    dualSystem: false,
    partNumberPattern: "LINCOLN_M3N"
  },
  // Aviator with aftermarket parts
  {
    make: "LINCOLN",
    model: "AVIATOR",
    yearStart: 2020,
    yearEnd: null,
    transponderType: "HiTAG Pro",
    chipType: JSON.stringify(["ID47", "PCF7939FA", "PCF7953P"]),
    compatibleParts: JSON.stringify(["164-R8278"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "128-Bit HiTAG Pro system - Aftermarket compatible",
    dualSystem: false,
    partNumberPattern: "LINCOLN_164R"
  },
  // Continental with OEM parts
  {
    make: "LINCOLN",
    model: "CONTINENTAL",
    yearStart: 2016,
    yearEnd: 2020,
    transponderType: "HiTAG Pro",
    chipType: JSON.stringify(["ID47", "PCF7939FA", "PCF7953P"]),
    compatibleParts: JSON.stringify(["M3N-A2C94078000"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "128-Bit HiTAG Pro system - OEM key",
    dualSystem: false,
    partNumberPattern: "LINCOLN_M3N"
  },
  // Continental with aftermarket parts
  {
    make: "LINCOLN",
    model: "CONTINENTAL",
    yearStart: 2016,
    yearEnd: 2020,
    transponderType: "HiTAG Pro",
    chipType: JSON.stringify(["ID47", "PCF7939FA", "PCF7953P"]),
    compatibleParts: JSON.stringify(["164-R8154"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "128-Bit HiTAG Pro system - Aftermarket compatible",
    dualSystem: false,
    partNumberPattern: "LINCOLN_164R"
  }
];

// Add Porsche entries
const porscheEntries: TransponderSeed[] = [
  {
    make: "PORSCHE",
    model: "911",
    yearStart: 1998,
    yearEnd: 1999,
    transponderType: "MEGAMOS 13",
    chipType: JSON.stringify(["ID13", "TP05"]),
    compatibleParts: JSON.stringify(["TP05", "T13"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Early MEGAMOS system",
    dualSystem: false
  },
  {
    make: "PORSCHE",
    model: "911",
    yearStart: 1999,
    yearEnd: 2005,
    transponderType: "MEGAMOS Crypto 48",
    chipType: JSON.stringify(["ID48", "TP08", "T6"]),
    compatibleParts: JSON.stringify(["TP08"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "MEGAMOS Crypto system with advanced encryption",
    dualSystem: false
  },
  {
    make: "PORSCHE",
    model: "CAYENNE",
    yearStart: 2004,
    yearEnd: 2009,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["PCF7946", "PCF7936AS"]),
    compatibleParts: JSON.stringify(["7L5959753"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Philips Crypto 2 system with PCF7946 compatibility",
    dualSystem: false,
    partNumberPattern: "PORSCHE_7L5"
  },
  {
    make: "PORSCHE",
    model: "CAYENNE",
    yearStart: 2011,
    yearEnd: null,
    transponderType: "Smart Key System",
    chipType: JSON.stringify(["PCF7945AC"]),
    compatibleParts: JSON.stringify(["5WK50136"]),
    frequency: "125 kHz" as ValidFrequency,
    remoteFrequency: "433.92 MHz" as ValidFrequency,
    notes: "Advanced smart key system with proximity features",
    dualSystem: true,
    partNumberPattern: "PORSCHE_5WK"
  },
  {
    make: "PORSCHE",
    model: "PANAMERA",
    yearStart: 2009,
    yearEnd: null,
    transponderType: "Smart Key System",
    chipType: JSON.stringify(["PCF7945AC"]),
    compatibleParts: JSON.stringify(["5WK50138"]),
    frequency: "125 kHz" as ValidFrequency,
    remoteFrequency: "433.92 MHz" as ValidFrequency,
    notes: "Smart key system with PCF7945AC transponder",
    dualSystem: true,
    partNumberPattern: "PORSCHE_5WK"
  }
];

// Add Toyota entries
const toyotaEntries: TransponderSeed[] = [
  // Camry generations
  {
    make: "TOYOTA",
    model: "CAMRY",
    yearStart: 2018,
    yearEnd: 2023,
    transponderType: "Texas Crypto DST AES",
    chipType: JSON.stringify(TOYOTA_CHIP_GENERATIONS['H']),
    compatibleParts: JSON.stringify(["89785-06040", "89785-06041"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "H-chip system with advanced encryption",
    dualSystem: false,
    partNumberPattern: "TOYOTA_89785"
  },
  {
    make: "TOYOTA",
    model: "CAMRY",
    yearStart: 2013,
    yearEnd: null,
    transponderType: "Texas Crypto DST AES",
    chipType: JSON.stringify(TOYOTA_CHIP_GENERATIONS['H']),
    compatibleParts: JSON.stringify([
      "89070-06420",
      "89070-06421",
      "HYQ12BDM"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "H-chip system with advanced encryption",
    dualSystem: false,
    partNumberPattern: "TOYOTA_HYQ12"
  },
  // Corolla generations
  {
    make: "TOYOTA",
    model: "COROLLA",
    yearStart: 1996,
    yearEnd: 2003,
    transponderType: "Texas 4C",
    chipType: JSON.stringify(TOYOTA_CHIP_GENERATIONS['4C']),
    compatibleParts: JSON.stringify(["89070-02570"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Early 4C system",
    dualSystem: false,
    partNumberPattern: "TOYOTA_89070"
  },
  {
    make: "TOYOTA",
    model: "COROLLA",
    yearStart: 2002,
    yearEnd: 2007,
    transponderType: "Texas Crypto 4D DST",
    chipType: JSON.stringify(TOYOTA_CHIP_GENERATIONS['4D']),
    compatibleParts: JSON.stringify(["89070-02640"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "4D67/70 system",
    dualSystem: false,
    partNumberPattern: "TOYOTA_89070"
  },
  {
    make: "TOYOTA",
    model: "COROLLA",
    yearStart: 2008,
    yearEnd: 2012,
    transponderType: "Texas Crypto DST 80-bit",
    chipType: JSON.stringify(TOYOTA_CHIP_GENERATIONS['G']),
    compatibleParts: JSON.stringify(["HYQ12BEL", "89070-02880"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "G-chip system",
    dualSystem: false,
    partNumberPattern: "TOYOTA_HYQ12"
  },
  {
    make: "TOYOTA",
    model: "COROLLA",
    yearStart: 2013,
    yearEnd: null,
    transponderType: "Texas Crypto DST AES",
    chipType: JSON.stringify(TOYOTA_CHIP_GENERATIONS['H']),
    compatibleParts: JSON.stringify(["HYQ12BEL", "89070-02882"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "H-chip system",
    dualSystem: false,
    partNumberPattern: "TOYOTA_HYQ12"
  }
];

// Add Alfa Romeo and GMC specific chip types
const alfaRomeoEntries: TransponderSeed[] = [
  {
    make: "ALFA ROMEO",
    model: "GIULIA",
    yearStart: 2016,
    yearEnd: 2020,
    transponderType: "Hitag AES",
    chipType: JSON.stringify(["ID4A", "ID51"]),
    compatibleParts: JSON.stringify(["156119222", "156140440"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Modern Hitag AES system",
    dualSystem: false,
    partNumberPattern: "ALFA_156"
  },
  {
    make: "ALFA ROMEO",
    model: "GIULIETTA",
    yearStart: 2010,
    yearEnd: 2016,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["ID46", "PCF7936", "PCF7946"]),
    compatibleParts: JSON.stringify(["71775511", "71754380", "71765806"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "PCF7946 MCU system",
    dualSystem: false,
    partNumberPattern: "ALFA_717"
  }
];

const gmcEntries: TransponderSeed[] = [
  {
    make: "GMC",
    model: "SIERRA",
    yearStart: 2019,
    yearEnd: null,
    transponderType: "Hitag 2 Extended",
    chipType: JSON.stringify(["ID46E", "PCF7952E", "PCF7937E"]),
    compatibleParts: JSON.stringify([
      "M3N-32337200",
      "84209237",
      "HYQ1ES"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Modern Hitag 2 Extended system",
    dualSystem: false,
    partNumberPattern: "GMC_M3N"
  },
  {
    make: "GMC",
    model: "YUKON",
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: "Hitag 2 Extended",
    chipType: JSON.stringify(["ID46E", "PCF7952E", "PCF7937E"]),
    compatibleParts: JSON.stringify([
      "HYQ1AA",
      "13580804",
      "13508280"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Hitag 2 Extended system",
    dualSystem: false,
    partNumberPattern: "GMC_HYQ"
  }
];

// Add Jeep entries
const jeepEntries: TransponderSeed[] = [
  // Cherokee generations
  {
    make: "JEEP",
    model: "CHEROKEE",
    yearStart: 1998,
    yearEnd: 2004,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["4D64", "TP21", "TPX2"]),
    compatibleParts: JSON.stringify(["XT27A66", "K-JMD"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Early Texas 4D system with universal transponder support",
    dualSystem: false
  },
  {
    make: "JEEP",
    model: "CHEROKEE",
    yearStart: 2015,
    yearEnd: 2021,
    transponderType: "Hitag AES",
    chipType: JSON.stringify(["ID4A", "PCF7953"]),
    compatibleParts: JSON.stringify([
      "GQ4-54T",
      "68105078AE",
      "68105078AC"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Modern AES system",
    dualSystem: false,
    partNumberPattern: "JEEP_68"
  },
  // Grand Cherokee generations
  {
    make: "JEEP",
    model: "GRAND CHEROKEE",
    yearStart: 2014,
    yearEnd: 2021,
    transponderType: "Hitag AES",
    chipType: JSON.stringify(["ID4A", "PCF7953"]),
    compatibleParts: JSON.stringify([
      "M3N-40821302",
      "68417821AA",
      "68250343AB"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Advanced encryption system with multiple compatible keys",
    dualSystem: false,
    partNumberPattern: "JEEP_M3N"
  },
  // Wrangler generations
  {
    make: "JEEP",
    model: "WRANGLER",
    yearStart: 2018,
    yearEnd: 2021,
    transponderType: "Hitag AES",
    chipType: JSON.stringify(["ID4A", "PCF7939"]),
    compatibleParts: JSON.stringify([
      "OHT1130261",
      "68416782",
      "68416782AA"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Latest generation AES system",
    dualSystem: false,
    partNumberPattern: "JEEP_68"
  }
];

// Add Mazda entries
const mazdaEntries: TransponderSeed[] = [
  {
    make: "MAZDA",
    model: "3",
    yearStart: 2019,
    yearEnd: null,
    transponderType: "Hitag AES",
    chipType: JSON.stringify(["PCF7953M"]),
    compatibleParts: JSON.stringify([
      "BCYN-67-5RY",
      "WAZSKE11D01",
      "BCYN-67-5DYB"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Latest generation AES system",
    dualSystem: false,
    partNumberPattern: "MAZDA_WAZSKE"
  },
  {
    make: "MAZDA",
    model: "CX-5",
    yearStart: 2012,
    yearEnd: 2019,
    transponderType: "Hitag Pro",
    chipType: JSON.stringify(["ID47", "PCF7953P"]),
    compatibleParts: JSON.stringify([
      "KDY5675DY",
      "SKE13D01",
      "KD33675RY"
    ]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "Hitag Pro system with multiple compatible keys",
    dualSystem: false,
    partNumberPattern: "MAZDA_KDY"
  }
];

// Update the main seed data array
export const transponderSeedData: TransponderSeed[] = [
  {
    make: "TOYOTA",
    model: "CAMRY",
    yearStart: 2018,
    yearEnd: 2023,
    transponderType: "Texas Crypto DST AES",
    chipType: JSON.stringify(TOYOTA_CHIP_GENERATIONS['H']),
    compatibleParts: JSON.stringify(["89785-06040", "89785-06041"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "H-chip system with advanced encryption",
    dualSystem: false,
    partNumberPattern: "TOYOTA_89785"
  },
  {
    make: "HONDA",
    model: "CIVIC",
    yearStart: 2016,
    yearEnd: 2022,
    transponderType: "G Chip",
    chipType: JSON.stringify(["G", "46"]),
    compatibleParts: JSON.stringify(["35118-TBA-A00", "35118-TBA-A01"]),
    frequency: "125 kHz" as ValidFrequency,
    notes: "G chip with rolling code",
    dualSystem: false
  },
  ...fordF150Entry,
  {
    make: "FORD",
    model: "TRANSIT",
    yearStart: 2016,
    yearEnd: null,
    transponderType: "Philips Crypto 3",
    chipType: JSON.stringify(["ID47", "PCF7939FA", "PCF7945F"]),
    compatibleParts: JSON.stringify(["GK2T-15K601-AA", "GK2T-15K601-AB", "A2C94379403"]),
    frequency: "434 MHz",
    notes: "Modern proximity system with advanced encryption",
    dualSystem: false
  },
  {
    make: "CHEVROLET",
    model: "SILVERADO",
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: "Hitag 3",
    chipType: JSON.stringify(["HITAG3", "PCF7939MA"]),
    compatibleParts: JSON.stringify(["13508771", "13508772"]),
    frequency: "125 kHz",
    notes: "Latest generation system",
    dualSystem: false
  },
  {
    make: "CHRYSLER",
    model: "ASPEN",
    yearStart: 2005,
    yearEnd: 2009,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["Hitag-2", "ID46", "PCF7941", "PCF7936"]),
    compatibleParts: JSON.stringify(["KOBDT04A", "05179514AA", "56038757AE"]),
    frequency: "125 kHz",
    notes: "Hitag-2 system with PCF7941/PCF7936 compatibility. Uses KOBDT04A key series. Compatible with aftermarket transponders.",
    dualSystem: false
  },
  {
    make: "CHRYSLER",
    model: "CIRRUS",
    yearStart: 1999,
    yearEnd: 2000,
    transponderType: "Texas Crypto",
    chipType: JSON.stringify(["4D64"]),
    compatibleParts: JSON.stringify(["TP21", "TPX2", "GTI", "XT27", "K-JMD"]),
    frequency: "125 kHz",
    notes: "Texas 4D64 system",
    dualSystem: false
  },
  {
    make: "CHRYSLER",
    model: "CROSSFIRE",
    yearStart: 2003,
    yearEnd: 2008,
    transponderType: "Philips 33",
    chipType: JSON.stringify(["ID33", "PCF7930"]),
    compatibleParts: null,
    frequency: "125 kHz",
    notes: "PCF7930 precoded system",
    dualSystem: false
  },
  {
    make: "CHRYSLER",
    model: "PACIFICA",
    yearStart: 2017,
    yearEnd: 2021,
    transponderType: "Hitag AES",
    chipType: JSON.stringify(["HITAG-AES", "PCF7953M", "PCF7953Mx", "NCF29A1M"]),
    compatibleParts: JSON.stringify(["M3N97395900", "68217829", "68217829AC"]),
    frequency: "125 kHz",
    notes: "Latest generation AES system",
    dualSystem: false
  },
  {
    make: "CHRYSLER",
    model: "300",
    yearStart: 2011,
    yearEnd: 2021,
    transponderType: "Hitag AES",
    chipType: JSON.stringify(["HITAG-AES", "PCF7953M", "PCF7953Mx"]),
    compatibleParts: JSON.stringify(["M3M-40821302", "68155687AB", "68394191", "68394191AA"]),
    frequency: "125 kHz",
    notes: "Modern AES encryption system",
    dualSystem: false
  },
  {
    make: "FORD",
    model: "EDGE",
    yearStart: 2015,
    yearEnd: 2017,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["DST80", "ID63-6F"]),
    compatibleParts: JSON.stringify([
      "DS7T-15K601-CM", "DS7T-15K601-CL", 
      "DS7T-15K601-CG", "DS7T-15K601-CH"
    ]),
    frequency: "125 kHz",
    remoteFrequency: "902 MHz",
    notes: "Tiris DST80 system with smart key functionality. Compatible with aftermarket TPX7.",
    dualSystem: true,
    partNumberPattern: "FORD_DS7T"
  },
  ...fordExplorerEntry,
  {
    make: "FORD",
    model: "FUSION",
    yearStart: 2017,
    yearEnd: 2020,
    transponderType: "Philips Crypto 3",
    chipType: JSON.stringify(["ID47", "PCF7939FA", "PCF7953P"]),
    compatibleParts: JSON.stringify([
      "HC3T-15K601-BC", "HC3T-15K601-BB",
      "HC3T-15K601-BD", "HC3T-15K601-BA"
    ]),
    frequency: "125 kHz",
    remoteFrequency: "902 MHz",
    notes: "HiTAG Pro system with dual frequency operation",
    dualSystem: true,
    partNumberPattern: "FORD_HC3T"
  },
  ...jaguarEntries,
  ...lincolnEntries,
  ...porscheEntries,
  ...toyotaEntries,
  ...alfaRomeoEntries,
  ...gmcEntries,
  ...jeepEntries,
  ...mazdaEntries
];

// Validate all entries
transponderSeedData.forEach(validateTransponderData); 