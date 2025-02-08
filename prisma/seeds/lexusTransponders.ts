import { TransponderKeyData } from '@/app/services/transponderService';

const lexusTransponderData: TransponderKeyData[] = [
  // Modern AES Systems (2013+)
  {
    make: "LEXUS",
    model: "ES 350",
    yearStart: 2013,
    transponderType: "Texas Crypto DST AES",
    chipType: ["DST AES 128-bit"],
    compatibleParts: ["HYQ14FBA", "89904-30A30", "89904-30A31", "89904-30A90"],
    notes: "Latest generation transponder system"
  },
  
  // Legacy 4C Systems (1997-2003)
  {
    make: "LEXUS",
    model: "GS 300",
    yearStart: 1998,
    yearEnd: 2005,
    transponderType: "Texas 4C",
    chipType: ["ID 4C", "JMA TPX1", "TP07", "CN1", "K-JMD", "Errebi TX1"],
    notes: "First generation transponder system"
  },
  
  // 4D Crypto Systems (2002-2012)
  {
    make: "LEXUS",
    model: "GS 430",
    yearStart: 2005,
    yearEnd: 2007,
    transponderType: "Texas Crypto 4D",
    chipType: ["4D68", "JMA TPX2", "TP29", "YS-01", "K-JMD", "Errebi TX2"],
    compatibleParts: ["HYQ14AAB", "271451-0140", "2714510140", "89904-30270"]
  },
  
  // Hybrid Models (Special Systems)
  {
    make: "LEXUS",
    model: "RX 450H",
    yearStart: 2015,
    yearEnd: 2022,
    transponderType: "Texas Crypto DST AES",
    chipType: ["DST AES 128-bit"],
    compatibleParts: ["HYQ14FLB", "89904-0E180", "HYQ14FBB", "89904-0E160"],
    notes: "Hybrid vehicle system"
  },
  
  // F-Sport Models
  {
    make: "LEXUS",
    model: "IS-F",
    yearStart: 2007,
    yearEnd: 2012,
    transponderType: "Texas Crypto 4D",
    chipType: ["4D67", "4D68"],
    compatibleParts: ["HYQ14AEM", "HYQ14AAB", "89904-50380"],
    notes: "GNE Board: 6601"
  },
  
  // Latest Generation (2018+)
  {
    make: "LEXUS",
    model: "LS 500",
    yearStart: 2018,
    yearEnd: 2021,
    transponderType: "Texas Crypto DST AES",
    chipType: ["DST AES 128-bit"],
    compatibleParts: ["HYQ14FBF", "8990H-50020", "8990H-33020"],
    notes: "Latest flagship model system"
  },
  
  // Crossover/SUV Models
  {
    make: "LEXUS",
    model: "NX 300",
    yearStart: 2015,
    yearEnd: 2021,
    transponderType: "Texas Crypto DST AES",
    chipType: ["DST AES 128-bit"],
    compatibleParts: ["HYQ14FBA", "89904-78460", "89904-78450", "89904-53512"]
  }
];

module.exports = { lexusTransponderData }; 