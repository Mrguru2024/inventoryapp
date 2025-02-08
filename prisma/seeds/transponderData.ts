interface TransponderSeed {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string;
  compatibleParts: string | null;
  notes: string | null;
  dualSystem: boolean;
}

export const transponderSeedData: TransponderSeed[] = [
  {
    make: "TOYOTA",
    model: "CAMRY",
    yearStart: 2018,
    yearEnd: 2023,
    transponderType: "H Chip",
    chipType: JSON.stringify(["H", "8A", "H8A"]),
    compatibleParts: JSON.stringify(["89785-06040", "89785-06041"]),
    notes: "Standard H chip system",
    dualSystem: false
  },
  {
    make: "HONDA",
    model: "CIVIC",
    yearStart: 2016,
    yearEnd: 2022,
    transponderType: "G Chip",
    chipType: JSON.stringify(["G", "46"]),
    compatibleParts: JSON.stringify(["35118-TBA-A00", "35118-TBA-A01"]),
    notes: "G chip with rolling code",
    dualSystem: false
  },
  {
    make: "FORD",
    model: "F-150",
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: "80-Bit",
    chipType: JSON.stringify(["4D63", "H92"]),
    compatibleParts: JSON.stringify(["164-R8067", "164-R8068"]),
    notes: "PATS system",
    dualSystem: false
  },
  {
    make: "CHEVROLET",
    model: "SILVERADO",
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: "Hitag 3",
    chipType: JSON.stringify(["HITAG3", "PCF7939MA"]),
    compatibleParts: JSON.stringify(["13508771", "13508772"]),
    notes: "Latest generation system",
    dualSystem: false
  }
]; 