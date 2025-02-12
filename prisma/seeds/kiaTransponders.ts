import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const kiaTransponders = [
  // Modern Hitag-3/AES Systems (2016+)
  createTransponderEntry({
    make: 'KIA',
    model: 'STINGER',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: 'Hitag-3',
    frequency: '433.92MHz',
    compatibleParts: '95440-J5210',
    notes: 'Proximity key system'
  }),
  createTransponderEntry({
    make: 'KIA',
    model: 'SPORTAGE',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: 'Hitag-3',
    frequency: '433.92MHz',
    compatibleParts: '95440-D9500',
    notes: 'Also supports Texas AES ID75'
  }),
  createTransponderEntry({
    make: 'KIA',
    model: 'SORENTO',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: 'Hitag-3',
    frequency: '433.92MHz',
    compatibleParts: '95440-C6100',
    notes: 'Proximity key system'
  }),
  // DST80 Systems (2012-2017)
  createTransponderEntry({
    make: 'KIA',
    model: 'SOUL',
    yearStart: 2014,
    yearEnd: 2024,
    transponderType: 'Texas Crypto DST80',
    chipType: 'ID6E-MA',
    frequency: '433.92MHz',
    compatibleParts: '95430-B2100',
    notes: 'Proximity key system'
  }),
  createTransponderEntry({
    make: 'KIA',
    model: 'NIRO',
    yearStart: 2016,
    yearEnd: 2024,
    transponderType: 'Texas Crypto DST80',
    chipType: 'ID6E-MA',
    frequency: '433.92MHz',
    compatibleParts: '95440-G5100',
    notes: 'Smart key system'
  }),
  // Hitag-2 Systems (2010-2015)
  createTransponderEntry({
    make: 'KIA',
    model: 'OPTIMA',
    yearStart: 2010,
    yearEnd: 2015,
    transponderType: 'Philips Crypto 2',
    chipType: 'PCF7952A',
    frequency: '433.92MHz',
    compatibleParts: 'SVI-HMFKR04',
    notes: 'Hitag-2/ID46 system'
  }),
  createTransponderEntry({
    make: 'KIA',
    model: 'CADENZA',
    yearStart: 2013,
    yearEnd: 2016,
    transponderType: 'Philips Crypto 2',
    chipType: 'PCF7952',
    frequency: '433.92MHz',
    compatibleParts: '95440-3R601',
    notes: 'Dealer programmed key'
  }),
  // Add more models...
]; 