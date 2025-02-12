import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const kawasakiTransponders = [
  createTransponderEntry({
    make: 'KAWASAKI',
    model: 'NINJA',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'ID4D',
    chipType: '4D-60',
    frequency: '433.92MHz',
    compatibleParts: '21176-0762',
    notes: 'Motorcycle system'
  }),
  // Add more models...
]; 