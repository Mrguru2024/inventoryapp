import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const fordTransponders = [
  createTransponderEntry({
    make: 'FORD',
    model: 'F-150',
    yearStart: 2015,
    yearEnd: null,
    transponderType: '4D63',
    chipType: 'H',
    frequency: '902MHz',
    compatibleParts: 'M3N-A2C31243300',
    notes: 'Smart key optional'
  }),
  // Add more Ford models...
]; 