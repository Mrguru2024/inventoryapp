import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const jaguarTransponders = [
  createTransponderEntry({
    make: 'JAGUAR',
    model: 'F-PACE',
    yearStart: 2017,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953M',
    frequency: '433.92MHz',
    compatibleParts: 'T4A1635',
    notes: 'Smart key with keyless start'
  }),
  createTransponderEntry({
    make: 'JAGUAR',
    model: 'XF',
    yearStart: 2016,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953',
    frequency: '433.92MHz',
    compatibleParts: 'T4A1634',
    notes: 'Proximity system'
  }),
  // Add more models...
]; 