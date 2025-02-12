import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const renaultTransponders = [
  createTransponderEntry({
    make: 'RENAULT',
    model: 'CAPTUR',
    yearStart: 2020,
    yearEnd: 2024,
    transponderType: 'PCF7953M',
    chipType: 'PCF7953',
    frequency: '433.92MHz',
    compatibleParts: '7701209132',
    notes: 'Hands free system'
  }),
  createTransponderEntry({
    make: 'RENAULT',
    model: 'CLIO',
    yearStart: 2019,
    yearEnd: 2024,
    transponderType: 'PCF7939MA',
    chipType: 'PCF7939',
    frequency: '433.92MHz',
    compatibleParts: '7701208969',
    notes: 'Card system'
  }),
  // Add more models...
]; 