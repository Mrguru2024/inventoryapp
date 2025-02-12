import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const landRoverTransponders = [
  createTransponderEntry({
    make: 'LAND ROVER',
    model: 'DEFENDER',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953V',
    frequency: '433.92MHz',
    compatibleParts: 'LR147236',
    notes: 'Smart key system'
  }),
  createTransponderEntry({
    make: 'LAND ROVER',
    model: 'RANGE ROVER',
    yearStart: 2022,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953M',
    frequency: '433.92MHz',
    compatibleParts: 'LR152849',
    notes: 'Keyless entry system'
  }),
  // Add more models...
]; 