import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const hummerTransponders = [
  createTransponderEntry({
    make: 'HUMMER',
    model: 'EV',
    yearStart: 2022,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953V',
    frequency: '315MHz',
    compatibleParts: 'M3N-32337100',
    notes: 'Electric vehicle system'
  }),
  // Add more models...
]; 