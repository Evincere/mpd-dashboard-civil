// Repositories (Adapters)
import { PrismaPlazoRepository } from '../infrastructure/persistence/repositories/PrismaPlazoRepository.js';
import { PrismaCausaRepository } from '../infrastructure/persistence/repositories/PrismaCausaRepository.js';
import { PrismaTareaRepository } from '../infrastructure/persistence/repositories/PrismaTareaRepository.js';
import { PrismaConvenioRepository } from '../infrastructure/persistence/repositories/PrismaConvenioRepository.js';
import { PrismaAtencionRepository } from '../infrastructure/persistence/repositories/PrismaAtencionRepository.js';

// Use Cases
import { GetPlazosUseCase, CreatePlazoUseCase, TogglePlazoCompleteUseCase } from '../application/use-cases/PlazoUseCases.js';
import { GetCausasUseCase, CreateCausaUseCase } from '../application/use-cases/CausaUseCases.js';
import { GetTareasUseCase, CreateTareaUseCase, UpdateTareaStatusUseCase } from '../application/use-cases/TareaUseCases.js';
import { GetConveniosUseCase, CreateConvenioUseCase, UpdateConvenioResultadoUseCase } from '../application/use-cases/ConvenioUseCases.js';
import { GetAtencionesUseCase, CreateAtencionUseCase } from '../application/use-cases/AtencionUseCases.js';

// Composition Root Container
export class Container {
  // Repositories
  public readonly plazoRepository = new PrismaPlazoRepository();
  public readonly causaRepository = new PrismaCausaRepository();
  public readonly tareaRepository = new PrismaTareaRepository();
  public readonly convenioRepository = new PrismaConvenioRepository();
  public readonly atencionRepository = new PrismaAtencionRepository();

  // Use Cases - Plazos
  public readonly getPlazosUseCase = new GetPlazosUseCase(this.plazoRepository);
  public readonly createPlazoUseCase = new CreatePlazoUseCase(this.plazoRepository);
  public readonly togglePlazoCompleteUseCase = new TogglePlazoCompleteUseCase(this.plazoRepository);

  // Use Cases - Causas
  public readonly getCausasUseCase = new GetCausasUseCase(this.causaRepository);
  public readonly createCausaUseCase = new CreateCausaUseCase(this.causaRepository);

  // Use Cases - Tareas
  public readonly getTareasUseCase = new GetTareasUseCase(this.tareaRepository);
  public readonly createTareaUseCase = new CreateTareaUseCase(this.tareaRepository);
  public readonly updateTareaStatusUseCase = new UpdateTareaStatusUseCase(this.tareaRepository);

  // Use Cases - Convenios
  public readonly getConveniosUseCase = new GetConveniosUseCase(this.convenioRepository);
  public readonly createConvenioUseCase = new CreateConvenioUseCase(this.convenioRepository);
  public readonly updateConvenioResultadoUseCase = new UpdateConvenioResultadoUseCase(this.convenioRepository);

  // Use Cases - Atencion
  public readonly getAtencionesUseCase = new GetAtencionesUseCase(this.atencionRepository);
  public readonly createAtencionUseCase = new CreateAtencionUseCase(this.atencionRepository);
}

export const container = new Container();
