export type MedioContacto = 'WHATSAPP' | 'TELEFONO' | 'PRESENCIAL';
export type EstadoAtencion = 'RESUELTO' | 'EN_SEGUIMIENTO' | 'DERIVADO';

export interface AtencionPublicoProps {
  id?: string;
  fecha: string;
  personaNombre: string;
  telefonoWsp: string;
  motivoConsulta: string;
  medioContacto: MedioContacto;
  atendidoPor: string;
  estado: EstadoAtencion;
  notas?: string;
}

export class AtencionPublico {
  public readonly id?: string;
  public fecha: string;
  public personaNombre: string;
  public telefonoWsp: string;
  public motivoConsulta: string;
  public medioContacto: MedioContacto;
  public atendidoPor: string;
  public estado: EstadoAtencion;
  public notas?: string;

  constructor(props: AtencionPublicoProps) {
    this.id = props.id;
    this.fecha = props.fecha;
    this.personaNombre = props.personaNombre;
    this.telefonoWsp = props.telefonoWsp;
    this.motivoConsulta = props.motivoConsulta;
    this.medioContacto = props.medioContacto;
    this.atendidoPor = props.atendidoPor;
    this.estado = props.estado;
    this.notas = props.notas;
  }
}
