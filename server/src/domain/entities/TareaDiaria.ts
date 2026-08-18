export type EstadoTarea = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA';

export interface TareaDiariaProps {
  id?: string;
  fecha: string;
  caratulaPersona: string;
  responsableNombre: string;
  accion: string;
  estado: EstadoTarea;
  notas?: string;
}

export class TareaDiaria {
  public readonly id?: string;
  public fecha: string;
  public caratulaPersona: string;
  public responsableNombre: string;
  public accion: string;
  public estado: EstadoTarea;
  public notas?: string;

  constructor(props: TareaDiariaProps) {
    this.id = props.id;
    this.fecha = props.fecha;
    this.caratulaPersona = props.caratulaPersona;
    this.responsableNombre = props.responsableNombre;
    this.accion = props.accion;
    this.estado = props.estado;
    this.notas = props.notas;
  }
}
