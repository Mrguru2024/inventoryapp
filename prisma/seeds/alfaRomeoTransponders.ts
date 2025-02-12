import { createTransponderEntry } from './transponderData';

export const alfaRomeoTransponders = [
  createTransponderEntry({
    make: 'ALFA ROMEO',
    model: 'GIULIA',
    yearStart: 2017,
    yearEnd: 2024,
    transponderType: 'Keyless',
    chipType: 'ID49',
    frequency: '433.92 MHz',
    compatibleParts: 'GK2T15K601',
    notes: 'Proximity system'
  }),
  // Add more models...
]; 