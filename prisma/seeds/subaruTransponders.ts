import { createTransponderEntry } from './transponderData';

export const subaruTransponders = [
  // Modern Texas Crypto 2 Systems (2009+)
  createTransponderEntry({
    make: 'SUBARU',
    model: 'OUTBACK',
    yearStart: 2009,
    yearEnd: 2024,
    transponderType: 'Texas Crypto 2',
    chipType: JSON.stringify(['4D62-6F']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['6F-62']),
    notes: 'Latest generation system'
  }),
  createTransponderEntry({
    make: 'SUBARU',
    model: 'XV',
    yearStart: 2012,
    yearEnd: 2024,
    transponderType: 'Texas Crypto 2',
    chipType: JSON.stringify(['4D62-6F']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['6F-62']),
    notes: 'Latest generation system'
  }),
  createTransponderEntry({
    make: 'SUBARU',
    model: 'BRZ',
    yearStart: 2012,
    yearEnd: 2024,
    transponderType: 'Texas Crypto 2',
    chipType: JSON.stringify(['4D62-6F']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['6F-62']),
    notes: 'Latest generation system'
  }),
  // Texas Crypto 4D Systems (2004-2011)
  createTransponderEntry({
    make: 'SUBARU',
    model: 'FORESTER',
    yearStart: 2004,
    yearEnd: 2011,
    transponderType: 'Texas Crypto 4D',
    chipType: JSON.stringify(['4D62']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['TPX2']),
    notes: 'Compatible with JMA TP28'
  }),
  createTransponderEntry({
    make: 'SUBARU',
    model: 'IMPREZA',
    yearStart: 2004,
    yearEnd: 2010,
    transponderType: 'Texas Crypto 4D',
    chipType: JSON.stringify(['4D62']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['TPX2']),
    notes: 'Compatible with JMA TP28'
  }),
  // Legacy Philips Systems (1996-2000)
  createTransponderEntry({
    make: 'SUBARU',
    model: 'LEGACY',
    yearStart: 1996,
    yearEnd: 1998,
    transponderType: 'Philips',
    chipType: JSON.stringify(['PCF7930']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['ID33']),
    notes: 'Compatible with PCF7931'
  }),
  // Add more models...
]; 