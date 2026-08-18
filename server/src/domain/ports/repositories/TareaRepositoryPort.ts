import { TareaDiaria } from '../../entities/TareaDiaria.js';

export interface TareaRepositoryPort {
  findAll(): Promise<TareaDiaria[]>;
  findById(id: string): Promise<TareaDiaria | null>;
  save(tarea: TareaDiaria): Promise<TareaDiaria>;
  update(id: string, tarea: Partial<TareaDiaria>): Promise<TareaDiaria>;
}
