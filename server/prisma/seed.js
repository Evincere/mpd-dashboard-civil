"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const INITIAL_PLAZOS = [
    {
        fechaVencimiento: '2026-08-06',
        caratula: 'HOSPITAL SCHESTAKOW P/CORDOVA SEBASTIAN P/ INTERNACIÓN INVOLUNTARIA',
        prioridad: 'URG',
        asignadoInitials: 'LA',
        asignadoNombre: 'Alvarado',
        estado: 'PENDIENTE',
        expedienteNro: 'EXP-88912/26',
        observaciones: 'Vence plazo de contestación informe médico hospitalario.'
    },
    {
        fechaVencimiento: '2026-08-07',
        caratula: 'HOSPITAL SCHESTAKOW P/ OLQUIN IVAN IBRAHIM P/ INTERNACION (LEY SALUD 26.657)',
        prioridad: 'URG',
        asignadoInitials: 'LA',
        asignadoNombre: 'Alvarado',
        estado: 'PENDIENTE',
        expedienteNro: 'EXP-90112/26'
    },
    {
        fechaVencimiento: '2026-08-07',
        caratula: 'HOSPITAL SCHESTAKOW P/ AVILA JONATHAN P/ INTERNACION (LEY SALUD)',
        prioridad: 'URG',
        asignadoInitials: 'LA',
        asignadoNombre: 'Alvarado',
        estado: 'PENDIENTE',
        expedienteNro: 'EXP-90150/26'
    },
    {
        fechaVencimiento: '2026-08-08',
        caratula: 'OLATE EVA P BARRIOS VICTOR P DET DE CAPACIDAD',
        prioridad: 'S_P',
        asignadoInitials: 'LA',
        asignadoNombre: 'Alvarado',
        estado: 'PENDIENTE',
        expedienteNro: 'EXP-77211/25'
    },
    {
        fechaVencimiento: '2026-08-08',
        caratula: 'HOSPITAL SCHESTAKOW P/ YAÑEZ JOSE PABLO P/INTERNACIÓN',
        prioridad: 'URG',
        asignadoInitials: 'JB',
        asignadoNombre: 'JB - Secretario',
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
        responsableNombre: 'ALVARADO',
        accion: 'ASUME',
        estado: 'EN_PROCESO',
        notas: 'Tomar razón e informar al juzgado.'
    },
    {
        fecha: '2026-08-06',
        caratulaPersona: 'ZAPATA NATALIA',
        responsableNombre: 'ALVARADO',
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
