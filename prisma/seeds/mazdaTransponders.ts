import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const mazdaTransponders = [
  createTransponderEntry({
    make: 'MAZDA',
    model: 'CX-5',
    yearStart: 2022,
    yearEnd: 2024,
    transponderType: 'ID4D-DST80',
    chipType: 'DST80',
    frequency: '315MHz',
    compatibleParts: 'WAZSKE13D01',
    notes: 'Smart key system'
  }),
  createTransponderEntry({
    make: 'MAZDA',
    model: 'MAZDA3',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'ID4D',
    chipType: '4D-63',
    frequency: '315MHz',
    compatibleParts: 'WAZSKE13D02',
    notes: 'Keyless system'
  }),
  // Add more models...
]; 