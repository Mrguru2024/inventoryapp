interface TransponderSeed {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string;
  compatibleParts: string | null;
  frequency:
    | "125 kHz"
    | "134.2 kHz"
    | "315 MHz"
    | "433.92 MHz"
    | "434 MHz"
    | "868 MHz"
    | "902 MHz"
    | null;
  remoteFrequency?:
    | "125 kHz"
    | "134.2 kHz"
    | "315 MHz"
    | "433.92 MHz"
    | "434 MHz"
    | "868 MHz"
    | "902 MHz"
    | null;
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
  "H",
  "8A",
  "H8A",
  "G",
  "46",

  // Texas Instruments
  "4C",
  "ID4C",
  "4D60",
  "ID60",
  "4D63",
  "ID63",
  "4D64",
  "DST80",
  "ID63-6F",
  "DST40",

  // Philips/NXP
  "ID33",
  "ID42",
  "ID44",
  "ID46",
  "ID47",
  "ID4A",
  "PCF7930",
  "PCF7931",
  "PCF7935",
  "PCF7936",
  "PCF7939",
  "PCF7939FA",
  "PCF7939MA",
  "PCF7941",
  "PCF7945F",
  "PCF7952",
  "PCF7953",
  "PCF7953M",
  "PCF7953Mx",
  "PCF7953P",

  // Hitag Family
  "Hitag-2",
  "HITAG3",
  "NCF29A1M",
  "HITAG-AES",

  // Aftermarket
  "TPX1",
  "TPX2",
  "TPX7",
  "GTI",
  "XT27",
  "K-JMD",

  // Megamos Family
  "ID13",
  "ID48",
  "ID49",

  // Philips/NXP Additional
  "PCF7953A",
  "PCF7953AT",
  "PCF7953P",

  // Texas Instruments Additional
  "ID4C",
  "4D60",
  "4D63",
  "DST80",
  "ID63-6F",

  // Philips/NXP Additional
  "PCF7945A",
  "PCF7939FA",
  "PCF7953A",

  // Aftermarket
  "TPX1",
  "TPX2",
  "TPX7",
  "TP02",
  "TP06",
  "TP20",
  "TP33",
  "K-JMD",
  "XT27",

  // Megamos Family
  "T6",
  "TP05",
  "TP08",

  // Philips Additional
  "PCF7946",
  "PCF7936AS",
  "PCF7945AC",
  "TPX4",
  "TP12",

  // Toyota Specific
  "ID67",
  "ID70",
  "ID72",
  "ID74",
  "ID75",
  "4D67",
  "4D70",
  "4D72",
  "4D74",
  "4D75",
  "G",
  "H",
  "H8A",

  // Aftermarket Additional
  "TPX1",
  "TPX2",
  "TP07",
  "CN1",
  "CN2",
  "CN5",
  "TX1",
  "TX2",
  "YS-01",

  // Alfa Romeo Specific
  "ID33",
  "ID44",
  "ID46",
  "ID48",
  "ID4A",
  "ID51",
  "PCF7930",
  "PCF7931",
  "PCF7935",
  "PCF7936",
  "PCF7941",
  "PCF7946",

  // GMC Specific
  "PCF7937E",
  "PCF7952E",
  "PCF7961E",
  "ID46E",
  "TP12GM",
  "T14",
  "CN3",
  "XT27A66",

  // Jeep Specific
  "4D64",
  "ID4A",
  "ID88",
  "PCF7941AT",
  "PCF7961",
  "PCF7953M",
  "TP12CH",
  "TP21",

  // Mazda Specific
  "ID12",
  "ID33",
  "4D60",
  "4D63",
  "ID63-6F",
  "TK5561",
  "PCF7953P",
  "PCF7953M",
  "TP04",
  "TP17",
  "TP20",
  "DST80",
] as const;

// Define frequency type
type ValidFrequency = (typeof VALID_FREQUENCIES)[number];

