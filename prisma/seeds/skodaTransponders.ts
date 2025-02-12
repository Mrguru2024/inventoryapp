import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const skodaTransponders = [
  createTransponderEntry({
    make: 'SKODA',
    model: 'OCTAVIA',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'Megamos AES',
    chipType: 'ID49',
    frequency: '433.92MHz',
    compatibleParts: '5E0959752D',
    notes: 'MQB platform'
  }),
  createTransponderEntry({
    make: 'SKODA',
    model: 'KODIAQ',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'Megamos AES',
    chipType: 'ID49',
    frequency: '433.92MHz',
    compatibleParts: '5E0959752E',
    notes: 'Kessy system'
  }),
  // Add more models...
]; 