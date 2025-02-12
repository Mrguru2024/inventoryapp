import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const ivecoTransponders = [
  createTransponderEntry({
    make: 'IVECO',
    model: 'DAILY',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'Megamos',
    chipType: 'ID48',
    frequency: '433.92MHz',
    compatibleParts: '5WK50278',
    notes: 'Commercial vehicle system'
  }),
  // Add more models...
]; 