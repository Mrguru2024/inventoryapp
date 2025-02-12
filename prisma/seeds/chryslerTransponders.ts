import { createTransponderEntry } from './transponderData';

export const chryslerTransponders = [
  createTransponderEntry({
    make: 'CHRYSLER',
    model: '300',
    yearStart: 2015,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 2',
    chipType: JSON.stringify(['PCF7941']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['68066350']),
    notes: 'Hitag2/ID46 system'
  }),
  // Add more models...
];

module.exports = { chryslerTransponders }; 