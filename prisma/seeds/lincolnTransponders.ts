import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const lincolnTransponders = [
  createTransponderEntry({
    make: 'LINCOLN',
    model: 'NAVIGATOR',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953V',
    frequency: '902MHz',
    compatibleParts: 'M3N-A2C31243300',
    notes: 'Smart key system'
  }),
  createTransponderEntry({
    make: 'LINCOLN',
    model: 'AVIATOR',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953M',
    frequency: '902MHz',
    compatibleParts: 'M3N-A2C940780',
    notes: 'Phone as key capable'
  }),
  // Add more models...
]; 