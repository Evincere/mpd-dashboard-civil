import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

function normalizeDate(rawDate: string): string {
  if (!rawDate || rawDate.trim() === '') return '2026-08-14';
  const clean = rawDate.trim();
  const parts = clean.split(/[\/\-]/);
  if (parts.length >= 2) {
    let day = parts[0].padStart(2, '0');
    let month = parts[1].padStart(2, '0');
    let year = parts[2] ? (parts[2].length === 2 ? '20' + parts[2] : parts[2]) : '2026';
    return `${year}-${month}-${day}`;
  }
  return '2026-08-14';
}

function mapPrioridad(rawPrio: string): string {
  const upper = (rawPrio || '').toUpperCase().trim();
  if (upper.includes('URG')) return 'URG';
  if (upper.includes('S/P') || upper.includes('SIN PLAZO')) return 'S_P';
  if (upper.includes('VENC')) return 'VENC';
  return 'NORMAL';
}

const SINGLE_MAP: Record<string, { initials: string; nombre: string }> = {
  'LA': { initials: 'lalvarado', nombre: 'Dra. Laura Alvarado' },
  'AD': { initials: 'adimenza', nombre: 'Dra. Alejandra Di Menza' },
  'JP': { initials: 'jpapini', nombre: 'Juan Pablo Papini' },
  'JB': { initials: 'jbayon', nombre: 'Dra. Jorgelina Bayon' },
  'SC': { initials: 'sec_civil', nombre: 'Secretaría Civil' }
};

function mapResponsable(rawResp: string): { initials: string; nombre: string } {
  const clean = (rawResp || '').trim().toUpperCase();

  if (!clean || clean === 'RESPONSABLE') {
    return { initials: 'sin_asignar', nombre: 'Sin Asignar' };
  }

  // Handle composite responsibles separated by hyphen (e.g. JP-JB, JP-LA, LA-JB, SC-LA)
  if (clean.includes('-')) {
    const parts = clean.split('-').map(p => p.trim());
    const matched = parts.map(p => SINGLE_MAP[p] || { initials: p.toLowerCase(), nombre: p });
    const initials = matched.map(m => m.initials).join(', ');
    const nombre = matched.map(m => m.nombre).join(' / ');
    return { initials, nombre };
  }

  if (SINGLE_MAP[clean]) {
    return SINGLE_MAP[clean];
  }

  // Fallback for any unknown initials
  return { initials: clean.toLowerCase(), nombre: clean };
}

function mapEstado(rawPrio: string, fechaVencimiento: string): string {
  const upper = (rawPrio || '').toUpperCase().trim();
  if (upper.includes('VENCIDO') || upper.includes('VENC')) return 'VENCIDO';
  if (upper.includes('CUMPLIDO') || upper.includes('OK')) return 'CUMPLIDO';
  return 'PENDIENTE';
}

async function migrate() {
  console.log('🚀 Reiniciando y migrando Plazos Procesales desde plazos_import.csv con mapa exacto...');
  
  // Clear existing Plazo table
  await prisma.plazo.deleteMany({});
  console.log('🧹 Tabla Plazo vaciada antes de la migración.');

  const fileContent = fs.readFileSync('plazos_import.csv', 'utf-8');
  const rows = parseCSV(fileContent);

  const recordsToInsert: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip headers
    if (row[0]?.toLowerCase().includes('ingreso') || row[1]?.toLowerCase().includes('expediente')) {
      continue;
    }

    const rawFecha = row[0] || '';
    const caratula = row[1] || '';
    const rawVence = row[2] || '';
    const rawResp = row[3] || '';

    if (!caratula || caratula.trim().length < 3) continue;

    const fechaVencimiento = normalizeDate(rawVence.includes('/') ? rawVence : rawFecha);
    const prioridad = mapPrioridad(rawVence);
    const { initials, nombre } = mapResponsable(rawResp);
    const estado = mapEstado(rawVence, fechaVencimiento);

    recordsToInsert.push({
      fechaVencimiento,
      caratula: caratula.trim(),
      prioridad,
      asignadoInitials: initials,
      asignadoNombre: nombre,
      estado,
      observaciones: rawVence && !rawVence.includes('/') ? `Nota referencia: ${rawVence}` : null
    });
  }

  console.log(`📊 Procesados ${recordsToInsert.length} registros válidos de plazos procesales.`);
  console.log('Muestra de plazo individual:', recordsToInsert.find(r => r.asignadoInitials === 'jpapini'));
  console.log('Muestra de plazo compuesto (JP-JB):', recordsToInsert.find(r => r.asignadoInitials.includes('jpapini') && r.asignadoInitials.includes('jbayon')));

  console.log('💾 Guardando plazos procesales con nuevo mapa en PostgreSQL...');
  let insertedCount = 0;
  for (const item of recordsToInsert) {
    await prisma.plazo.create({ data: item });
    insertedCount++;
  }

  // Audit Log entry
  await prisma.auditLog.create({
    data: {
      userId: 'admin',
      userNombre: 'Administrador (Migrador)',
      accion: 'RE_MIGRACION_HISTORICA_PLAZOS',
      entidad: 'Plazo',
      detalles: `Re-migrados exitosamente ${insertedCount} plazos procesales con asignación corregida: LA, AD, JP, JB y compartidos (JP-JB, JP-LA, etc.).`
    }
  });

  console.log(`✅ ¡Re-migración de Plazos completada! ${insertedCount} plazos persistidos correctamente.`);
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
