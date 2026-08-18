export type PrioridadPlazo = 'URG' | 'S_P' | 'VENC' | 'NORMAL';
export type EstadoPlazo = 'PENDIENTE' | 'CUMPLIDO' | 'VENCIDO';

export interface PlazoProps {
  id?: string;
  fechaVencimiento: string;
  caratula: string;
  prioridad: PrioridadPlazo;
  asignadoInitials: string;
  asignadoNombre?: string;
  estado: EstadoPlazo;
  expedienteNro?: string;
  observaciones?: string;
}

export class Plazo {
  public readonly id?: string;
  public fechaVencimiento: string;
  public caratula: string;
  public prioridad: PrioridadPlazo;
  public asignadoInitials: string;
  public asignadoNombre?: string;
  public estado: EstadoPlazo;
  public expedienteNro?: string;
  public observaciones?: string;

  constructor(props: PlazoProps) {
    this.id = props.id;
    this.fechaVencimiento = props.fechaVencimiento;
    this.caratula = props.caratula;
    this.prioridad = props.prioridad;
    this.asignadoInitials = props.asignadoInitials;
    this.asignadoNombre = props.asignadoNombre;
    this.estado = props.estado;
    this.expedienteNro = props.expedienteNro;
    this.observaciones = props.observaciones;
  }

  public toggleComplete(): void {
    this.estado = this.estado === 'CUMPLIDO' ? 'PENDIENTE' : 'CUMPLIDO';
  }
}
