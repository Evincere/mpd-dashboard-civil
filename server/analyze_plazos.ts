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

const fileContent = fs.readFileSync('plazos_import.csv', 'utf-8');
const rows = parseCSV(fileContent);

console.log('Total non-empty rows:', rows.length);

const prioridades: Record<string, number> = {};
const responsables: Record<string, number> = {};

rows.forEach((r, idx) => {
  if (idx < 25) console.log(`[Row ${idx}]`, r);
  const prio = r[2] || '';
  const resp = r[3] || '';
  if (prio) prioridades[prio] = (prioridades[prio] || 0) + 1;
  if (resp) responsables[resp] = (responsables[resp] || 0) + 1;
});

console.log('\nPrioridades únicas encontradas:', prioridades);
console.log('Responsables únicos encontrados:', responsables);
