import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const peugeotTransponders = [
  createTransponderEntry({
    make: 'PEUGEOT',
    model: '3008',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'VA2',
    chipType: 'PCF7941',
    frequency: '433.92MHz',
    compatibleParts: '16117945',
    notes: 'Keyless system'
  }),
  createTransponderEntry({
    make: 'PEUGEOT',
    model: '208',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'VA2',
    chipType: 'PCF7939MA',
    frequency: '433.92MHz',
    compatibleParts: '16091145',
    notes: 'Remote system'
  }),
  // Add more models...
]; 