import { TareaDiaria, EstadoTarea } from '../../../domain/entities/TareaDiaria.js';
import { TareaRepositoryPort } from '../../../domain/ports/repositories/TareaRepositoryPort.js';
import { prisma } from '../prisma/client.js';

export class PrismaTareaRepository implements TareaRepositoryPort {
  async findAll(): Promise<TareaDiaria[]> {
    try {
      const raw = await prisma.tareaDiaria.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return raw.map((t: any) => new TareaDiaria({
        ...t,
        estado: t.estado as EstadoTarea,
        notas: t.notas ?? undefined
      }));
    } catch (error) {
      console.warn('⚠️ Could not fetch tareas from DB:', error);
      return [];
    }
  }

  async findById(id: string): Promise<TareaDiaria | null> {
    const t = await prisma.tareaDiaria.findUnique({ where: { id } });
    if (!t) return null;
    return new TareaDiaria({
      ...t,
      estado: t.estado as EstadoTarea,
      notas: t.notas ?? undefined
    });
  }

  async save(tarea: TareaDiaria): Promise<TareaDiaria> {
    const created = await prisma.tareaDiaria.create({
      data: {
        fecha: tarea.fecha,
        caratulaPersona: tarea.caratulaPersona,
        responsableNombre: tarea.responsableNombre,
        accion: tarea.accion,
        estado: tarea.estado,
        notas: tarea.notas
      }
    });

    return new TareaDiaria({
      ...created,
      estado: created.estado as EstadoTarea,
      notas: created.notas ?? undefined
    });
  }

  async update(id: string, data: Partial<TareaDiaria>): Promise<TareaDiaria> {
    const updated = await prisma.tareaDiaria.update({
      where: { id },
      data: {
        ...(data.fecha && { fecha: data.fecha }),
        ...(data.caratulaPersona && { caratulaPersona: data.caratulaPersona }),
        ...(data.responsableNombre && { responsableNombre: data.responsableNombre }),
        ...(data.accion && { accion: data.accion }),
        ...(data.estado && { estado: data.estado }),
        ...(data.notas !== undefined && { notas: data.notas })
      }
    });

    return new TareaDiaria({
      ...updated,
      estado: updated.estado as EstadoTarea,
      notas: updated.notas ?? undefined
    });
  }
}
