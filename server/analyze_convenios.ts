import fs from 'fs';

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

const fileContent = fs.readFileSync('convenios_import.csv', 'utf-8');
const rows = parseCSV(fileContent);

console.log('Total rows:', rows.length);
rows.slice(0, 20).forEach((r, idx) => {
  console.log(`[Row ${idx}]`, r);
});
