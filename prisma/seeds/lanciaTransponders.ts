import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const lanciaTransponders = [
  createTransponderEntry({
    make: 'LANCIA',
    model: 'YPSILON',
    yearStart: 2015,
    yearEnd: 2024,
    transponderType: 'ID48',
    chipType: 'ID48',
    frequency: '433.92MHz',
    compatibleParts: '71775491',
    notes: 'Keyless system'
  }),
  // Add more models...
]; 