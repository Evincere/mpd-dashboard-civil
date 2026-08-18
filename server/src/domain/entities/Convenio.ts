export type EstadoConvenio = 'NO INICIADO' | 'INICIADO' | 'EN TRÁMITE' | 'ACEPTADO' | 'RECHAZADO';
export type ResultadoConvenio = 'EN TRÁMITE' | 'ACEPTADO' | 'RECHAZADO' | 'PENDIENTE';

export interface ConvenioProps {
  id?: string;
  fecha: string;
  estado: EstadoConvenio;
  expteCaratula: string;
  resultado: ResultadoConvenio;
  observaciones: string;
  tipoConvenio: string;
}

export class Convenio {
  public readonly id?: string;
  public fecha: string;
  public estado: EstadoConvenio;
  public expteCaratula: string;
  public resultado: ResultadoConvenio;
  public observaciones: string;
  public tipoConvenio: string;

  constructor(props: ConvenioProps) {
    this.id = props.id;
    this.fecha = props.fecha;
    this.estado = props.estado;
    this.expteCaratula = props.expteCaratula;
    this.resultado = props.resultado;
    this.observaciones = props.observaciones;
    this.tipoConvenio = props.tipoConvenio;
  }
}
