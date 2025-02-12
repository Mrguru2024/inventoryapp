import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const fiatTransponders = [
  createTransponderEntry({
    make: 'FIAT',
    model: '500',
    yearStart: 2017,
    yearEnd: 2024,
    transponderType: 'Keyless',
    chipType: 'PCF7953M',
    frequency: '433.92MHz',
    compatibleParts: '68266651',
    notes: 'Push to start system'
  }),
  createTransponderEntry({
    make: 'FIAT',
    model: 'DUCATO',
    yearStart: 2014,
    yearEnd: 2024,
    transponderType: 'ID48',
    chipType: 'ID48',
    frequency: '433.92MHz',
    compatibleParts: '735670779',
    notes: 'Commercial vehicle system'
  }),
  // Add more models...
];

module.exports = { fiatTransponders }; 