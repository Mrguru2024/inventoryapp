import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const yamahaTransponders = [
  createTransponderEntry({
    make: 'YAMAHA',
    model: 'MT-07',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'ID4D',
    chipType: '4D-60',
    frequency: '433.92MHz',
    compatibleParts: 'B4C-82501-00',
    notes: 'Motorcycle system'
  }),
  createTransponderEntry({
    make: 'YAMAHA',
    model: 'R1',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'ID4D',
    chipType: '4D-60',
    frequency: '433.92MHz',
    compatibleParts: 'B4C-82502-00',
    notes: 'HISS system'
  }),
  // Add more models...
]; 