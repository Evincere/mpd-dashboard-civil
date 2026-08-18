import type { Plazo, CausaIngreso, TareaDiaria, Convenio, AtencionPublico, UserProfile } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'usr-1',
  name: 'Sergio Pereyra',
  initials: 'semper',
  role: 'Administrador',
  email: 'spereyra@mpd.mendoza.gov.ar',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120'
};

export const INITIAL_PLAZOS: Plazo[] = [
  {
    id: 'plz-1',
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
    id: 'plz-2',
    fechaVencimiento: '2026-08-07',
    caratula: 'HOSPITAL SCHESTAKOW P/ OLQUIN IVAN IBRAHIM P/ INTERNACION (LEY SALUD 26.657)',
    prioridad: 'URG',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE',
    expedienteNro: 'EXP-90112/26'
  },
  {
    id: 'plz-3',
    fechaVencimiento: '2026-08-07',
    caratula: 'HOSPITAL SCHESTAKOW P/ AVILA JONATHAN P/ INTERNACION (LEY SALUD)',
    prioridad: 'URG',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE',
    expedienteNro: 'EXP-90150/26'
  },
  {
    id: 'plz-4',
    fechaVencimiento: '2026-08-08',
    caratula: 'OLATE EVA P BARRIOS VICTOR P DET DE CAPACIDAD',
    prioridad: 'S_P',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE',
    expedienteNro: 'EXP-77211/25'
  },
  {
    id: 'plz-5',
    fechaVencimiento: '2026-08-08',
    caratula: 'HOSPITAL SCHESTAKOW P/ YAÑEZ JOSE PABLO P/INTERNACIÓN',
    prioridad: 'URG',
    asignadoInitials: 'jbayon',
    asignadoNombre: 'Jorgelina Bayon',
    estado: 'PENDIENTE'
  },
  {
    id: 'plz-6',
    fechaVencimiento: '2026-08-10',
    caratula: 'MARTINEZ LEONIDES C/ SUCESORES DE ROMERO GONZALEZ JUAN P/ PRESCRIPCION ADQUISITIVA',
    prioridad: 'NORMAL',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE',
    observaciones: 'Presentar traslado de demanda.'
  },
  {
    id: 'plz-7',
    fechaVencimiento: '2026-08-11',
    caratula: 'GUEVARA MIRTA CRISTINA C/ SUCESORES DE CAPELLI ENRIQUE Y OLLARES',
    prioridad: 'URG',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE'
  },
  {
    id: 'plz-8',
    fechaVencimiento: '2026-08-05',
    caratula: 'ASESORA P MARIA ELIZABETH GARCIA',
    prioridad: 'VENC',
    asignadoInitials: 'semper',
    asignadoNombre: 'Sergio Pereyra',
    estado: 'VENCIDO',
    observaciones: 'Solicitar prórroga urgente de vista.'
  },
  {
    id: 'plz-9',
    fechaVencimiento: '2026-08-14',
    caratula: 'VERGARA P/ SUCESIÓN: EXPRESIÓN AGRAVIOS',
    prioridad: 'NORMAL',
    asignadoInitials: 'adimenza',
    asignadoNombre: 'Alejandra Di Menza',
    estado: 'PENDIENTE'
  },
  {
    id: 'plz-10',
    fechaVencimiento: '2026-08-15',
    caratula: 'CERVERA MYRIAM EDITH P/ BECERRA MARIA RAQUELA P/ DETERMINACIÓN DE CAPACIDAD',
    prioridad: 'URG',
    asignadoInitials: 'lalvarado',
    asignadoNombre: 'Laura Alvarado',
    estado: 'PENDIENTE'
  }
];

