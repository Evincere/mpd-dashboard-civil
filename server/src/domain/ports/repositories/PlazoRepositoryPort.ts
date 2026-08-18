import { Plazo } from '../../entities/Plazo.js';

export interface PlazoRepositoryPort {
  findAll(): Promise<Plazo[]>;
  findById(id: string): Promise<Plazo | null>;
  save(plazo: Plazo): Promise<Plazo>;
  update(id: string, plazo: Partial<Plazo>): Promise<Plazo>;
  delete(id: string): Promise<void>;
}
