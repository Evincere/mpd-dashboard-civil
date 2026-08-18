import { CausaIngreso } from '../../entities/CausaIngreso.js';

export interface CausaRepositoryPort {
  findAll(): Promise<CausaIngreso[]>;
  findById(id: string): Promise<CausaIngreso | null>;
  save(causa: CausaIngreso): Promise<CausaIngreso>;
  update(id: string, causa: Partial<CausaIngreso>): Promise<CausaIngreso>;
}
