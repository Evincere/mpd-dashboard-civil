export type UserRole = 'Defensor/a' | 'Codefensor/a' | 'Secretario/a' | 'Prosecretario/a' | 'Empleado/a' | 'Administrador' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
}

export type PrioridadPlazo = 'URG' | 'S_P' | 'VENC' | 'NORMAL';
export type EstadoPlazo = 'PENDIENTE' | 'CUMPLIDO' | 'VENCIDO';

export interface Plazo {
  id: string;
  fechaVencimiento: string; // YYYY-MM-DD
  caratula: string;
  prioridad: PrioridadPlazo;
  asignadoInitials: string; // e.g. LA, JB, JP, AD
  asignadoNombre?: string;
  estado: EstadoPlazo;
  expedienteNro?: string;
  observaciones?: string;
}

export type CanalIngreso = 'GEJU' | 'IOL' | 'MAIL' | 'PRESENCIAL';
export type TipoCausa = 
  | 'INTERNACION_INVOLUNTARIA'
  | 'DETERMINACION_CAPACIDAD'
  | 'SUCESION'
  | 'DIVORCIO'
  | 'RECLAMO_MEDICAMENTOS'
  | 'MEDIDA_CONEXA'
  | 'OTROS';

export type EstadoCausa = 'NUEVA' | 'EN_TRAMITE' | 'FINALIZADA';
export type EnteHospital = 
  | 'HOSPITAL SCHESTAKOW'
  | 'HOSPITAL REGIONAL MALARGÜE'
  | 'HOSPITAL EL CARMEN'
  | 'HOSPITAL CARRASCO CASTRO'
  | 'NINGUNO / OTRO';

export interface CausaIngreso {
  id: string;
  fechaIngreso: string;
  canal: CanalIngreso;
  sistema: string; // e.g., IOL, GEJU
  caratula: string;
  tipoCausa: TipoCausa;
  enteHospital?: EnteHospital;
  estadoCausa: EstadoCausa;
  notificacionStatus: 'NOTIFICADO' | 'SIN_NOTIFICAR' | 'PENDIENTE_ENVIO';
  expedienteNro?: string;
  observaciones?: string;
}

export type AccionTarea = 
  | 'ASUME'
  | 'CONTESTA VISTA'
  | 'PEDIR INF SUMARIA ESCRITO HECHO'
  | 'OF HECHO'
  | 'ESTADISTICAS'
  | 'REC DE RECONSIDERACION'
  | 'INFORMAR TURNO DE INSP OCULAR'
  | 'AMPARO'
  | 'PRESCRIPCION ADQUISITIVA'
  | 'ESCRITO ACOMPAÑA OFICIO APERTURA'
  | 'SISTEMA TICKETS INGRESO RECLAMO'
  | 'ACTA CON ANTECEDENTES';

export type EstadoTarea = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA';

export interface TareaDiaria {
  id: string;
  fecha: string;
  caratulaPersona: string;
  responsableNombre: string; // e.g. ALVARADO, DI MENZA
  accion: AccionTarea | string;
  estado: EstadoTarea;
  notas?: string;
}

export type EstadoConvenio = 'NO INICIADO' | 'INICIADO' | 'EN TRÁMITE' | 'ACEPTADO' | 'RECHAZADO';
export type TipoConvenio = 
  | 'GESTION OSEP MEDICAMENTO'
  | 'GESTION OSEP IMPLANTE/AUDIFONO'
  | 'CONVENIO DIVISION BIENES'
  | 'ACUERDO DE PAGO'
  | 'LEVANTE INHIBICION'
  | 'INMOBILIARIA / ALQUILERES'
  | 'UNION CONVIVENCIAL'
  | 'OTRO';

export interface Convenio {
  id: string;
  fecha: string;
  estado: EstadoConvenio;
  expteCaratula: string;
  resultado: 'EN TRÁMITE' | 'ACEPTADO' | 'RECHAZADO' | 'PENDIENTE';
  observaciones: string;
  tipoConvenio: TipoConvenio;
}

export interface AtencionPublico {
  id: string;
  fecha: string;
  personaNombre: string;
  telefonoWsp: string;
  motivoConsulta: string;
  medioContacto: 'WHATSAPP' | 'TELEFONO' | 'PRESENCIAL';
  atendidoPor: string;
  estado: 'RESUELTO' | 'EN_SEGUIMIENTO' | 'DERIVADO';
  notas?: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  read: boolean;
  linkTab?: string;
}
