import { createTransponderEntry } from './transponderData';

export const buickTransponders = [
  // Modern Hitag2 Extended Systems (2016+)
  createTransponderEntry({
    make: 'BUICK',
    model: 'ENCLAVE',
    yearStart: 2018,
    yearEnd: 2023,
    transponderType: 'Hitag 3',
    chipType: ['PCF7953M'],
    frequency: '433.92MHz',
    compatibleParts: ['13508769'],
    notes: 'Hitag 3 system'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'ENCORE',
    yearStart: 2017,
    yearEnd: 2021,
    transponderType: 'Hitag2 Extended',
    chipType: 'PCF7952E',
    frequency: '315MHz',
    compatibleParts: 'HYQ4AA',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'ENVISION',
    yearStart: 2016,
    yearEnd: 2020,
    transponderType: 'Hitag2 Extended',
    chipType: 'PCF7952E',
    frequency: '315MHz',
    compatibleParts: 'HYQ4AA',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'LACROSSE',
    yearStart: 2017,
    yearEnd: 2019,
    transponderType: 'Hitag2 Extended',
    chipType: 'PCF7952E',
    frequency: '315MHz',
    compatibleParts: 'HYQ4EA',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'REGAL',
    yearStart: 2018,
    yearEnd: 2020,
    transponderType: 'Hitag2 Extended',
    chipType: 'PCF7952E',
    frequency: '315MHz',
    compatibleParts: 'HYQ4EA',
    notes: 'ID46E system'
  }),
  // Earlier Hitag2 Systems (2010-2016)
  createTransponderEntry({
    make: 'BUICK',
    model: 'CASCADA',
    yearStart: 2016,
    yearEnd: 2019,
    transponderType: 'Hitag2 Extended',
    chipType: 'PCF7937E',
    frequency: '315MHz',
    compatibleParts: 'KR55WK50073',
    notes: 'ID46E system'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'VERANO',
    yearStart: 2012,
    yearEnd: 2017,
    transponderType: 'Hitag2 Extended',
    chipType: 'PCF7937E',
    frequency: '315MHz',
    compatibleParts: '13500227',
    notes: 'ID46E system'
  }),
  // VATS/PassKey Legacy Systems
  createTransponderEntry({
    make: 'BUICK',
    model: 'CENTURY',
    yearStart: 1997,
    yearEnd: 2005,
    transponderType: 'VATS/PassKey',
    chipType: 'Resistor',
    frequency: 'N/A',
    compatibleParts: 'Multiple Values',
    notes: 'PassKey III system - Values 2-15 (402Ω-11.8kΩ)'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'LESABRE',
    yearStart: 1992,
    yearEnd: 1999,
    transponderType: 'VATS/PassKey',
    chipType: 'Resistor',
    frequency: 'N/A',
    compatibleParts: 'Multiple Values',
    notes: 'VATS system - 14 resistance values'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'PARK AVENUE',
    yearStart: 1991,
    yearEnd: 1996,
    transponderType: 'VATS/PassKey',
    chipType: 'Resistor',
    frequency: 'N/A',
    compatibleParts: 'Multiple Values',
    notes: 'VATS system - Values CN through UW'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'REGAL',
    yearStart: 1994,
    yearEnd: 2004,
    transponderType: 'VATS/PassKey',
    chipType: 'Resistor',
    frequency: 'N/A',
    compatibleParts: 'Multiple Values',
    notes: 'VATS system - 10% tolerance range'
  }),
  createTransponderEntry({
    make: 'BUICK',
    model: 'RIVIERA',
    yearStart: 1990,
    yearEnd: 1998,
    transponderType: 'VATS/PassKey',
    chipType: 'Resistor',
    frequency: 'N/A',
    compatibleParts: 'Multiple Values',
    notes: 'VATS system - 523Ω to 11.8kΩ range'
  }),
  // Add more models...
]; 