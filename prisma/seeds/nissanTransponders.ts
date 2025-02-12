import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const nissanTransponders = [
  createTransponderEntry({
    make: 'NISSAN',
    model: 'ROGUE',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7953V',
    frequency: '433.92MHz',
    compatibleParts: 'KR5S180144014',
    notes: 'Intelligent key system'
  }),
  createTransponderEntry({
    make: 'NISSAN',
    model: 'ALTIMA',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'HITAG-AES',
    chipType: 'PCF7952',
    frequency: '433.92MHz',
    compatibleParts: 'KR5S180144104',
    notes: 'Push button start'
  }),
  // Add more models...
]; 