import { TransponderData } from "@/app/services/transponderService";

export const chryslerTransponderData: TransponderData[] = [
  // Legacy 4D Systems (1998-2006)
  {
    id: "CHRYSLER-CIRRUS-1999",
    make: "CHRYSLER",
    model: "CIRRUS",
    yearStart: 1999,
    yearEnd: 2000,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify([
      "4D64",
      "JMA TP21",
      "JMA TPX2",
      "SILCA GTI",
      "XT27",
      "K-JMD",
    ]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "First generation transponder system",
    dualSystem: false,
  },

  // Hitag2 Systems (2004-2016)
  {
    id: "CHRYSLER-PACIFICA-2004",
    make: "CHRYSLER",
    model: "PACIFICA",
    yearStart: 2004,
    yearEnd: 2008,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["Hitag-2", "ID46", "PCF7941", "PCF7936"]),
    compatibleParts: JSON.stringify([
      "M3N65981772",
      "04589053AC",
      "04589053AD",
    ]),
    frequency: "433.92 MHz",
    notes: "Mid-generation system",
    dualSystem: false,
  },

  // Modern AES Systems (2015+)
  {
    id: "CHRYSLER-300-2011",
    make: "CHRYSLER",
    model: "300",
    yearStart: 2011,
    yearEnd: 2021,
    transponderType: "Hitag AES",
    chipType: JSON.stringify(["ID 4A", "PCF7953M", "PCF7953Mx"]),
    compatibleParts: JSON.stringify([
      "M3M-40821302",
      "68155687AB",
      "68394191",
      "68394191AA",
    ]),
    frequency: "433.92 MHz",
    notes: "Latest generation system",
    dualSystem: false,
  },

  {
    id: "CHRYSLER-300-2005",
    make: "CHRYSLER",
    model: "300",
    yearStart: 2005,
    yearEnd: 2010,
    transponderType: "Texas Crypto",
    chipType: JSON.stringify(["ID33", "PCF7935", "TPX1"]),
    compatibleParts: JSON.stringify(["04589677AC", "04589677AD"]),
    frequency: "315 MHz",
    notes: "Mid-generation system",
    dualSystem: false,
  },
];
