import { createTransponderEntry } from './transponderData';

export const audiTransponders = [
  createTransponderEntry({
    make: 'AUDI',
    model: 'A4',
    yearStart: 2017,
    yearEnd: 2023,
    transponderType: 'Megamos AES',
    chipType: ['PCF7945'],
    frequency: '433.92MHz',
    compatibleParts: ['8K0959754G'],
    notes: 'Megamos AES system'
  }),
  createTransponderEntry({
    make: 'AUDI',
    model: 'Q5',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'MQB',
    chipType: 'ID49',
    frequency: '433MHz',
    compatibleParts: '8K0959754',
    notes: 'Proximity key system'
  }),
  // Add more Audi models...
];

module.exports = { audiTransponders }; 