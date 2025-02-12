import { createTransponderEntry } from './transponderData';

export const citroenTransponders = [
  createTransponderEntry({
    make: 'CITROEN',
    model: 'C3',
    yearStart: 2017,
    yearEnd: 2023,
    transponderType: 'Hitag AES',
    chipType: ['PCF7953M'],
    frequency: '433.92MHz',
    compatibleParts: ['HU83'],
    notes: 'Hitag AES system'
  }),
  // Add more models...
]; 