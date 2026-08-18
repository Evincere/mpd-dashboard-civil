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

function mapMedioContacto(raw: string): string {
  const upper = (raw || '').toUpperCase();
  if (upper.includes('WSP') || upper.includes('WHATSAPP')) return 'WHATSAPP';
  if (upper.includes('TEL') || upper.includes('LLAMADA')) return 'TELEFONO';
  if (upper.includes('PRESENCIAL') || upper.includes('MESA')) return 'PRESENCIAL';
  return 'WHATSAPP';
}

async function migrate() {
  console.log('🚀 Iniciando migración de Atención por WhatsApp desde wsp_import.csv...');
  const fileContent = fs.readFileSync('wsp_import.csv', 'utf-8');
  const rows = parseCSV(fileContent);

  const recordsToInsert: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip header
    if (row[0]?.toUpperCase().includes('FECHA') || row[3]?.toUpperCase().includes('NOMBRE')) {
      continue;
    }

    const rawFecha = row[0] || '';
    const nroExpte = row[1] || '';
    const juzgado = row[2] || '';
    const nombrePersona = row[3] || '';
    const telefono = row[4] || '';
    const rawCanal = row[5] || '';
    const motivo = row[6] || '';
    const observaciones = row[7] || '';

    const fecha = normalizeDate(rawFecha);
    const personaNombre = nombrePersona.trim() ? nombrePersona.trim() : (telefono ? `Consulta (${telefono})` : 'Consultante Anónimo');
    const telefonoWsp = telefono.trim() ? telefono.trim() : 'S/N Teléfono';
    const motivoConsulta = motivo.trim() ? motivo.trim() : 'Consulta General WhatsApp';
    const medioContacto = mapMedioContacto(rawCanal);

    // Build extra notes string
    const noteParts: string[] = [];
    if (juzgado && juzgado !== 'OTRO') noteParts.push(`Juzgado: ${juzgado}`);
    if (nroExpte) noteParts.push(`Expte: ${nroExpte}`);
    if (observaciones) noteParts.push(observaciones);

    recordsToInsert.push({
      fecha,
      personaNombre,
      telefonoWsp,
      motivoConsulta,
      medioContacto,
      atendidoPor: 'Mesa de Entrada / WhatsApp',
      estado: 'RESUELTO',
      notas: noteParts.length > 0 ? noteParts.join(' | ') : null
    });
  }

  console.log(`📊 Procesados ${recordsToInsert.length} registros válidos de Atención por WhatsApp.`);
  console.log('Muestra del primer registro:', recordsToInsert[0]);
  console.log('Muestra del último registro:', recordsToInsert[recordsToInsert.length - 1]);

  console.log('💾 Guardando atención al público por WhatsApp en PostgreSQL...');
  let insertedCount = 0;
  for (const item of recordsToInsert) {
    await prisma.atencionPublico.create({ data: item });
    insertedCount++;
  }

  // Audit Log entry
  await prisma.auditLog.create({
    data: {
      userId: 'admin',
      userNombre: 'Administrador (Migrador)',
      accion: 'MIGRACION_HISTORICA_WSP',
      entidad: 'AtencionPublico',
      detalles: `Importados exitosamente ${insertedCount} registros de atención por WhatsApp desde la planilla oficial.`
    }
  });

  console.log(`✅ ¡Migración de Atención WhatsApp completada! ${insertedCount} atenciones persistidas.`);
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