const VALID_FREQUENCIES = [
  "125 kHz", // LF transponder frequency
  "134.2 kHz", // LF alternate
  "315 MHz", // RF North America
  "433.92 MHz", // RF Europe
  "434 MHz", // RF Europe alternate
  "868 MHz", // RF Europe high frequency
  "902 MHz", // RF North America high frequency
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
  JEEP_M3N: /^M3N-[0-9]{8}$/,
  JEEP_68: /^68[0-9]{6}[A-Z]{2}$/,
  MAZDA_CC: /^CC[0-9]{2}-67-5[A-Z]{3}$/,
  MAZDA_NE: /^NE[0-9]{2}-67-5[A-Z]{3}$/,
  MAZDA_KDY: /^KDY[0-9]-67-5[A-Z]{2,3}$/,
  MAZDA_WAZSKE: /^WAZSKE[0-9]{2}D[0-9]{2}$/,
  MAZDA_5WK: /^5WK[0-9]{5}[A-Z]?$/,
} as const;

// Add Toyota chip generation types and validation
const TOYOTA_CHIP_GENERATIONS = {
  "4C": ["4C", "TPX1", "TP07", "CN1", "TX1"] as const,
  "4D": ["4D67", "ID67", "TPX2", "CN2", "CN5", "TX2", "YS-01"] as const,
  G: ["4D72", "ID72", "DST80", "G"] as const,
  H: ["4D74", "4D75", "ID74", "ID75", "H"] as const,
} as const;

// Create a type for all valid Toyota chips
type ToyotaChipType =
  (typeof TOYOTA_CHIP_GENERATIONS)[keyof typeof TOYOTA_CHIP_GENERATIONS][number];

// Expand Toyota cross-reference data
const AFTERMARKET_CROSS_REF: Record<string, AftermarketCrossRef[]> = {
  TOYOTA: [
    // H-chip systems
    {
      oem: "89904-58360",
      aftermarket: ["TPX2", "CN2", "CN5", "K-JMD", "YS-01"],
      notes: "H-chip system (2015+)",
    },
    {
      oem: "HYQ14FBA",
      aftermarket: ["TPX2", "CN2", "K-JMD"],
      notes: "G-chip system (2010-2015)",
    },
    {
      oem: "89070-02880",
      aftermarket: ["TPX2", "CN2", "K-JMD"],
      notes: "H-chip system (2013+)",
    },
    // G-chip systems
    {
      oem: "HYQ12BBY",
      aftermarket: ["TPX2", "CN5", "YS-01"],
      notes: "G-chip system (2011-2018)",
    },
    // 4D systems
    {
      oem: "89904-28091",
      aftermarket: ["TPX2", "CN2", "K-JMD"],
      notes: "4D67 system (2006-2014)",
    },
  ],
  "ALFA ROMEO": [
    {
      oem: "156119222",
      aftermarket: ["ID4A", "ID51"],
      notes: "Hitag AES system (2016+)",
    },
    {
      oem: "71775511",
      aftermarket: ["PCF7936", "XT27", "K-JMD"],
      notes: "Crypto 2 system with PCF7946 MCU",
    },
  ],
  GMC: [
    {
      oem: "HYQ14EA",
      aftermarket: ["PCF7937E", "PCF7961E"],
      notes: "Hitag 2 Extended system",
    },
    {
      oem: "M3N32337100",
      aftermarket: ["PCF7952E", "PCF7937E"],
      notes: "Modern Hitag 2 system",
    },
  ],
  JEEP: [
    {
      oem: "OHT692427AA",
      aftermarket: ["PCF7936", "PCF7941AT", "TP12CH"],
      notes: "Crypto 2 system (2005-2007)",
    },
    {
      oem: "M3N5W783X",
      aftermarket: ["PCF7961", "XT27A66", "K-JMD"],
      notes: "Hitag 2 system (2008-2017)",
    },
    {
      oem: "68105078AE",
      aftermarket: ["PCF7953", "ID4A"],
      notes: "Hitag AES system (2015+)",
    },
  ],
  MAZDA: [
    {
      oem: "CC51675RYC",
      aftermarket: ["4D63", "TP20", "TPX2", "XT27", "K-JMD"],
      notes: "Texas 4D system (2003-2007)",
    },
    {
      oem: "KDY5-67-5DY",
      aftermarket: ["ID47", "PCF7953P"],
      notes: "Hitag Pro system (2014+)",
    },
    {
      oem: "WAZSKE13D02",
      aftermarket: ["PCF7953P", "ID47"],
      notes: "Modern Hitag Pro system",
    },
  ],
};

