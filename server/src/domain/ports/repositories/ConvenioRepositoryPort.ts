import { Convenio } from '../../entities/Convenio.js';

export interface ConvenioRepositoryPort {
  findAll(): Promise<Convenio[]>;
  findById(id: string): Promise<Convenio | null>;
  save(convenio: Convenio): Promise<Convenio>;
  update(id: string, convenio: Partial<Convenio>): Promise<Convenio>;
}
