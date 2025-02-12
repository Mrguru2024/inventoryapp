import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const mercedesTransponders = [
  createTransponderEntry({
    make: 'MERCEDES',
    model: 'C-CLASS',
    yearStart: 2015,
    yearEnd: 2023,
    transponderType: 'FBS4',
    chipType: 'ID49',
    frequency: '433.92MHz',
    compatibleParts: 'A2059053414',
    notes: 'FBS4 system with keyless go'
  }),
  // Add more Mercedes models...
]; 