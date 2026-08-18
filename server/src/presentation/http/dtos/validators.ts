import { z } from 'zod';

export const createPlazoSchema = z.object({
  fechaVencimiento: z.string().min(1, 'La fecha de vencimiento es requerida'),
  caratula: z.string().min(1, 'La carátula es requerida'),
  prioridad: z.enum(['URG', 'S_P', 'VENC', 'NORMAL']),
  asignadoInitials: z.string().min(1, 'Las iniciales son requeridas'),
  asignadoNombre: z.string().optional(),
  estado: z.enum(['PENDIENTE', 'CUMPLIDO', 'VENCIDO']).default('PENDIENTE'),
  expedienteNro: z.string().optional(),
  observaciones: z.string().optional()
});

export const createCausaSchema = z.object({
  fechaIngreso: z.string().min(1),
  canal: z.enum(['GEJU', 'IOL', 'MAIL', 'PRESENCIAL']),
  sistema: z.string().min(1),
  caratula: z.string().min(1),
  tipoCausa: z.enum([
    'INTERNACION_INVOLUNTARIA',
    'DETERMINACION_CAPACIDAD',
    'SUCESION',
    'DIVORCIO',
    'RECLAMO_MEDICAMENTOS',
    'MEDIDA_CONEXA',
    'OTROS'
  ]),
  enteHospital: z.enum([
    'HOSPITAL SCHESTAKOW',
    'HOSPITAL REGIONAL MALARGÜE',
    'HOSPITAL EL CARMEN',
    'HOSPITAL CARRASCO CASTRO',
    'NINGUNO / OTRO'
  ]).optional(),
  estadoCausa: z.enum(['NUEVA', 'EN_TRAMITE', 'FINALIZADA']).default('NUEVA'),
  notificacionStatus: z.enum(['NOTIFICADO', 'SIN_NOTIFICAR', 'PENDIENTE_ENVIO']),
  expedienteNro: z.string().optional(),
  observaciones: z.string().optional()
});

export const createTareaSchema = z.object({
  fecha: z.string().min(1),
  caratulaPersona: z.string().min(1),
  responsableNombre: z.string().min(1),
  accion: z.string().min(1),
  estado: z.enum(['PENDIENTE', 'EN_PROCESO', 'COMPLETADA']).default('PENDIENTE'),
  notas: z.string().optional()
});

export const updateTareaStatusSchema = z.object({
  estado: z.enum(['PENDIENTE', 'EN_PROCESO', 'COMPLETADA'])
});

export const createConvenioSchema = z.object({
  fecha: z.string().min(1),
  estado: z.enum(['NO INICIADO', 'INICIADO', 'EN TRÁMITE', 'ACEPTADO', 'RECHAZADO']),
  expteCaratula: z.string().min(1),
  resultado: z.enum(['EN TRÁMITE', 'ACEPTADO', 'RECHAZADO', 'PENDIENTE']),
  observaciones: z.string(),
  tipoConvenio: z.string().min(1)
});

export const updateConvenioResultadoSchema = z.object({
  resultado: z.enum(['EN TRÁMITE', 'ACEPTADO', 'RECHAZADO', 'PENDIENTE'])
});

export const createAtencionSchema = z.object({
  fecha: z.string().min(1),
  personaNombre: z.string().min(1),
  telefonoWsp: z.string().min(1),
  motivoConsulta: z.string().min(1),
  medioContacto: z.enum(['WHATSAPP', 'TELEFONO', 'PRESENCIAL']),
  atendidoPor: z.string().min(1),
  estado: z.enum(['RESUELTO', 'EN_SEGUIMIENTO', 'DERIVADO']),
  notas: z.string().optional()
});
