import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const opelTransponders = [
  createTransponderEntry({
    make: 'OPEL',
    model: 'ASTRA',
    yearStart: 2022,
    yearEnd: 2024,
    transponderType: 'Megamos AES',
    chipType: 'ID49',
    frequency: '433.92MHz',
    compatibleParts: '13508277',
    notes: 'Keyless system'
  }),
  createTransponderEntry({
    make: 'OPEL',
    model: 'CORSA',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'Megamos',
    chipType: 'ID48',
    frequency: '433.92MHz',
    compatibleParts: '13597132',
    notes: 'Remote system'
  }),
  // Add more models...
]; 