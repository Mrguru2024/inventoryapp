import { TransponderKeyData } from '@/app/services/transponderService';

export const peugeotTransponderData: TransponderKeyData[] = [
  // Modern AES Systems (2017+)
  {
    make: "PEUGEOT",
    model: "3008",
    yearStart: 2017,
    transponderType: "Hitag AES",
    chipType: ["ID4A", "PCF7953M"],
    compatibleParts: ["98105588ZD", "98124195ZD"],
    notes: "Latest generation transponder system"
  },
  
  // Legacy Systems (1996-2001)
  {
    make: "PEUGEOT",
    model: "106",
    yearStart: 1996,
    yearEnd: 2000,
    transponderType: "Philips 33",
    chipType: ["ID33", "PCF7930", "PCF7931", "JMA TP05", "Silca T1"],
    notes: "First generation transponder system"
  },
  
  // Hitag2 Systems (2001-2016)
  {
    make: "PEUGEOT",
    model: "308",
    yearStart: 2007,
    yearEnd: 2012,
    transponderType: "Hitag2",
    chipType: ["ID46", "PCF7936", "JMA TP12", "SILCA T14", "XT27", "K-JMD"],
    compatibleParts: ["6490CS", "6490CT"],
    notes: "PCF7941/PCF7961 transponder compatible"
  },
  
  // Commercial Vehicles
  {
    make: "PEUGEOT",
    model: "BOXER",
    yearStart: 2007,
    yearEnd: 2016,
    transponderType: "Hitag2+",
    chipType: ["ID46", "PCF7946A"],
    compatibleParts: ["71752589", "71776161", "6000627330"],
    notes: "Commercial vehicle system"
  },
  
  // Latest Generation (2018+)
  {
    make: "PEUGEOT",
    model: "RIFTER",
    yearStart: 2018,
    transponderType: "Hitag AES",
    chipType: ["ID4A", "ID51", "PCF7953M"],
    compatibleParts: ["98105588ZD", "98124195ZD"],
    notes: "Latest platform transponder"
  },
  
  // Motorcycles/Scooters (🏍)
  {
    make: "PEUGEOT",
    model: "SATELIS",
    yearStart: 2006,
    transponderType: "Temic 11",
    chipType: ["ID11", "JMA TP05", "SILCA T5"],
    notes: "Motorcycle/Scooter system"
  },
  {
    make: "PEUGEOT",
    model: "SPEEDFIGHT",
    yearStart: 1997,
    transponderType: "Temic 11",
    chipType: ["ID11", "JMA TP05", "SILCA T5"],
    notes: "Motorcycle/Scooter system"
  }
]; 