import { createTransponderEntry } from './transponderData';

export const dodgeTransponders = [
  // Modern Hitag AES Systems (2013-2021)
  createTransponderEntry({
    make: 'DODGE',
    model: 'RAM',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'Hitag AES',
    chipType: JSON.stringify(['ID4A']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['GQ4-76T']),
    notes: 'Latest generation system'
  }),
  createTransponderEntry({
    make: 'DODGE',
    model: 'CHALLENGER',
    yearStart: 2015,
    yearEnd: 2023,
    transponderType: 'Texas Crypto',
    chipType: JSON.stringify(['4D-64']),
    frequency: '125 kHz',
    compatibleParts: JSON.stringify(['68273010AA', '68273011AA']),
    notes: 'Requires dealer programming'
  }),
  createTransponderEntry({
    make: 'DODGE',
    model: 'CHARGER',
    yearStart: 2011,
    yearEnd: 2021,
    transponderType: 'Hitag AES',
    chipType: JSON.stringify(['PCF7953M']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['M3M-40821302']),
    notes: 'ID4A system with NCF29A1M'
  }),
  // Hitag2 Systems (2008-2014)
  createTransponderEntry({
    make: 'DODGE',
    model: 'RAM PROMASTER',
    yearStart: 2015,
    yearEnd: 2019,
    transponderType: 'Philips Crypto 2',
    chipType: JSON.stringify(['PCF7946A']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['RX2TRF198']),
    notes: 'Hitag2/ID46 system'
  }),
  createTransponderEntry({
    make: 'DODGE',
    model: 'GRAND CARAVAN',
    yearStart: 2008,
    yearEnd: 2020,
    transponderType: 'Philips Crypto 2',
    chipType: JSON.stringify(['PCF7941']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['IYZ-C01C']),
    notes: 'Hitag2/ID46 system'
  }),
  createTransponderEntry({
    make: 'DODGE',
    model: 'JOURNEY',
    yearStart: 2011,
    yearEnd: 2020,
    transponderType: 'Hitag AES',
    chipType: JSON.stringify(['PCF7953M']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['M3N40821302']),
    notes: 'ID4A system'
  }),
  // Add more models...
]; 