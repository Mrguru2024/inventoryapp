import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const suzukiTransponders = [
  createTransponderEntry({
    make: 'SUZUKI',
    model: 'VITARA',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'ID47',
    chipType: 'ID47',
    frequency: '433.92MHz',
    compatibleParts: '37172-54P0',
    notes: 'Keyless system'
  }),
  createTransponderEntry({
    make: 'SUZUKI',
    model: 'SWIFT',
    yearStart: 2017,
    yearEnd: 2024,
    transponderType: 'ID46',
    chipType: 'ID46',
    frequency: '433.92MHz',
    compatibleParts: '37172-52R0',
    notes: 'Remote system'
  }),
  createTransponderEntry({
    make: 'SUZUKI',
    model: 'BALENO',
    yearStart: 2015,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: 'ID47',
    frequency: '433.92MHz',
    compatibleParts: '14LP1410T6',
    notes: 'Latest generation transponder system'
  }),
  // Add more models...
];

module.exports = { suzukiTransponders }; 