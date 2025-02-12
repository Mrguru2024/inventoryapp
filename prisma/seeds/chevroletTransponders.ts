import { createTransponderEntry } from './transponderData';

export const chevroletTransponders = [
  createTransponderEntry({
    make: 'CHEVROLET',
    model: 'SILVERADO',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'Hitag 2 Ext',
    chipType: JSON.stringify(['PCF7953M']),
    frequency: '315 MHz',
    compatibleParts: JSON.stringify(['13508771']),
    notes: 'ID46 system with remote start'
  }),
  // Add more Chevrolet models...
];

module.exports = { chevroletTransponders }; 