import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const INITIAL_USERS = [
  {
    name: 'Laura Alvarado',
    initials: 'lalvarado',
    role: 'Codefensor/a',
    email: 'lalvarado@mpd.mendoza.gov.ar',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Alejandra Di Menza',
    initials: 'adimenza',
    role: 'Codefensor/a',
    email: 'adimenza@mpd.mendoza.gov.ar',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Jorgelina Bayon',
    initials: 'jbayon',
    role: 'Defensor/a',
    email: 'jbayon@mpd.mendoza.gov.ar',
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Sergio Pereyra',
    initials: 'semper',
    role: 'Administrador',
    email: 'spereyra@mpd.mendoza.gov.ar',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120'
  }
];

const INITIAL_PLAZOS = [
  {
    fechaVencimiento: '2026-08-06',
    caratula: 'HOSPITAL SCHESTAKOW P/CORDOVA SEBASTIAN P/ INTERNACIÓN INVOLUNTARIA',
    prioridad: 'URG',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE',
    expedienteNro: 'EXP-88912/26',
    observaciones: 'Vence plazo de contestación informe médico hospitalario.'
  },
  {
    fechaVencimiento: '2026-08-07',
    caratula: 'HOSPITAL SCHESTAKOW P/ OLQUIN IVAN IBRAHIM P/ INTERNACION (LEY SALUD 26.657)',
    prioridad: 'URG',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE',
    expedienteNro: 'EXP-90112/26'
  },
  {
    fechaVencimiento: '2026-08-07',
    caratula: 'HOSPITAL SCHESTAKOW P/ AVILA JONATHAN P/ INTERNACION (LEY SALUD)',
    prioridad: 'URG',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE',
    expedienteNro: 'EXP-90150/26'
  },
  {
    fechaVencimiento: '2026-08-08',
    caratula: 'OLATE EVA P BARRIOS VICTOR P DET DE CAPACIDAD',
    prioridad: 'S_P',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE',
    expedienteNro: 'EXP-77211/25'
  },
  {
    fechaVencimiento: '2026-08-08',
    caratula: 'HOSPITAL SCHESTAKOW P/ YAÑEZ JOSE PABLO P/INTERNACIÓN',
    prioridad: 'URG',
    asignadoInitials: 'jbayon',
    asignadoNombre: 'Jorgelina Bayon',
    estado: 'PENDIENTE'
  }
];

const INITIAL_CAUSAS = [
  {
    fechaIngreso: '2026-08-06',
    canal: 'GEJU',
    sistema: 'IOL Judicial Mendoza',
    caratula: 'HOSP P SALDAÑA ROXANA ELIZABETH P/ INTERNACIÓN INVOLUNTARIA LEY 26657',
    tipoCausa: 'INTERNACION_INVOLUNTARIA',
    enteHospital: 'HOSPITAL SCHESTAKOW',
    estadoCausa: 'NUEVA',
    notificacionStatus: 'NOTIFICADO',
    expedienteNro: '26657/2026',
    observaciones: 'Ingreso directo via GEJU con oficio médico urgente.'
  },
  {
    fechaIngreso: '2026-08-06',
    canal: 'GEJU',
    sistema: 'IOL Judicial Mendoza',
    caratula: 'HOSPITAL SCHESTAKOW POR ROJAS BETIANA P/ INTERNACIÓN INVOLUNTARIA LEY DE SALUD MENTAL 26657',
    tipoCausa: 'INTERNACION_INVOLUNTARIA',
    enteHospital: 'HOSPITAL SCHESTAKOW',
    estadoCausa: 'NUEVA',
    notificacionStatus: 'NOTIFICADO',
    expedienteNro: '26660/2026'
  }
];

const INITIAL_TAREAS = [
  {
    fecha: '2026-08-06',
    caratulaPersona: 'BAJBUJ',
    responsableNombre: 'Laura Alvarado',
    accion: 'ASUME',
    estado: 'EN_PROCESO',
    notas: 'Tomar razón e informar al juzgado.'
  },
  {
    fecha: '2026-08-06',
    caratulaPersona: 'ZAPATA NATALIA',
    responsableNombre: 'Laura Alvarado',
    accion: 'CONTESTA VISTA',
    estado: 'PENDIENTE',
    notas: 'Vence vista de 3 días.'
  }
];

const INITIAL_CONVENIOS = [
  {
    fecha: '2026-08-01',
    estado: 'NO INICIADO',
    expteCaratula: 'SRA. ROQUER GLADYS NANCY P/ GESTION OSEP',
    resultado: 'EN TRÁMITE',
    observaciones: 'Gestión con OSEP por provisión de medicamento biológico prioritario.',
    tipoConvenio: 'GESTION OSEP MEDICAMENTO'
  }
];

const INITIAL_ATENCION = [
  {
    fecha: '2026-08-06',
    personaNombre: 'Gómez, María Elena',
    telefonoWsp: '+54 9 260 458-9921',
    motivoConsulta: 'Consulta por régimen de comunicación y cuota alimentaria voluntaria.',
    medioContacto: 'WHATSAPP',
    atendidoPor: 'Mesa de Entrada',
    estado: 'EN_SEGUIMIENTO',
    notas: 'Solicitado envío de bonos de sueldo.'
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.plazo.deleteMany();
  await prisma.causaIngreso.deleteMany();
  await prisma.tareaDiaria.deleteMany();
  await prisma.convenio.deleteMany();
  await prisma.atencionPublico.deleteMany();
  await prisma.userProfile.deleteMany();

  const hashedPassword = await bcrypt.hash('123456', 10);

  for (const item of INITIAL_USERS) {
    await prisma.userProfile.create({ 
      data: {
        ...item,
        password: hashedPassword
      }
    });
  }
  console.log('👤 Users seeded');

  for (const item of INITIAL_PLAZOS) {
    await prisma.plazo.create({ data: item });
  }

  for (const item of INITIAL_CAUSAS) {
    await prisma.causaIngreso.create({ data: item });
  }

  for (const item of INITIAL_TAREAS) {
    await prisma.tareaDiaria.create({ data: item });
  }

  for (const item of INITIAL_CONVENIOS) {
    await prisma.convenio.create({ data: item });
  }

  for (const item of INITIAL_ATENCION) {
    await prisma.atencionPublico.create({ data: item });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
