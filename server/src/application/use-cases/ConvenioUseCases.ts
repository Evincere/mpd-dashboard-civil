import { Convenio, ConvenioProps, ResultadoConvenio } from '../../domain/entities/Convenio.js';
import { ConvenioRepositoryPort } from '../../domain/ports/repositories/ConvenioRepositoryPort.js';

export class GetConveniosUseCase {
  constructor(private readonly convenioRepository: ConvenioRepositoryPort) {}

  async execute(): Promise<Convenio[]> {
    return this.convenioRepository.findAll();
  }
}

export class CreateConvenioUseCase {
  constructor(private readonly convenioRepository: ConvenioRepositoryPort) {}

  async execute(dto: ConvenioProps): Promise<Convenio> {
    const convenio = new Convenio(dto);
    return this.convenioRepository.save(convenio);
  }
}

export class UpdateConvenioResultadoUseCase {
  constructor(private readonly convenioRepository: ConvenioRepositoryPort) {}

  async execute(id: string, resultado: ResultadoConvenio): Promise<Convenio> {
    const nuevoEstado = resultado === 'ACEPTADO' ? 'INICIADO' : 'NO INICIADO';
    return this.convenioRepository.update(id, { resultado, estado: nuevoEstado });
  }
}
