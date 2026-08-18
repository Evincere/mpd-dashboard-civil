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

function normalizeDate(rawDate: string, lastDate: string): string {
  if (!rawDate || rawDate.trim() === '') return lastDate;
  const clean = rawDate.trim();
  const parts = clean.split(/[\/\-]/);
  if (parts.length >= 2) {
    let day = parts[0].padStart(2, '0');
    let month = parts[1].padStart(2, '0');
    let year = parts[2] ? (parts[2].length === 2 ? '20' + parts[2] : parts[2]) : '2026';
    return `${year}-${month}-${day}`;
  }
  return lastDate;
}

function mapEstado(raw: string): string {
  const upper = (raw || '').toUpperCase();
  if (upper.includes('ACEPTADO')) return 'ACEPTADO';
  if (upper.includes('INICIADO') && !upper.includes('NO')) return 'INICIADO';
  if (upper.includes('NO')) return 'NO INICIADO';
  if (upper.includes('TRÁMITE') || upper.includes('TRAMITE')) return 'EN TRÁMITE';
  return 'INICIADO';
}

function mapResultado(raw: string): string {
  const upper = (raw || '').toUpperCase();
  if (upper.includes('ACEPTADO')) return 'ACEPTADO';
  if (upper.includes('RECHAZADO')) return 'RECHAZADO';
  if (upper.includes('PENDIENTE')) return 'PENDIENTE';
  return 'EN TRÁMITE';
}

function detectTipoConvenio(caratula: string, obs: string): string {
  const combined = (caratula + ' ' + obs).toUpperCase();
  if (combined.includes('OSEP') || combined.includes('MEDICAMENTO') || combined.includes('AUDIFONO') || combined.includes('IMPLANTE')) {
    return 'GESTIÓN OSEP / SALUD';
  }
  if (combined.includes('DIVISION') || combined.includes('BIENES') || combined.includes('LIQUIDACION')) {
    return 'CONVENIO DIVISIÓN DE BIENES';
  }
  if (combined.includes('INMOBILIARIA') || combined.includes('CONCILIAC') || combined.includes('EXTRAJUDICIAL')) {
    return 'ACUERDO EXTRAJUDICIAL';
  }
  return 'CONVENIO JUDICIAL GENERAL';
}

async function migrate() {
  console.log('🚀 Iniciando migración de Convenios y OSEP desde convenios_import.csv...');
  const fileContent = fs.readFileSync('convenios_import.csv', 'utf-8');
  const rows = parseCSV(fileContent);

  let lastValidDate = '2026-04-14';
  const recordsToInsert: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip header
    if (row[0]?.toUpperCase().includes('FECHA') || row[2]?.toUpperCase().includes('EXPTE')) {
      continue;
    }

    const rawFecha = row[0] || '';
    const rawEstado = row[1] || '';
    const expteCaratulaRaw = row[2] || '';
    const rawResultado = row[3] || '';
    const observacionesRaw = row[4] || '';

    const fecha = normalizeDate(rawFecha, lastValidDate);
    lastValidDate = fecha;

    const estado = mapEstado(rawEstado);
    const resultado = mapResultado(rawResultado);
    const observaciones = observacionesRaw.trim() ? observacionesRaw.trim() : 'Sin observaciones.';
    const expteCaratula = expteCaratulaRaw.trim() ? expteCaratulaRaw.trim() : (observaciones.length > 30 ? observaciones.substring(0, 30) + '...' : observaciones);
    const tipoConvenio = detectTipoConvenio(expteCaratula, observaciones);

    recordsToInsert.push({
      fecha,
      estado,
      expteCaratula,
      resultado,
      observaciones,
      tipoConvenio
    });
  }

  console.log(`📊 Procesados ${recordsToInsert.length} registros válidos de Convenios y OSEP.`);
  console.log('Muestra del primer registro:', recordsToInsert[0]);
  console.log('Muestra del último registro:', recordsToInsert[recordsToInsert.length - 1]);

  console.log('💾 Guardando convenios en PostgreSQL...');
  let insertedCount = 0;
  for (const item of recordsToInsert) {
    await prisma.convenio.create({ data: item });
    insertedCount++;
  }

  // Audit Log entry
  await prisma.auditLog.create({
    data: {
      userId: 'admin',
      userNombre: 'Administrador (Migrador)',
      accion: 'MIGRACION_HISTORICA_CONVENIOS',
      entidad: 'Convenio',
      detalles: `Importados exitosamente ${insertedCount} registros de convenios y gestiones OSEP desde la planilla oficial.`
    }
  });

  console.log(`✅ ¡Migración de Convenios completada! ${insertedCount} convenios persistidos en la BD.`);
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
