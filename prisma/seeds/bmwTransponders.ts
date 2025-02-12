import { createTransponderEntry } from './transponderData';

export const bmwTransponders = [
  createTransponderEntry({
    make: 'BMW',
    model: '1-Series',
    yearStart: 2004,
    yearEnd: 2006,
    transponderType: 'Philips Crypto 2',
    chipType: JSON.stringify(['ID46', 'PCF7936AS']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['66126986582', '66129268489', '66129268488']),
    notes: 'BMW CAS2 system'
  }),
  createTransponderEntry({
    make: 'BMW',
    model: '1-Series',
    yearStart: 2007,
    yearEnd: 2010,
    transponderType: 'Philips Crypto 2',
    chipType: JSON.stringify(['ID46', 'PCF7945', 'PCF7936']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['5WK49145', '5WK49146', '5WK49147', '66126986583']),
    notes: 'CAS3, CAS3+ systems'
  }),
  createTransponderEntry({
    make: 'BMW',
    model: 'R1200GS',
    yearStart: 2005,
    yearEnd: 2011,
    transponderType: 'Philips Crypto 2',
    chipType: JSON.stringify(['ID46', 'PCF7936']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['Silca T14', 'JMA TP12']),
    notes: 'Motorcycle System'
  })
]; 