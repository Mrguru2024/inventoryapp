import { createTransponderEntry } from './transponderData';

export const acuraTransponders = [
  createTransponderEntry({
    make: 'ACURA',
    model: 'TLX',
    yearStart: 2015,
    yearEnd: 2023,
    transponderType: 'G Chip',
    chipType: ['G', '46'],
    frequency: '125 kHz',
    compatibleParts: ['35118-TZ3-A01'],
    notes: 'G chip system'
  }),
  // Add more models...
];

module.exports = { acuraTransponders }; 