import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const porscheTransponders = [
  createTransponderEntry({
    make: 'PORSCHE',
    model: 'CAYENNE',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953V',
    frequency: '433.92MHz',
    compatibleParts: '9J1959754',
    notes: 'Smart key system'
  }),
  createTransponderEntry({
    make: 'PORSCHE',
    model: '911',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953M',
    frequency: '433.92MHz',
    compatibleParts: '9P1959754',
    notes: 'Keyless go system'
  }),
  // Add more models...
]; 