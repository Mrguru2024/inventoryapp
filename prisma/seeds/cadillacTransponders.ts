import { createTransponderEntry } from './transponderData';

export const cadillacTransponders = [
  // Latest Hitag-Pro Systems (2021+)
  createTransponderEntry({
    make: 'CADILLAC',
    model: 'ESCALADE',
    yearStart: 2021,
    yearEnd: 2024,
    transponderType: 'Hitag-Pro',
    chipType: 'PCF7939MA',
    frequency: '315MHz',
    compatibleParts: 'YG0G20TB1',
    notes: 'Latest generation system'
  }),
  // Modern Hitag-2 Extended Systems (2015-2020)
  createTransponderEntry({
    make: 'CADILLAC',
    model: 'XT6',
    yearStart: 2020,
    yearEnd: 2021,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7937E',
    frequency: '315MHz',
    compatibleParts: 'HYQ2EB',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'CADILLAC',
    model: 'XT5',
    yearStart: 2017,
    yearEnd: 2021,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7937E',
    frequency: '315MHz',
    compatibleParts: 'HYQ2EB',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'CADILLAC',
    model: 'CT6',
    yearStart: 2016,
    yearEnd: 2020,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7937E',
    frequency: '315MHz',
    compatibleParts: 'HYQ2EB',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'CADILLAC',
    model: 'ESCALADE',
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7937E',
    frequency: '315MHz',
    compatibleParts: 'HYQ2AB',
    notes: 'ID46E system'
  }),
  // Earlier Hitag-2 Systems (2007-2014)
  createTransponderEntry({
    make: 'CADILLAC',
    model: 'CTS',
    yearStart: 2008,
    yearEnd: 2014,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7952E',
    frequency: '315MHz',
    compatibleParts: 'M3N5WY7777A',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'CADILLAC',
    model: 'SRX',
    yearStart: 2007,
    yearEnd: 2014,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7952E',
    frequency: '315MHz',
    compatibleParts: '20998281',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'CADILLAC',
    model: 'ESCALADE',
    yearStart: 2015,
    yearEnd: 2023,
    transponderType: 'Hitag 3',
    chipType: ['PCF7953'],
    frequency: '433.92MHz',
    compatibleParts: ['13580801'],
    notes: 'Hitag 3 system'
  }),
  // Add more models...
]; 