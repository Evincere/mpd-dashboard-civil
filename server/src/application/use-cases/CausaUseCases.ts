import { CausaIngreso, CausaIngresoProps } from '../../domain/entities/CausaIngreso.js';
import { CausaRepositoryPort } from '../../domain/ports/repositories/CausaRepositoryPort.js';

export class GetCausasUseCase {
  constructor(private readonly causaRepository: CausaRepositoryPort) {}

  async execute(): Promise<CausaIngreso[]> {
    return this.causaRepository.findAll();
  }
}

export class CreateCausaUseCase {
  constructor(private readonly causaRepository: CausaRepositoryPort) {}

  async execute(dto: CausaIngresoProps): Promise<CausaIngreso> {
    const causa = new CausaIngreso(dto);
    return this.causaRepository.save(causa);
  }
}