// Validation function
function validateTransponderData(data: TransponderSeed): void {
  try {
    const chipTypes = JSON.parse(data.chipType);
    if (!Array.isArray(chipTypes)) {
      throw new Error(`Invalid chipType format for ${data.make} ${data.model}`);
    }

    chipTypes.forEach((chip) => {
      if (!VALID_CHIP_TYPES.includes(chip)) {
        console.error(`Available chip types:`, VALID_CHIP_TYPES);
        throw new Error(
          `Invalid chip type "${chip}" for ${data.make} ${data.model}. Please check VALID_CHIP_TYPES.`
        );
      }
    });

    // Updated frequency validation
    if (data.frequency) {
      const isValidFrequency = VALID_FREQUENCIES.includes(
        data.frequency as ValidFrequency
      );
      if (!isValidFrequency) {
        console.error(`Available frequencies:`, VALID_FREQUENCIES);
        throw new Error(
          `Invalid frequency "${data.frequency}" for ${data.make} ${data.model}`
        );
      }
    }

    if (data.remoteFrequency) {
      const isValidRemoteFreq = VALID_FREQUENCIES.includes(
        data.remoteFrequency as ValidFrequency
      );
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
        if (data.partNumberPattern && data.partNumberPattern.includes("_")) {
          const [make, series] = data.partNumberPattern.split("_");
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
      console.error(
        `Validation error for ${data.make} ${data.model}:`,
        error.message
      );
    }
    throw error;
  }
}

// Add validation for frequency ranges
function validateFrequencyRange(frequency: ValidFrequency | null): void {
  if (!frequency) return;

  const [value, unit] = frequency.split(" ");
  const numValue = parseFloat(value);

  switch (unit) {
    case "kHz":
      if (numValue < 100 || numValue > 150) {
        throw new Error(`Invalid kHz frequency: ${frequency}`);
      }
      break;
    case "MHz":
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

// Update the main seed data array
export const transponderSeedData: TransponderSeed[] = [
  {
    make: "TOYOTA",
    model: "CAMRY",
    yearStart: 2018,
    yearEnd: 2023,
    transponderType: "H",
    chipType: JSON.stringify(["4D72"]),
    compatibleParts: JSON.stringify(["89785-06040", "89785-06041"]),
    frequency: "433.92 MHz",
    notes: "Smart key system",
    dualSystem: false,
  },
  {
    make: "HONDA",
    model: "CIVIC",
    yearStart: 2016,
    yearEnd: 2022,
    transponderType: "G",
    chipType: JSON.stringify(["ID47"]),
    compatibleParts: JSON.stringify(["35118-TBA-A00", "35118-TBA-A01"]),
    frequency: "433.92 MHz",
    notes: "Push to start",
    dualSystem: false,
  },
  {
    make: "FORD",
    model: "F-150",
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: "H",
    chipType: JSON.stringify(["4D63"]),
    compatibleParts: JSON.stringify(["164-R8067", "164-R8073"]),
    frequency: "125 kHz",
    remoteFrequency: "315 MHz",
    notes: "Remote start capable",
    dualSystem: true,
  },
];

// Validate all entries
transponderSeedData.forEach(validateTransponderData);
