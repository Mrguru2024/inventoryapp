import { TransponderData } from "@/app/services/transponderService";

export const subaruTransponderData: TransponderData[] = [
  // B9 Tribeca
  {
    id: "SUBARU-TRIBECA-2005-2006",
    make: "SUBARU",
    model: "B9 TRIBECA",
    yearStart: 2005,
    yearEnd: 2006,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D60", "JMA TPX2"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "First generation Tribeca",
    dualSystem: false,
  },
  {
    id: "SUBARU-TRIBECA-2007",
    make: "SUBARU",
    model: "B9 TRIBECA",
    yearStart: 2007,
    yearEnd: null,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Updated transponder system",
    dualSystem: false,
  },

  // Baja
  {
    id: "SUBARU-BAJA-2005-2007",
    make: "SUBARU",
    model: "BAJA",
    yearStart: 2005,
    yearEnd: 2007,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Unique pickup truck model",
    dualSystem: false,
  },

  // BRZ
  {
    id: "SUBARU-BRZ-2012",
    make: "SUBARU",
    model: "BRZ",
    yearStart: 2012,
    yearEnd: null,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["ID 4D62-6F", "6F-62"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Sports car platform",
    dualSystem: false,
  },

  // Forester
  {
    id: "SUBARU-FORESTER-1998-2003",
    make: "SUBARU",
    model: "FORESTER",
    yearStart: 1998,
    yearEnd: 2003,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D60", "JMA TPX2", "JMA TP19"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "First generation Forester",
    dualSystem: false,
  },
  {
    id: "SUBARU-FORESTER-2004-2007",
    make: "SUBARU",
    model: "FORESTER",
    yearStart: 2004,
    yearEnd: 2007,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Second generation Forester",
    dualSystem: false,
  },
  {
    id: "SUBARU-FORESTER-2008-2011",
    make: "SUBARU",
    model: "FORESTER",
    yearStart: 2008,
    yearEnd: 2011,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Third generation Forester",
    dualSystem: false,
  },
  {
    id: "SUBARU-FORESTER-2012",
    make: "SUBARU",
    model: "FORESTER",
    yearStart: 2012,
    yearEnd: null,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["ID 4D62-6F", "6F-62"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Fourth generation Forester",
    dualSystem: false,
  },

  // G3X Justy
  {
    id: "SUBARU-JUSTY-2004",
    make: "SUBARU",
    model: "G3X JUSTY",
    yearStart: 2004,
    yearEnd: null,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D65", "JMA TPX2", "JMA TP27"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "European market model",
    dualSystem: false,
  },

  // Impreza
  {
    id: "SUBARU-IMPREZA-1996-2000",
    make: "SUBARU",
    model: "IMPREZA",
    yearStart: 1996,
    yearEnd: 2000,
    transponderType: "Philips ID33",
    chipType: JSON.stringify([
      "ID33",
      "JMA TP01",
      "JMA TP05",
      "PCF7930",
      "PCF7931",
    ]),
    compatibleParts: JSON.stringify([]),
    frequency: "125 kHz",
    notes: "First generation Impreza",
    dualSystem: false,
  },
  {
    id: "SUBARU-IMPREZA-2001-2003",
    make: "SUBARU",
    model: "IMPREZA",
    yearStart: 2001,
    yearEnd: 2003,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D60", "JMA TPX2", "JMA TP19"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Second generation Impreza",
    dualSystem: false,
  },
  {
    id: "SUBARU-IMPREZA-2004-2010",
    make: "SUBARU",
    model: "IMPREZA",
    yearStart: 2004,
    yearEnd: 2010,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Third generation Impreza",
    dualSystem: false,
  },
  {
    id: "SUBARU-IMPREZA-2011",
    make: "SUBARU",
    model: "IMPREZA",
    yearStart: 2011,
    yearEnd: null,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["ID 4D62-6F", "6F-62"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Fourth generation Impreza",
    dualSystem: false,
  },

  // Justy
  {
    id: "SUBARU-JUSTY-1996-2003",
    make: "SUBARU",
    model: "JUSTY",
    yearStart: 1996,
    yearEnd: 2003,
    transponderType: "Texas 4C",
    chipType: JSON.stringify(["ID 4C", "JMA TPX1", "JMA TP07"]),
    compatibleParts: JSON.stringify([]),
    frequency: "125 kHz",
    notes: "First generation Justy",
    dualSystem: false,
  },
  {
    id: "SUBARU-JUSTY-2006",
    make: "SUBARU",
    model: "JUSTY",
    yearStart: 2006,
    yearEnd: null,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Second generation Justy",
    dualSystem: false,
  },

  // Legacy
  {
    id: "SUBARU-LEGACY-1996-1998",
    make: "SUBARU",
    model: "LEGACY",
    yearStart: 1996,
    yearEnd: 1998,
    transponderType: "Philips ID33",
    chipType: JSON.stringify([
      "ID33",
      "JMA TP01",
      "JMA TP05",
      "PCF7930",
      "PCF7931",
    ]),
    compatibleParts: JSON.stringify([]),
    frequency: "125 kHz",
    notes: "First generation Legacy",
    dualSystem: false,
  },
  {
    id: "SUBARU-LEGACY-1998-2004",
    make: "SUBARU",
    model: "LEGACY",
    yearStart: 1998,
    yearEnd: 2004,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D60", "JMA TPX2", "JMA TP19"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Second generation Legacy",
    dualSystem: false,
  },
  {
    id: "SUBARU-LEGACY-2005-2009",
    make: "SUBARU",
    model: "LEGACY",
    yearStart: 2005,
    yearEnd: 2009,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Third generation Legacy",
    dualSystem: false,
  },
  {
    id: "SUBARU-LEGACY-2010",
    make: "SUBARU",
    model: "LEGACY",
    yearStart: 2010,
    yearEnd: null,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["ID 4D62-6F", "6F-62"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Fourth generation Legacy",
    dualSystem: false,
  },

  // Liberty (Australian market Legacy)
  {
    id: "SUBARU-LIBERTY-1998-2003",
    make: "SUBARU",
    model: "LIBERTY",
    yearStart: 1998,
    yearEnd: 2003,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D60", "JMA TPX2", "JMA TP19"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Australian market Legacy",
    dualSystem: false,
  },
  {
    id: "SUBARU-LIBERTY-2004-2010",
    make: "SUBARU",
    model: "LIBERTY",
    yearStart: 2004,
    yearEnd: 2010,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Australian market Legacy",
    dualSystem: false,
  },
  {
    id: "SUBARU-LIBERTY-2011",
    make: "SUBARU",
    model: "LIBERTY",
    yearStart: 2011,
    yearEnd: null,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["ID 4D62-6F", "6F-62"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Australian market Legacy",
    dualSystem: false,
  },

  // Outback
  {
    id: "SUBARU-OUTBACK-1996-1998",
    make: "SUBARU",
    model: "OUTBACK",
    yearStart: 1996,
    yearEnd: 1998,
    transponderType: "Philips ID33",
    chipType: JSON.stringify([
      "ID33",
      "JMA TP01",
      "JMA TP05",
      "PCF7930",
      "PCF7931",
    ]),
    compatibleParts: JSON.stringify([]),
    frequency: "125 kHz",
    notes: "First generation Outback",
    dualSystem: false,
  },
  {
    id: "SUBARU-OUTBACK-1999-2004",
    make: "SUBARU",
    model: "OUTBACK",
    yearStart: 1999,
    yearEnd: 2004,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D60", "JMA TPX2", "JMA TP19"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Second generation Outback",
    dualSystem: false,
  },
  {
    id: "SUBARU-OUTBACK-2005-2009",
    make: "SUBARU",
    model: "OUTBACK",
    yearStart: 2005,
    yearEnd: 2009,
    transponderType: "Texas Crypto 4D",
    chipType: JSON.stringify(["ID 4D62", "JMA TPX2", "JMA TP28"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Third generation Outback",
    dualSystem: false,
  },
  {
    id: "SUBARU-OUTBACK-2009",
    make: "SUBARU",
    model: "OUTBACK",
    yearStart: 2009,
    yearEnd: null,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["ID 4D62-6F", "6F-62"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Fourth generation Outback",
    dualSystem: false,
  },

  // Trezia
  {
    id: "SUBARU-TREZIA-2011",
    make: "SUBARU",
    model: "TREZIA",
    yearStart: 2011,
    yearEnd: null,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["ID 4D62-6F", "6F-62"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "European market model",
    dualSystem: false,
  },

  // XV
  {
    id: "SUBARU-XV-2012",
    make: "SUBARU",
    model: "XV",
    yearStart: 2012,
    yearEnd: null,
    transponderType: "Texas Crypto 2",
    chipType: JSON.stringify(["ID 4D62-6F", "6F-62"]),
    compatibleParts: JSON.stringify([]),
    frequency: "315 MHz",
    notes: "Crossover model based on Impreza platform",
    dualSystem: false,
  },
];