export const INITIAL_CAUSAS: CausaIngreso[] = [
  {
    id: 'causa-101',
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
    id: 'causa-102',
    fechaIngreso: '2026-08-06',
    canal: 'GEJU',
    sistema: 'IOL Judicial Mendoza',
    caratula: 'HOSPITAL SCHESTAKOW POR ROJAS BETIANA P/ INTERNACIÓN INVOLUNTARIA LEY DE SALUD MENTAL 26657',
    tipoCausa: 'INTERNACION_INVOLUNTARIA',
    enteHospital: 'HOSPITAL SCHESTAKOW',
    estadoCausa: 'NUEVA',
    notificacionStatus: 'NOTIFICADO',
    expedienteNro: '26660/2026'
  },
  {
    id: 'causa-103',
    fechaIngreso: '2026-08-05',
    canal: 'GEJU',
    sistema: 'IOL Judicial Mendoza',
    caratula: 'HOSPITAL REGIONAL MALARGÜE P/ OLIVERA, CAROLINA DANIELA DEL CARMEN C/ P/ - INTERNACIÓN',
    tipoCausa: 'INTERNACION_INVOLUNTARIA',
    enteHospital: 'HOSPITAL REGIONAL MALARGÜE',
    estadoCausa: 'EN_TRAMITE',
    notificacionStatus: 'NOTIFICADO',
    expedienteNro: 'MLG-1023/26'
  },
  {
    id: 'causa-104',
    fechaIngreso: '2026-08-04',
    canal: 'GEJU',
    sistema: 'IOL Judicial Mendoza',
    caratula: 'HOSPITAL REGIONAL MALARGÜE P/ VERA ACOSTA, ANGEL JOAQUIN C/ P/ - INTERNACIÓN',
    tipoCausa: 'INTERNACION_INVOLUNTARIA',
    enteHospital: 'HOSPITAL REGIONAL MALARGÜE',
    estadoCausa: 'EN_TRAMITE',
    notificacionStatus: 'NOTIFICADO',
    expedienteNro: 'MLG-1019/26'
  },
  {
    id: 'causa-105',
    fechaIngreso: '2026-08-03',
    canal: 'MAIL',
    sistema: 'Mesa de Entrada MPD',
    caratula: 'HOSPITAL SCHESTAKOW P/ QUIROGA, SABRINA MARIEL P/ - MEDIDA CONEXA (TRASLADO INVOLUNTARIO LEY 26.657)',
    tipoCausa: 'MEDIDA_CONEXA',
    enteHospital: 'HOSPITAL SCHESTAKOW',
    estadoCausa: 'NUEVA',
    notificacionStatus: 'PENDIENTE_ENVIO',
    observaciones: 'Pendiente de oficio a Policía de Mendoza.'
  },
  {
    id: 'causa-106',
    fechaIngreso: '2026-08-01',
    canal: 'GEJU',
    sistema: 'IOL Judicial Mendoza',
    caratula: 'MONTI JOSE CARLOS POR MEDIDA CONEXA (TRASLADO) - INTERNACION INVOLUNTARIA',
    tipoCausa: 'INTERNACION_INVOLUNTARIA',
    enteHospital: 'HOSPITAL EL CARMEN',
    estadoCausa: 'EN_TRAMITE',
    notificacionStatus: 'NOTIFICADO'
  }
];

export const INITIAL_TAREAS: TareaDiaria[] = [
  {
    id: 'tar-1',
    fecha: '2026-08-06',
    caratulaPersona: 'BAJBUJ',
    responsableNombre: 'Laura Alvarado',
    accion: 'ASUME',
    estado: 'EN_PROCESO',
    notas: 'Tomar razón e informar al juzgado.'
  },
  {
    id: 'tar-2',
    fecha: '2026-08-06',
    caratulaPersona: 'ZAPATA NATALIA',
    responsableNombre: 'Laura Alvarado',
    accion: 'CONTESTA VISTA',
    estado: 'PENDIENTE',
    notas: 'Vence vista de 3 días.'
  },
  {
    id: 'tar-3',
    fecha: '2026-08-06',
    caratulaPersona: 'REVISION LISTADO DIVORCIO',
    responsableNombre: 'Laura Alvarado',
    accion: 'ACTA CON ANTECEDENTES',
    estado: 'COMPLETADA'
  },
  {
    id: 'tar-4',
    fecha: '2026-08-05',
    caratulaPersona: 'DIV BILATERAL PAREJAS',
    responsableNombre: 'Laura Alvarado',
    accion: 'ASUME',
    estado: 'COMPLETADA'
  },
  {
    id: 'tar-5',
    fecha: '2026-08-05',
    caratulaPersona: 'CARATTI',
    responsableNombre: 'Laura Alvarado',
    accion: 'PEDIR INF SUMARIA ESCRITO HECHO',
    estado: 'EN_PROCESO'
  },
  {
    id: 'tar-6',
    fecha: '2026-08-04',
    caratulaPersona: 'ESTADISTICAS 4TO TRIMESTRE',
    responsableNombre: 'Laura Alvarado',
    accion: 'ESTADISTICAS',
    estado: 'COMPLETADA',
    notas: 'Estadísticas confeccionadas para enviar al MPD Central.'
  },
  {
    id: 'tar-7',
    fecha: '2026-08-04',
    caratulaPersona: 'MARTINEZ ROQUE C/ BODEGAS',
    responsableNombre: 'Laura Alvarado',
    accion: 'PRESCRIPCION ADQUISITIVA',
    estado: 'EN_PROCESO',
    notas: 'Asume patrocinio usucapión.'
  },
  {
    id: 'tar-8',
    fecha: '2026-08-03',
    caratulaPersona: 'RECLAMO ALCAYA',
    responsableNombre: 'Alejandra Di Menza',
    accion: 'SISTEMA TICKETS INGRESO RECLAMO',
    estado: 'PENDIENTE',
    notas: 'Ingresar reclamo administrativo en plataforma digital.'
  },
  {
    id: 'tar-9',
    fecha: '2026-08-02',
    caratulaPersona: 'LUEGO BEATRIZ',
    responsableNombre: 'Alejandra Di Menza',
    accion: 'AMPARO',
    estado: 'EN_PROCESO',
    notas: 'Interponer amparo de salud urgente.'
  }
];

