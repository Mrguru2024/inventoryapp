import { TransponderKeyData } from '@/app/services/transponderService';

export const chevroletTransponderData: TransponderKeyData[] = [
  {
    make: "CHEVROLET",
    model: "AGILE",
    yearStart: 2009,
    transponderType: "Philips Crypto 2",
    chipType: ["Hitag2", "ID46", "PCF7936AS", "JMA TP12GM", "SILCA T14", "CN3", "XT27", "K-JMD"],
    notes: "PCF7936AS compatible"
  },
  {
    make: "CHEVROLET",
    model: "ASTRA",
    yearStart: 2000,
    yearEnd: 2007,
    transponderType: "Philips Crypto ID40",
    chipType: ["ID40", "PCF7935"],
    notes: "Precoded"
  },
  {
    make: "CHEVROLET",
    model: "ASTRA",
    yearStart: 2007,
    transponderType: "Philips Crypto 2",
    chipType: ["Hitag2", "ID46", "PCF7936AS", "JMA TP12GM", "SILCA T14", "CN3", "XT27", "K-JMD"]
  },
  {
    make: "CHEVROLET",
    model: "ASTRO VAN",
    yearStart: 1998,
    yearEnd: 2005,
    transponderType: "PassLock",
    chipType: ["PassLock Anti Theft System"],
    notes: "PassLock Anti Theft System"
  },
  // Continue with more models...
  {
    make: "CHEVROLET",
    model: "SILVERADO",
    yearStart: 2021,
    transponderType: "Hitag Pro",
    chipType: ["NCF2951V", "NCF2952V"],
    compatibleParts: ["YG0G21TB2", "13548437"],
    notes: "Latest generation transponder system"
  },
  {
    make: "CHEVROLET",
    model: "VOLT",
    yearStart: 2016,
    yearEnd: 2019,
    transponderType: "Hitag 2 Extended",
    chipType: ["ID46E", "PCF7937E", "PCF7952E"],
    compatibleParts: ["HYQ4EA 13529638", "13598815", "13585728"]
  },
  {
    make: "CHEVROLET",
    model: "CORVETTE",
    yearStart: 1986,
    yearEnd: 2004,
    transponderType: "VATS",
    chipType: ["VATS Resistor"],
    vatsEnabled: true,
    vatsSystem: "VATS",
    notes: "First GM vehicle to use VATS system. Uses resistor values 2-15 (value 1 discontinued in 1989)"
  },
  {
    make: "CHEVROLET",
    model: "CAMARO",
    yearStart: 1988,
    yearEnd: 2002,
    transponderType: "VATS",
    chipType: ["VATS Resistor"],
    vatsEnabled: true,
    vatsSystem: "VATS",
    notes: "Uses resistor values 2-15"
  }
]; 