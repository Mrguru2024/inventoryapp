import { createTransponderEntry } from './transponderData';

export const daihatsuTransponders = [
  createTransponderEntry({
    make: 'DAIHATSU',
    model: 'TERIOS',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'H-type',
    chipType: JSON.stringify(['H']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['89785-B4010']),
    notes: 'Toyota H system'
  }),
  // Add more models...
]; 