import { createTransponderEntry } from './transponderData';

export const gmcTransponders = [
  createTransponderEntry({
    make: 'GMC',
    model: 'ACADIA',
    yearStart: 2007,
    yearEnd: 2016,
    transponderType: 'Philips Crypto 2',
    chipType: 'PCF7936',
    frequency: '315 MHz',
    compatibleParts: 'XT27A',
    notes: 'Hitag 2/ID46 system'
  }),
  createTransponderEntry({
    make: 'GMC',
    model: 'ACADIA',
    yearStart: 2017,
    yearEnd: 2024,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7937E',
    frequency: '315 MHz',
    compatibleParts: 'HYQ14EA',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'GMC',
    model: 'SIERRA',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7952E',
    frequency: '315 MHz',
    compatibleParts: 'M3N-32337200',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'GMC',
    model: 'YUKON',
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7952E',
    frequency: '315MHz',
    compatibleParts: 'HYQ1AA',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'GMC',
    model: 'TERRAIN',
    yearStart: 2010,
    yearEnd: 2019,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7937E',
    frequency: '315MHz',
    compatibleParts: 'OHT01060512',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'GMC',
    model: 'CANYON',
    yearStart: 2014,
    yearEnd: 2020,
    transponderType: 'Hitag 2 Ext',
    chipType: 'PCF7952E',
    frequency: '315MHz',
    compatibleParts: 'M3N32337100',
    notes: 'ID46E system'
  }),
  // Add more models...
]; 