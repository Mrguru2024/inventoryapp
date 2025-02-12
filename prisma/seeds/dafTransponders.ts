import { createTransponderEntry } from './transponderData';

export const dafTransponders = [
  createTransponderEntry({
    make: 'DAF',
    model: 'XF',
    yearStart: 2017,
    yearEnd: 2024,
    transponderType: 'Megamos',
    chipType: 'ID48',
    frequency: '433.92 MHz',
    compatibleParts: '1450160',
    notes: 'Truck system'
  }),
  // Add more models...
]; 