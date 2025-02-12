import { BaseTransponderData, createTransponderEntry } from './transponderData';

export const toyotaTransponders = [
  createTransponderEntry({
    make: 'TOYOTA',
    model: 'CAMRY',
    yearStart: 2018,
    yearEnd: 2024,
    transponderType: '8A',
    chipType: 'H',
    frequency: '433MHz',
    compatibleParts: 'HYQ14FBA',
    notes: 'Smart key system'
  }),
  // Add more Toyota models...
]; 