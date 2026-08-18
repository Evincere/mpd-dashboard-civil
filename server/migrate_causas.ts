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

function detectHospital(text: string): string | null {
  const upper = text.toUpperCase();
  if (upper.includes('SCHESTAKOW')) return 'HOSPITAL SCHESTAKOW';
  if (upper.includes('MALARGÜE') || upper.includes('MALARGUE')) return 'HOSPITAL REGIONAL MALARGÜE';
  if (upper.includes('CARRASCO')) return 'HOSPITAL CARRASCO';
  if (upper.includes('SALDAÑA') || upper.includes('SALDANA')) return 'HOSPITAL SALDAÑA';
  return null;
}

function detectTipoCausa(caratula: string): string {
  const upper = caratula.toUpperCase();
  if (upper.includes('INTERNACI') || upper.includes('26657') || upper.includes('SALUD MENTAL')) {
    return 'Internación Involuntaria Ley 26.657';
  }
  if (upper.includes('ALIMENTOS') || upper.includes('DIVORCIO') || upper.includes('CUIDADO PERSONAL')) {
    return 'Familia / Alimentos';
  }
  return 'Civil / Familia Generico';
}

function mapEstadoCausa(rawState: string): string {
  const upper = (rawState || '').toUpperCase();
  if (upper.includes('NUEVA') || upper.includes('INGRESO')) return 'NUEVA';
  if (upper.includes('TRÁMITE') || upper.includes('TRAMITE') || upper.includes('PROCESO')) return 'EN_TRAMITE';
  if (upper.includes('FINAL') || upper.includes('ARCHIV') || upper.includes('SENTENCIA')) return 'FINALIZADA';
  return 'EN_TRAMITE';
}

function mapNotificacionStatus(rawStatus: string): string {
  const upper = (rawStatus || '').toUpperCase();
  if (upper.includes('NOTIFIC') || upper.includes('SENTENCIA')) return 'NOTIFICADO';
  if (upper.includes('SIN')) return 'SIN_NOTIFICAR';
  return 'NOTIFICADO';
}

async function migrate() {
  console.log('🚀 Iniciando migración de causas desde causas_import.csv...');
  const fileContent = fs.readFileSync('causas_import.csv', 'utf-8');
  const rows = parseCSV(fileContent);

  let lastValidDate = '2026-01-06';
  const recordsToInsert: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip row if it looks like a table header
    if (row[0]?.toLowerCase().includes('fecha') || row[6]?.toLowerCase().includes('caratula')) {
      continue;
    }

    const rawFecha = row[0] || '';
    const fechaIngreso = normalizeDate(rawFecha, lastValidDate);
    lastValidDate = fechaIngreso;

    const sistema = row[1] || 'GEJUAFAM SR';
    const canal = row[2] || 'IOL';
    const rawEstado = row[3] || 'CAUSA NUEVA';
    const rawNotif = row[4] || 'NOTIFICACIÓN';
    const expteNro = row[5] || undefined;
    const caratula = row[6] || row[row.length - 1] || 'Causa Procesal Sin Carátula';

    if (!caratula || caratula.trim().length < 3) continue;

    const enteHospital = detectHospital(caratula);
    const tipoCausa = detectTipoCausa(caratula);
    const estadoCausa = mapEstadoCausa(rawEstado);
    const notificacionStatus = mapNotificacionStatus(rawNotif);

    recordsToInsert.push({
      fechaIngreso,
      sistema,
      canal,
      estadoCausa,
      notificacionStatus,
      expedienteNro: expteNro && expteNro.length > 0 ? expteNro : null,
      caratula,
      tipoCausa,
      enteHospital
    });
  }

  console.log(`📊 Procesados ${recordsToInsert.length} registros válidos de causas.`);
  console.log('Muestra del primer registro:', recordsToInsert[0]);
  console.log('Muestra del último registro:', recordsToInsert[recordsToInsert.length - 1]);

  // Bulk insert into Prisma
  console.log('💾 Guardando registros en PostgreSQL...');
  let insertedCount = 0;
  for (const item of recordsToInsert) {
    await prisma.causaIngreso.create({ data: item });
    insertedCount++;
  }

  // Create Audit Log entry
  await prisma.auditLog.create({
    data: {
      userId: 'admin',
      userNombre: 'Administrador (Migrador)',
      accion: 'MIGRACION_HISTORICA_CAUSAS',
      entidad: 'CausaIngreso',
      detalles: `Importados exitosamente ${insertedCount} registros históricos de causas desde la planilla oficial de la Defensoría.`
    }
  });

  console.log(`✅ ¡Migración completada exitosamente! ${insertedCount} causas persistidas en la BD.`);
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
