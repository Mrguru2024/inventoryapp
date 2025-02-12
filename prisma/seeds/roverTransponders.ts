import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const roverTransponders = [
  createTransponderEntry({
    make: 'ROVER',
    model: '75',
    yearStart: 2004,
    yearEnd: 2005,
    transponderType: 'Megamos',
    chipType: 'ID48',
    frequency: '433.92MHz',
    compatibleParts: 'YWX000360',
    notes: 'Last generation system'
  }),
  // Add more models...
]; 