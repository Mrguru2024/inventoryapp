import { TransponderKeyData } from '@/app/services/transponderService';

export const chryslerTransponderData: TransponderKeyData[] = [
  // Legacy 4D Systems (1998-2006)
  {
    make: "CHRYSLER",
    model: "CIRRUS",
    yearStart: 1999,
    yearEnd: 2000,
    transponderType: "Texas Crypto 4D",
    chipType: ["4D64", "JMA TP21", "JMA TPX2", "SILCA GTI", "XT27", "K-JMD"],
    notes: "First generation transponder system"
  },
  
  // Hitag2 Systems (2004-2016)
  {
    make: "CHRYSLER",
    model: "PACIFICA",
    yearStart: 2004,
    yearEnd: 2008,
    transponderType: "Philips Crypto 2",
    chipType: ["Hitag-2", "ID46", "PCF7941", "PCF7936"],
    compatibleParts: ["M3N65981772", "04589053AC", "04589053AD"],
    notes: "Mid-generation system"
  },
  
  // Modern AES Systems (2015+)
  {
    make: "CHRYSLER",
    model: "300",
    yearStart: 2011,
    yearEnd: 2021,
    transponderType: "Hitag AES",
    chipType: ["ID 4A", "PCF7953M", "PCF7953Mx"],
    compatibleParts: ["M3M-40821302", "68155687AB", "68394191", "68394191AA"],
    notes: "Latest generation system"
  }
]; 