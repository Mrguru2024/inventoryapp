const acuraTransponderData = [
  // Legacy Megamos Systems (1996-2006)
  {
    id: "ACURA-CL-1998",
    make: "ACURA",
    model: "CL",
    yearStart: 1998,
    yearEnd: 2003,
    transponderType: "Megamos 13",
    chipType: ["ID13", "Silca 13", "JMA TP05"],
    notes: "First generation transponder system"
  },
  
  // Hitag2 Systems (2004-2014)
  {
    id: "ACURA-TL-2009",
    make: "ACURA",
    model: "TL",
    yearStart: 2009,
    yearEnd: 2014,
    transponderType: "Philips Crypto 2",
    chipType: ["Hitag2", "ID46", "PCF7953"],
    compatibleParts: ["72147-TK4-A71", "M3N5WY8145"],
    notes: "Mid-generation system"
  },
  
  // Modern Hitag3 Systems (2015+)
  {
    id: "ACURA-TLX-2015",
    make: "ACURA",
    model: "TLX",
    yearStart: 2015,
    yearEnd: 2021,
    transponderType: "Philips Crypto 3",
    chipType: ["Hitag3", "ID47", "PCF7961X", "NCF2952X"],
    compatibleParts: ["72147TZ3A22", "KR5V2X", "72147-TZ3-A81"],
    notes: "Latest generation system"
  },
  {
    id: "ACURA-MDX-2001",
    make: "ACURA",
    model: "MDX",
    yearStart: 2001,
    yearEnd: 2006,
    transponderType: "Honda G",
    chipType: ["G", "TPX2"],
    compatibleParts: ["35111-S3V-A01", "35111-S3V-A02"]
  }
];

module.exports = { acuraTransponderData }; 