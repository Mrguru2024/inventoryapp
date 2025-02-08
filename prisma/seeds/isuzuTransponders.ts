namespace TransponderSeeds {
  export const isuzuTransponderData = [
    // Passenger Vehicles
    {
      make: "ISUZU",
      model: "ASCENDER",
      yearStart: 2003,
      yearEnd: 2008,
      transponderType: "Non-Transponder",
      chipType: [],
      notes: "Mechanical key only - no transponder"
    },
    {
      make: "ISUZU",
      model: "ASKA",
      yearStart: 1998,
      yearEnd: 2002,
      transponderType: "Megamos Crypto 48",
      chipType: ["ID48", "JMA TP08", "KD48", "CN6"]
    },
    {
      make: "ISUZU",
      model: "D-MAX",
      yearStart: 2012,
      transponderType: "Dual System",
      chipType: ["Philips Crypto 2 ID46", "NXP Hitag-3", "ID49"],
      compatibleParts: ["EMU470102", "ACJ932U01"],
      dualSystem: true,
      notes: "Vehicle may use either ID46 or ID49 system"
    },
    
    // Commercial Vehicles - Trucks
    {
      make: "ISUZU",
      model: "ELF",
      yearStart: 2009,
      transponderType: "Philips Crypto 2",
      chipType: ["Hitag2", "ID46", "PCF7936", "JMA TP12", "SILCA T14", "CN3"]
    },
    
    // F-Series Trucks (Common System)
    {
      make: "ISUZU",
      model: "FFR",
      yearStart: 2000,
      transponderType: "Philips Crypto 2",
      chipType: ["Hitag2", "ID46", "PCF7936", "JMA TP12", "SILCA T14", "CN3"],
      notes: "Common system across F-series trucks"
    },
    
    // Legacy Systems
    {
      make: "ISUZU",
      model: "TROOPER",
      yearStart: 1996,
      yearEnd: 1998,
      transponderType: "Megamos ID13",
      chipType: ["ID13", "Silca 13", "JMA TP05"],
      notes: "First generation transponder system"
    },
    {
      make: "ISUZU",
      model: "TROOPER",
      yearStart: 1998,
      yearEnd: 2002,
      transponderType: "Texas Crypto 4D",
      chipType: ["4D64", "JMA TPX2", "JMA TP21", "SILCA GTI", "YS-01", "K-JMD", "XT27"]
    },
    
    // N-Series Trucks (Common System)
    {
      make: "ISUZU",
      model: "NPR",
      yearStart: 2000,
      transponderType: "Philips Crypto 2",
      chipType: ["Hitag2", "ID46", "PCF7936", "JMA TP12", "SILCA T14", "CN3"],
      notes: "Common system across N-series trucks"
    }
  ];
}

module.exports = TransponderSeeds; 