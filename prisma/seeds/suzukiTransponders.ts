import { TransponderKeyData } from '@/app/services/transponderService';

const suzukiTransponderData: TransponderKeyData[] = [
  // Modern AES Systems (2015+)
  {
    id: "SUZUKI-BALENO-2015",
    make: "SUZUKI",
    model: "BALENO",
    yearStart: 2015,
    transponderType: "Philips Crypto 3",
    chipType: ["Hitag3 128-bit AES", "ID47", "PCF7953x"],
    compatibleParts: ["14LP1410T6"],
    notes: "Latest generation transponder system"
  },
  
  // Legacy 4C Systems (1996-2002)
  {
    id: "SUZUKI-ALTO-1996-2002",
    make: "SUZUKI",
    model: "ALTO",
    yearStart: 1996,
    yearEnd: 2002,
    transponderType: "Texas 4C",
    chipType: ["ID4C", "Silca 4C", "JMA TP07", "JMA TPX1"],
    notes: "First generation transponder system"
  },
  
  // Hitag2 Systems (2002-2014)
  {
    id: "SUZUKI-KIZASHI-2010-2014",
    make: "SUZUKI",
    model: "KIZASHI",
    yearStart: 2010,
    yearEnd: 2014,
    transponderType: "Philips Crypto 2",
    chipType: ["ID46", "Hitag2", "PCF7952"],
    compatibleParts: ["37172-57L20"],
    notes: "Mid-generation system"
  },
  
  // Dual System Vehicles
  {
    id: "SUZUKI-JIMNY-2002-2006",
    make: "SUZUKI",
    model: "JIMNY",
    yearStart: 2002,
    yearEnd: 2006,
    transponderType: "Dual System",
    chipType: ["Texas Crypto 4D", "4D65", "JMA TP27", "JMA TPX2", "Philips Crypto ID40", "JMA TP09"],
    dualSystem: true,
    notes: "Vehicle may use either Texas or Philips system"
  },
  
  // Latest Generation (2015+)
  {
    id: "SUZUKI-VITARA-2015",
    make: "SUZUKI",
    model: "VITARA",
    yearStart: 2015,
    transponderType: "Hitag Pro",
    chipType: ["Hitag Pro"],
    compatibleParts: ["37172-54P03", "37172-54P01", "37172-54P00"],
    notes: "Latest platform transponder"
  },
  
  // Motorcycles (🏍)
  {
    id: "SUZUKI-GSX-R-1000-2006",
    make: "SUZUKI",
    model: "GSX R-1000",
    yearStart: 2006,
    transponderType: "Texas Crypto 4D",
    chipType: ["4D71", "JMA TP28"],
    notes: "Motorcycle system"
  },
  {
    id: "SUZUKI-HAYABUSA-2007",
    make: "SUZUKI",
    model: "HAYABUSA",
    yearStart: 2007,
    transponderType: "Texas Crypto 4D",
    chipType: ["4D71", "JMA TP28"],
    notes: "Motorcycle system"
  },
  {
    id: "SUZUKI-BURGMAN-2012",
    make: "SUZUKI",
    model: "BURGMAN",
    yearStart: 2012,
    transponderType: "Texas Crypto 4D",
    chipType: ["4D71", "JMA TP28"],
    notes: "Motorcycle system"
  },
  {
    id: "SUZUKI-SWIFT-2005",
    make: "SUZUKI",
    model: "SWIFT",
    yearStart: 2005,
    yearEnd: 2010,
    transponderType: "Philips Crypto 2",
    chipType: ["ID46", "PCF7936", "TP12"],
    compatibleParts: ["37145-63J00", "37145-63J10"]
  }
];

module.exports = { suzukiTransponderData }; 