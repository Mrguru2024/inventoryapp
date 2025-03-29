import { TransponderData } from "@/app/services/transponderService";

export const bmwTransponderData: TransponderData[] = [
  // Modern AES Systems (2015+)
  {
    id: "BMW-1-SERIES-2015",
    make: "BMW",
    model: "1-SERIES",
    yearStart: 2015,
    yearEnd: null,
    transponderType: "Philips Crypto 3",
    chipType: JSON.stringify(["Hitag3 128-bit AES", "ID47", "PCF7953x"]),
    compatibleParts: JSON.stringify(["14LP1410T6"]),
    frequency: "433.92 MHz",
    notes: "Latest generation transponder system",
    dualSystem: false,
  },

  // Legacy 4C Systems (1996-2002)
  {
    id: "BMW-3-SERIES-1996-2002",
    make: "BMW",
    model: "3-SERIES",
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
    id: "BMW-5-SERIES-2002-2014",
    make: "BMW",
    model: "5-SERIES",
    yearStart: 2002,
    yearEnd: 2014,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["ID46", "Hitag2", "PCF7952"]),
    compatibleParts: JSON.stringify(["37172-57L20"]),
    frequency: "433.92 MHz",
    notes: "Mid-generation system",
    dualSystem: false,
  },

  // BMW 1-Series CAS2
  {
    id: "BMW-1-SERIES-2004-2006",
    make: "BMW",
    model: "1-SERIES",
    yearStart: 2004,
    yearEnd: 2006,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["ID46", "PCF7936AS"]),
    compatibleParts: JSON.stringify([
      "66126986582",
      "66129268489",
      "66129268488",
    ]),
    frequency: "433.92 MHz",
    notes: "BMW CAS2 system",
    dualSystem: false,
  },

  // BMW 1-Series CAS3
  {
    id: "BMW-1-SERIES-2007-2010",
    make: "BMW",
    model: "1-SERIES",
    yearStart: 2007,
    yearEnd: 2010,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["ID46", "PCF7945", "PCF7936"]),
    compatibleParts: JSON.stringify([
      "5WK49145",
      "5WK49146",
      "5WK49147",
      "66126986583",
      "66129268488",
    ]),
    frequency: "433.92 MHz",
    notes: "CAS3, CAS3+ systems",
    dualSystem: false,
  },

  // BMW Motorcycle
  {
    id: "BMW-R1200GS-2005-2011",
    make: "BMW",
    model: "R1200GS",
    yearStart: 2005,
    yearEnd: 2011,
    transponderType: "Philips Crypto 2",
    chipType: JSON.stringify(["ID46", "PCF7936"]),
    compatibleParts: JSON.stringify(["Silca T14", "JMA TP12"]),
    frequency: "433.92 MHz",
    notes: "Motorcycle System",
    dualSystem: false,
  },
];
