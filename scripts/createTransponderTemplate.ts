import { writeFileSync } from 'fs';
import path from 'path';

const template = [
  {
    make: 'TOYOTA',
    model: 'CAMRY',
    yearStart: '2018',
    yearEnd: '2022',
    transponderType: '8A',
    chipType: 'H',
    frequency: '433MHz',
    notes: 'Smart key system',
    compatibleParts: 'HYQ14FBA'
  },
  {
    make: 'HONDA',
    model: 'CIVIC',
    yearStart: '2016',
    yearEnd: '2021',
    transponderType: '46',
    chipType: 'G',
    frequency: '313.85MHz',
    notes: 'Flip key available',
    compatibleParts: 'N5F-A05TAA'
  },
  {
    make: 'FORD',
    model: 'F-150',
    yearStart: '2015',
    yearEnd: '',  // Example of empty yearEnd
    transponderType: '4D63',
    chipType: 'H',
    frequency: '902MHz',
    notes: '',  // Example of empty notes
    compatibleParts: 'M3N-A2C31243300'
  }
];

// Handle potential commas in values by quoting them
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const csvHeader = Object.keys(template[0]).join(',');
const csvRows = template.map(obj => 
  Object.values(obj)
    .map(val => escapeCSV(String(val)))
    .join(',')
);
const csvContent = [csvHeader, ...csvRows].join('\n');

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!require('fs').existsSync(dataDir)) {
  require('fs').mkdirSync(dataDir);
}

const outputPath = path.join(dataDir, 'transponder-template.csv');
writeFileSync(outputPath, csvContent);
console.log(`Template created at: ${outputPath}`);
console.log('\nTemplate contains example data for:');
template.forEach(row => {
  console.log(`- ${row.make} ${row.model} (${row.yearStart}-${row.yearEnd || 'Present'})`);
});
console.log('\nUse this template to create your CSV file with transponder data.');
console.log('Then import it using: npm run import:transponders -- ./data/your-file.csv'); 