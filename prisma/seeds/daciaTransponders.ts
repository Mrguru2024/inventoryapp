import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const daciaTransponders = [
  createTransponderEntry({
    make: 'DACIA',
    model: 'DUSTER',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'PCF7939MA',
    chipType: 'PCF7939',
    frequency: '433.92MHz',
    compatibleParts: '7701209132',
    notes: 'Keyless system'
  }),
  // Add more models...
]; 