import { AtencionPublico, AtencionPublicoProps } from '../../domain/entities/AtencionPublico.js';
import { AtencionRepositoryPort } from '../../domain/ports/repositories/AtencionRepositoryPort.js';

export class GetAtencionesUseCase {
  constructor(private readonly atencionRepository: AtencionRepositoryPort) {}

  async execute(): Promise<AtencionPublico[]> {
    return this.atencionRepository.findAll();
  }
}

export class CreateAtencionUseCase {
  constructor(private readonly atencionRepository: AtencionRepositoryPort) {}

  async execute(dto: AtencionPublicoProps): Promise<AtencionPublico> {
    const atencion = new AtencionPublico(dto);
    return this.atencionRepository.save(atencion);
  }
}
