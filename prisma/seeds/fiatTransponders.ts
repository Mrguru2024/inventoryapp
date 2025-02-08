const fiatTransponderData = [
  {
    make: "FIAT",
    model: "500",
    yearStart: 2007,
    yearEnd: 2018,
    transponderType: "Philips Crypto 2",
    chipType: ["Hitag 2", "ID46", "PCF7946", "JMA TP12", "XT27", "K-JMD"],
    compatibleParts: ["71749374", "71776098", "6000626799"],
    notes: "OEM and aftermarket compatibility"
  },
  {
    make: "FIAT",
    model: "500L",
    yearStart: 2012,
    yearEnd: 2013,
    transponderType: "Philips Crypto 2",
    chipType: ["Hitag 2", "ID46", "PCF7946", "JMA TP12", "XT27", "K-JMD"],
    compatibleParts: ["71752197", "6000626708", "6000626710"]
  },
  {
    make: "FIAT",
    model: "500L",
    yearStart: 2014,
    yearEnd: 2020,
    transponderType: "Megamos AES",
    chipType: ["ID88"]
  },
  {
    make: "FIAT",
    model: "500X",
    yearStart: 2014,
    yearEnd: 2020,
    transponderType: "Dual System",
    chipType: ["Megamos AES ID88", "Philips Crypto 3", "Hitag 3", "ID49"],
    notes: "Vehicle may use either system - verification required"
  },
  // Legacy systems (1995-2002 era)
  {
    make: "FIAT",
    model: "BARCHETTA",
    yearStart: 1995,
    yearEnd: 2002,
    transponderType: "Megamos 13",
    chipType: ["ID13", "JMA TP05", "SILCA T5"],
    notes: "First generation transponder system"
  },
  // Modern systems (2015+)
  {
    make: "FIAT",
    model: "TIPO",
    yearStart: 2015,
    transponderType: "Megamos AES",
    chipType: ["ID88"],
    compatibleParts: ["71778806", "6000626702"],
    notes: "Latest generation transponder system"
  },
  // Dual system examples
  {
    make: "FIAT",
    model: "BRAVO",
    yearStart: 1997,
    yearEnd: 2001,
    transponderType: "Dual System",
    chipType: ["Megamos 13", "ID13", "Temic 11", "ID11", "JMA TP05", "SILCA T5"],
    notes: "Vehicle may use either Megamos 13 or Temic 11 system"
  },
  // Commercial vehicles
  {
    make: "FIAT",
    model: "DUCATO",
    yearStart: 2008,
    yearEnd: 2020,
    transponderType: "Philips Crypto 2",
    chipType: ["Hitag 2", "ID46", "PCF7946", "JMA TP12", "XT27", "K-JMD"],
    compatibleParts: ["6000627330", "6000628569", "6000631468"],
    notes: "Commercial vehicle system"
  }
];

module.exports = { fiatTransponderData }; 