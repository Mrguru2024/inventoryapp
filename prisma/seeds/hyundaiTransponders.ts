import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const hyundaiTransponders = [
  // Modern Crypto 3/AES Systems (2016+)
  createTransponderEntry({
    make: 'HYUNDAI',
    model: 'ACCENT',
    yearStart: 2017,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: 'ID47',
    frequency: '433.92MHz',
    compatibleParts: '95440-M5300',
    notes: 'Hitag 128-bit AES'
  }),
  createTransponderEntry({
    make: 'HYUNDAI',
    model: 'IONIQ',
    yearStart: 2016,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: 'PCF7938',
    frequency: '433.92MHz',
    compatibleParts: '95440-G2100',
    notes: 'Hitag-3/ID47 system'
  }),
  createTransponderEntry({
    make: 'HYUNDAI',
    model: 'SANTA FE',
    yearStart: 2016,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: 'PCF7952',
    frequency: '433.92MHz',
    compatibleParts: '95440-B8100',
    notes: 'Hitag-3 system'
  }),
  // DST80 Systems (2011-2015)
  createTransponderEntry({
    make: 'HYUNDAI',
    model: 'TUCSON',
    yearStart: 2015,
    yearEnd: 2024,
    transponderType: 'Texas Crypto DST80',
    chipType: 'ID6E-MA',
    frequency: '433.92MHz',
    compatibleParts: '95430-D3010',
    notes: 'DST80 system'
  }),
  createTransponderEntry({
    make: 'HYUNDAI',
    model: 'VELOSTER',
    yearStart: 2010,
    yearEnd: 2024,
    transponderType: 'Texas Crypto DST80',
    chipType: 'ID6E-MA',
    frequency: '433.92MHz',
    compatibleParts: '95440-2M350',
    notes: 'DST80 system'
  }),
  // Hitag-2/PCF7952 Systems (2009-2014)
  createTransponderEntry({
    make: 'HYUNDAI',
    model: 'TUCSON',
    yearStart: 2009,
    yearEnd: 2014,
    transponderType: 'Philips Crypto 2',
    chipType: 'PCF7952A',
    frequency: '433.92MHz',
    compatibleParts: '95440-2S300',
    notes: 'Hitag-2 system'
  }),
  // Add more models...
]; 