const audiTransponderData = [
  {
    id: "AUDI-80-1996",
    make: "AUDI",
    model: "80",
    yearStart: 1996,
    transponderType: "MEGAMOS 13",
    chipType: ["ID13", "Silca 13", "JMA TP05"]
  },
  {
    id: "AUDI-A1-2010-2017",
    make: "AUDI",
    model: "A1",
    yearStart: 2010,
    yearEnd: 2017,
    transponderType: "Megamos Crypto ID48",
    chipType: ["ID48", "JMA TP25", "SILCA A2"],
    compatibleParts: ["8X0837220", "8X0837220A"],
    notes: "Precoded (dealer key)"
  },
  {
    id: "AUDI-A1-2018",
    make: "AUDI",
    model: "A1",
    yearStart: 2018,
    transponderType: "Megamos Crypto AES",
    chipType: ["ID49", "Silca ID88"],
    compatibleParts: ["82A837220H", "82A837220E"],
    notes: "VAG MQB"
  },
  {
    id: "AUDI-A3-2013",
    make: "AUDI",
    model: "A3",
    yearStart: 2013,
    transponderType: "Megamos AES",
    chipType: ["ID13", "Silca 13", "JMA TP05"]
  },
  {
    id: "AUDI-A4-2015-2018",
    make: "AUDI",
    model: "A4",
    yearStart: 2015,
    yearEnd: 2018,
    transponderType: "Megamos Crypto",
    chipType: ["ID48", "Silca 48", "JMA TP27"],
    compatibleParts: ["AUD-48-1", "AUD-48-2"],
    notes: "Precoded (dealer key)"
  },
  {
    id: "AUDI-Q5-2017",
    make: "AUDI",
    model: "Q5",
    yearStart: 2017,
    transponderType: "Megamos AES",
    chipType: ["ID88", "Silca 88", "JMA TP39"],
    compatibleParts: ["AUD-88-1", "AUD-88-2"],
    notes: "VAG MQB"
  },
  // ... continue with other models
];

module.exports = { audiTransponderData }; 