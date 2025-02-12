import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const mitsubishiTransponders = [
  createTransponderEntry({
    make: 'MITSUBISHI',
    model: 'OUTLANDER',
    yearStart: 2022,
    yearEnd: 2024,
    transponderType: 'ID4D',
    chipType: '4D-60',
    frequency: '433.92MHz',
    compatibleParts: 'MN141538',
    notes: 'Smart key system'
  }),
  createTransponderEntry({
    make: 'MITSUBISHI',
    model: 'ECLIPSE CROSS',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'ID46',
    chipType: 'ID46',
    frequency: '433.92MHz',
    compatibleParts: 'MR994265',
    notes: 'Remote start capable'
  }),
  // Add more models...
]; 