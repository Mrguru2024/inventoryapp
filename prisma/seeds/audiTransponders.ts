import { TransponderData } from "@/app/services/transponderService";

export const audiTransponderData: TransponderData[] = [
  // Modern AES Systems (2015+)
  {
    id: "AUDI-A3-2015",
    make: "AUDI",
    model: "A3",
    yearStart: 2015,
    yearEnd: null,
    transponderType: "Philips Crypto 3",
    chipType: JSON.stringify(["Hitag3 128-bit AES", "ID47", "PCF7953x"]),
    compatibleParts: JSON.stringify(["4H0957533"]),
    frequency: "433.92 MHz",
    notes: "Latest generation transponder system",
    dualSystem: false,
  },

  // Legacy 4C Systems (1996-2002)
  {
    id: "AUDI-A4-1996-2002",
    make: "AUDI",
    model: "A4",
    yearStart: 1996,
    yearEnd: 2002,
    transponderType: "Texas 4C",
    chipType: JSON.stringify(["ID4C", "Silca 4C", "JMA TP07", "JMA TPX1"]),
    compatibleParts: JSON.stringify([]),
    frequency: "125 kHz",
    notes: "First generation transponder system",
    dualSystem: false,
  },

  // Hitag2 Systems (2002-2014)
  {
    id: "AUDI-A6-2002-2014",
    make: "AUDI",
    model: "A6",
    yearStart: 2002,
    yearEnd: 2014,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["ID46", "Hitag2", "PCF7952"]),
    compatibleParts: JSON.stringify(["4F0957533"]),
    frequency: "433.92 MHz",
    notes: "Mid-generation system",
    dualSystem: false,
  },
];