export const INITIAL_CONVENIOS: Convenio[] = [
  {
    id: 'cnv-1',
    fecha: '2026-08-01',
    estado: 'NO INICIADO',
    expteCaratula: 'SRA. ROQUER GLADYS NANCY P/ GESTION OSEP',
    resultado: 'EN TRÁMITE',
    observaciones: 'Gestión con OSEP por provisión de medicamento biológico prioritario.',
    tipoConvenio: 'GESTION OSEP MEDICAMENTO'
  },
  {
    id: 'cnv-2',
    fecha: '2026-07-28',
    estado: 'INICIADO',
    expteCaratula: 'EXPTE 109680 - CONVENIO DIVISION DE BIENES',
    resultado: 'ACEPTADO',
    observaciones: 'Acuerdo privado homologado. Liquidación de sociedad conyugal efectuada.',
    tipoConvenio: 'CONVENIO DIVISION BIENES'
  },
  {
    id: 'cnv-3',
    fecha: '2026-07-25',
    estado: 'NO INICIADO',
    expteCaratula: 'GAJARDO FABIAN ANDRES',
    resultado: 'ACEPTADO',
    observaciones: 'Gestión ante OSEP autorizada por medicamentos especiales.',
    tipoConvenio: 'GESTION OSEP MEDICAMENTO'
  },
  {
    id: 'cnv-4',
    fecha: '2026-07-20',
    estado: 'NO INICIADO',
    expteCaratula: 'LLANDETE CRISTINA',
    resultado: 'EN TRÁMITE',
    observaciones: 'Gestión ante OSEP por implante coclear en auditoría médica.',
    tipoConvenio: 'GESTION OSEP IMPLANTE/AUDIFONO'
  },
  {
    id: 'cnv-5',
    fecha: '2026-07-15',
    estado: 'INICIADO',
    expteCaratula: '208135 CORONADO SUCESION',
    resultado: 'EN TRÁMITE',
    observaciones: 'Gestión con Procurador Navarro (patrocinante demás herederos) para convenio de división.',
    tipoConvenio: 'CONVENIO DIVISION BIENES'
  },
  {
    id: 'cnv-6',
    fecha: '2026-07-10',
    estado: 'NO INICIADO',
    expteCaratula: 'PEREZ GIMENEZ',
    resultado: 'EN TRÁMITE',
    observaciones: 'Gestión por levantamiento de inhibición con Estudio Gambi y Juzgado Tributario.',
    tipoConvenio: 'LEVANTE INHIBICION'
  },
  {
    id: 'cnv-7',
    fecha: '2026-07-05',
    estado: 'INICIADO',
    expteCaratula: 'ROSALES NUÑEZ',
    resultado: 'ACEPTADO',
    observaciones: 'Acuerdo de liquidación de bienes para finalizar proceso judicial.',
    tipoConvenio: 'CONVENIO DIVISION BIENES'
  },
  {
    id: 'cnv-8',
    fecha: '2026-06-25',
    estado: 'INICIADO',
    expteCaratula: 'DIAZ ELIAS P/ ACCIDENTE DE TRANSITO',
    resultado: 'ACEPTADO',
    observaciones: 'Acuerdo de pago por indemnización de accidente para cerrar causa.',
    tipoConvenio: 'ACUERDO DE PAGO'
  }
];

export const INITIAL_ATENCION: AtencionPublico[] = [
  {
    id: 'atn-1',
    fecha: '2026-08-06',
    personaNombre: 'Gómez, María Elena',
    telefonoWsp: '+54 9 260 458-9921',
    motivoConsulta: 'Consulta por régimen de comunicación y cuota alimentaria voluntaria.',
    medioContacto: 'WHATSAPP',
    atendidoPor: 'Mesa de Entrada',
    estado: 'EN_SEGUIMIENTO',
    notas: 'Solicitado envío de bonos de sueldo.'
  },
  {
    id: 'atn-2',
    fecha: '2026-08-06',
    personaNombre: 'Pérez, Juan Carlos',
    telefonoWsp: '+54 9 260 412-3344',
    motivoConsulta: 'Seguimiento de trámite de usucapión contra herederos.',
    medioContacto: 'PRESENCIAL',
    atendidoPor: 'Dr. Alvarado',
    estado: 'RESUELTO',
    notas: 'Informado N° de expte e ingreso de vista.'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'nt-1',
    title: '⚠️ Vencimiento de Plazo URGENTE Hoy',
    message: 'HOSPITAL SCHESTAKOW P/ CORDOVA SEBASTIAN vence hoy 06/08.',
    timestamp: 'Hace 10 min',
    level: 'CRITICAL' as const,
    read: false,
    linkTab: 'plazos'
  },
  {
    id: 'nt-2',
    title: '🏥 Nueva Causa Ley Salud Mental (26.657)',
    message: 'Ingresó cause de Internación Involuntaria Hosp. Schestakow vía GEJU.',
    timestamp: 'Hace 35 min',
    level: 'WARNING' as const,
    read: false,
    linkTab: 'causas'
  },
  {
    id: 'nt-3',
    title: '📝 Convenio Homologado',
    message: 'EXPTE 109680 Coronado División de Bienes marcado como ACEPTADO.',
    timestamp: 'Hace 2 horas',
    level: 'INFO' as const,
    read: true,
    linkTab: 'convenios'
  }
];
