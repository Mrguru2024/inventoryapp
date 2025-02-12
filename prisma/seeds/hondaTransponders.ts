import { createTransponderEntry } from './transponderData';

export const hondaTransponders = [
  // Modern Hitag-3 Systems (2013+)
  createTransponderEntry({
    make: 'HONDA',
    model: 'ACCORD',
    yearStart: 2013,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: JSON.stringify(['PCF7961']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['72147-T2A-A22']),
    notes: 'Hitag-3/ID47 system'
  }),
  createTransponderEntry({
    make: 'HONDA',
    model: 'CIVIC',
    yearStart: 2013,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: JSON.stringify(['PCF7961']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['35118-T2A-A20']),
    notes: 'Hitag-3/ID47 system'
  }),
  createTransponderEntry({
    make: 'HONDA',
    model: 'CR-V',
    yearStart: 2014,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 3',
    chipType: JSON.stringify(['PCF7961']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['NCF2952X']),
    notes: 'Hitag-3/ID47 system'
  }),
  // Hitag-2 Systems (2006-2013)
  createTransponderEntry({
    make: 'HONDA',
    model: 'PILOT',
    yearStart: 2008,
    yearEnd: 2015,
    transponderType: 'Philips Crypto ID46',
    chipType: JSON.stringify(['PCF7941A']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['35118SZAA51']),
    notes: 'Hitag-2 system'
  }),
  // Motorcycle Systems
  createTransponderEntry({
    make: 'HONDA',
    model: 'CBR1000',
    yearStart: 2004,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 2',
    chipType: JSON.stringify(['PCF7936']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['XT27A66']),
    notes: 'HISS system - Hitag2/ID46'
  }),
  createTransponderEntry({
    make: 'HONDA',
    model: 'NC700X',
    yearStart: 2012,
    yearEnd: 2024,
    transponderType: 'Philips Crypto 2',
    chipType: JSON.stringify(['PCF7936']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['CN3']),
    notes: 'Hitag2/ID46 system'
  }),
  createTransponderEntry({
    make: 'HONDA',
    model: 'CIVIC',
    yearStart: 2016,
    yearEnd: 2024,
    transponderType: 'G Chip',
    chipType: JSON.stringify(['G']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['35118-TBA-A00']),
    notes: 'G system with keyless entry'
  }),
  createTransponderEntry({
    make: 'HONDA',
    model: 'ACCORD',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: 'G Chip',
    chipType: JSON.stringify(['G']),
    frequency: '433.92 MHz',
    compatibleParts: JSON.stringify(['35118-TVA-A00']),
    notes: 'G system with smart entry'
  }),
  // Add more models...
]; 