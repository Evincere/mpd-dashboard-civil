import fs from 'fs';

const fileContent = fs.readFileSync('causas_import.csv', 'utf-8');
const lines = fileContent.split('\n');

console.log('Total lines:', lines.length);
console.log('First 20 lines:');
lines.slice(0, 20).forEach((line, index) => {
  console.log(`[${index}]`, line);
});
