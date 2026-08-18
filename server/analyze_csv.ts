import fs from 'fs';

const fileContent = fs.readFileSync('causas_import.csv', 'utf-8');

// Custom CSV parser handling quotes
function parseCSV(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentToken = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentToken.trim());
      rows.push(currentRow);
      currentRow = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }
  if (currentToken || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    rows.push(currentRow);
  }
  return rows.filter(r => r.some(cell => cell.length > 0));
}

const parsedRows = parseCSV(fileContent);

console.log('Total parsed rows:', parsedRows.length);
console.log('Sample parsed row 0:', parsedRows[0]);
console.log('Sample parsed row 1:', parsedRows[1]);
console.log('Sample parsed row 2:', parsedRows[2]);

let maxCols = 0;
parsedRows.forEach(r => {
  if (r.length > maxCols) maxCols = r.length;
});
console.log('Max columns in any row:', maxCols);

// Detect hospital names
const hospitalCounts: Record<string, number> = {};
parsedRows.forEach(r => {
  const text = r.join(' ');
  if (text.includes('SCHESTAKOW')) hospitalCounts['SCHESTAKOW'] = (hospitalCounts['SCHESTAKOW'] || 0) + 1;
  if (text.includes('MALARGÜE') || text.includes('MALARGUE')) hospitalCounts['MALARGÜE'] = (hospitalCounts['MALARGÜE'] || 0) + 1;
});
console.log('Hospitals detected:', hospitalCounts);
