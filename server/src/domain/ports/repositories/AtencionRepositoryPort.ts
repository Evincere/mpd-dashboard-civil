import { AtencionPublico } from '../../entities/AtencionPublico.js';

export interface AtencionRepositoryPort {
  findAll(): Promise<AtencionPublico[]>;
  findById(id: string): Promise<AtencionPublico | null>;
  save(atencion: AtencionPublico): Promise<AtencionPublico>;
}
