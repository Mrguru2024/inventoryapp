import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const volkswagenTransponders = [
  createTransponderEntry({
    make: 'VOLKSWAGEN',
    model: 'GOLF',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'Megamos AES',
    chipType: 'ID49',
    frequency: '433.92MHz',
    compatibleParts: '5G0959752',
    notes: 'MQB platform'
  }),
  createTransponderEntry({
    make: 'VOLKSWAGEN',
    model: 'TIGUAN',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'Megamos AES',
    chipType: 'ID49',
    frequency: '433.92MHz',
    compatibleParts: '5N0959752',
    notes: 'Kessy system'
  }),
  // Add more models...
]; 