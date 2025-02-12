import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const seatTransponders = [
  createTransponderEntry({
    make: 'SEAT',
    model: 'LEON',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'Megamos AES',
    chipType: 'ID49',
    frequency: '433.92MHz',
    compatibleParts: '5FA010405',
    notes: 'MQB platform'
  }),
  createTransponderEntry({
    make: 'SEAT',
    model: 'ATECA',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'Megamos AES',
    chipType: 'ID49',
    frequency: '433.92MHz',
    compatibleParts: '5FA012531',
    notes: 'Keyless system'
  }),
  // Add more models...
]; 