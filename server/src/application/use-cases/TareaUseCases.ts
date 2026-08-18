import { TareaDiaria, TareaDiariaProps, EstadoTarea } from '../../domain/entities/TareaDiaria.js';
import { TareaRepositoryPort } from '../../domain/ports/repositories/TareaRepositoryPort.js';

export class GetTareasUseCase {
  constructor(private readonly tareaRepository: TareaRepositoryPort) {}

  async execute(): Promise<TareaDiaria[]> {
    return this.tareaRepository.findAll();
  }
}

export class CreateTareaUseCase {
  constructor(private readonly tareaRepository: TareaRepositoryPort) {}

  async execute(dto: TareaDiariaProps): Promise<TareaDiaria> {
    const tarea = new TareaDiaria(dto);
    return this.tareaRepository.save(tarea);
  }
}

export class UpdateTareaStatusUseCase {
  constructor(private readonly tareaRepository: TareaRepositoryPort) {}

  async execute(id: string, status: EstadoTarea): Promise<TareaDiaria> {
    return this.tareaRepository.update(id, { estado: status });
  }
}
