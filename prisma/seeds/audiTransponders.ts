import { TransponderKeyData } from '@/app/services/transponderService';

export const audiTransponderData: TransponderKeyData[] = [
  {
    make: "AUDI",
    model: "80",
    yearStart: 1996,
    transponderType: "MEGAMOS 13",
    chipType: ["ID13", "Silca 13", "JMA TP05"]
  },
  {
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
    make: "AUDI",
    model: "A1",
    yearStart: 2018,
    transponderType: "Megamos Crypto AES",
    chipType: ["ID49", "Silca ID88"],
    compatibleParts: ["82A837220H", "82A837220E"],
    notes: "VAG MQB"
  },
  // ... continue with other models
]; 