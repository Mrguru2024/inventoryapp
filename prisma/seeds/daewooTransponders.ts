import { createTransponderEntry } from './transponderData';

export const daewooTransponders = [
  createTransponderEntry({
    make: 'DAEWOO',
    model: 'LANOS',
    yearStart: 2000,
    yearEnd: 2002,
    transponderType: 'Megamos',
    chipType: 'ID13',
    frequency: '433.92 MHz',
    compatibleParts: '96228726',
    notes: 'Basic immobilizer'
  }),
  // Add more models...
]; 