import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const jeepTransponders = [
  createTransponderEntry({
    make: 'JEEP',
    model: 'GRAND CHEROKEE',
    yearStart: 2014,
    yearEnd: 2021,
    transponderType: 'Hitag AES',
    chipType: 'PCF7953',
    frequency: '433.92MHz',
    compatibleParts: 'M3N-40821302',
    notes: 'ID4A system'
  }),
  createTransponderEntry({
    make: 'JEEP',
    model: 'WRANGLER',
    yearStart: 2018,
    yearEnd: 2021,
    transponderType: 'Hitag AES',
    chipType: 'PCF7939',
    frequency: '433.92MHz',
    compatibleParts: 'OHT1130261',
    notes: 'ID4A system'
  }),
  createTransponderEntry({
    make: 'JEEP',
    model: 'CHEROKEE',
    yearStart: 2015,
    yearEnd: 2021,
    transponderType: 'Hitag AES',
    chipType: 'PCF7953',
    frequency: '433.92MHz',
    compatibleParts: 'GQ4-54T',
    notes: 'ID4A system'
  }),
  createTransponderEntry({
    make: 'JEEP',
    model: 'COMPASS',
    yearStart: 2017,
    yearEnd: 2021,
    transponderType: 'Hitag AES',
    chipType: 'PCF7953',
    frequency: '433.92MHz',
    compatibleParts: 'M3N-40821302',
    notes: 'ID4A system'
  }),
  createTransponderEntry({
    make: 'JEEP',
    model: 'GLADIATOR',
    yearStart: 2018,
    yearEnd: 2021,
    transponderType: 'Hitag AES',
    chipType: 'PCF7939',
    frequency: '433.92MHz',
    compatibleParts: 'OHT1130261',
    notes: 'ID4A system'
  }),
  createTransponderEntry({
    make: 'JEEP',
    model: 'RENEGADE',
    yearStart: 2015,
    yearEnd: 2021,
    transponderType: 'Hitag AES',
    chipType: 'PCF7953M',
    frequency: '433.92MHz',
    compatibleParts: '6MP33DX9',
    notes: 'ID4A system'
  }),
  // Legacy models with older systems
  createTransponderEntry({
    make: 'JEEP',
    model: 'CHEROKEE',
    yearStart: 2008,
    yearEnd: 2017,
    transponderType: 'Philips Crypto 2',
    chipType: 'PCF7961',
    frequency: '433.92MHz',
    compatibleParts: 'IYZ-C01C',
    notes: 'Hitag 2/ID46 system'
  }),
  createTransponderEntry({
    make: 'JEEP',
    model: 'PATRIOT',
    yearStart: 2006,
    yearEnd: 2017,
    transponderType: 'Philips Crypto 2',
    chipType: 'PCF7936',
    frequency: '433.92MHz',
    compatibleParts: 'OHT692713AA',
    notes: 'ID46 system'
  }),
  // Add more models...
]; 