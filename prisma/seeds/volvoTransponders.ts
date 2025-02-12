import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const volvoTransponders = [
  createTransponderEntry({
    make: 'VOLVO',
    model: 'XC90',
    yearStart: 2022,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953V',
    frequency: '433.92MHz',
    compatibleParts: '31252722',
    notes: 'Smart key system'
  }),
  createTransponderEntry({
    make: 'VOLVO',
    model: 'XC60',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953M',
    frequency: '433.92MHz',
    compatibleParts: '31252723',
    notes: 'Keyless drive'
  }),
  // Add more models...
]; 