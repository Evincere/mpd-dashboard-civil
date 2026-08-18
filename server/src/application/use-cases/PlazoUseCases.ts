import { Plazo, PlazoProps } from '../../domain/entities/Plazo.js';
import { PlazoRepositoryPort } from '../../domain/ports/repositories/PlazoRepositoryPort.js';

export class GetPlazosUseCase {
  constructor(private readonly plazoRepository: PlazoRepositoryPort) {}

  async execute(): Promise<Plazo[]> {
    return this.plazoRepository.findAll();
  }
}

export class CreatePlazoUseCase {
  constructor(private readonly plazoRepository: PlazoRepositoryPort) {}

  async execute(dto: PlazoProps): Promise<Plazo> {
    const plazo = new Plazo(dto);
    return this.plazoRepository.save(plazo);
  }
}

export class TogglePlazoCompleteUseCase {
  constructor(private readonly plazoRepository: PlazoRepositoryPort) {}

  async execute(id: string): Promise<Plazo> {
    const plazoData = await this.plazoRepository.findById(id);
    if (!plazoData) {
      throw new Error(`Plazo with id ${id} not found`);
    }

    const plazo = new Plazo(plazoData);
    plazo.toggleComplete();

    return this.plazoRepository.update(id, { estado: plazo.estado });
  }
}
