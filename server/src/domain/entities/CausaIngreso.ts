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

export interface CausaIngresoProps {
  id?: string;
  fechaIngreso: string;
  canal: CanalIngreso;
  sistema: string;
  caratula: string;
  tipoCausa: TipoCausa;
  enteHospital?: EnteHospital;
  estadoCausa: EstadoCausa;
  notificacionStatus: 'NOTIFICADO' | 'SIN_NOTIFICAR' | 'PENDIENTE_ENVIO';
  expedienteNro?: string;
  observaciones?: string;
}

export class CausaIngreso {
  public readonly id?: string;
  public fechaIngreso: string;
  public canal: CanalIngreso;
  public sistema: string;
  public caratula: string;
  public tipoCausa: TipoCausa;
  public enteHospital?: EnteHospital;
  public estadoCausa: EstadoCausa;
  public notificacionStatus: 'NOTIFICADO' | 'SIN_NOTIFICAR' | 'PENDIENTE_ENVIO';
  public expedienteNro?: string;
  public observaciones?: string;

  constructor(props: CausaIngresoProps) {
    this.id = props.id;
    this.fechaIngreso = props.fechaIngreso;
    this.canal = props.canal;
    this.sistema = props.sistema;
    this.caratula = props.caratula;
    this.tipoCausa = props.tipoCausa;
    this.enteHospital = props.enteHospital;
    this.estadoCausa = props.estadoCausa;
    this.notificacionStatus = props.notificacionStatus;
    this.expedienteNro = props.expedienteNro;
    this.observaciones = props.observaciones;
  }
}
