import { Plazo, PrioridadPlazo, EstadoPlazo } from '../../../domain/entities/Plazo.js';
import { PlazoRepositoryPort } from '../../../domain/ports/repositories/PlazoRepositoryPort.js';
import { prisma } from '../prisma/client.js';

export class PrismaPlazoRepository implements PlazoRepositoryPort {
  async findAll(): Promise<Plazo[]> {
    const rawPlazos = await prisma.plazo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return rawPlazos.map((p: any) => new Plazo({
      ...p,
      prioridad: p.prioridad as PrioridadPlazo,
      estado: p.estado as EstadoPlazo,
      asignadoNombre: p.asignadoNombre ?? undefined,
      expedienteNro: p.expedienteNro ?? undefined,
      observaciones: p.observaciones ?? undefined
    }));
  }

  async findById(id: string): Promise<Plazo | null> {
    const p = await prisma.plazo.findUnique({ where: { id } });
    if (!p) return null;
    return new Plazo({
      ...p,
      prioridad: p.prioridad as PrioridadPlazo,
      estado: p.estado as EstadoPlazo,
      asignadoNombre: p.asignadoNombre ?? undefined,
      expedienteNro: p.expedienteNro ?? undefined,
      observaciones: p.observaciones ?? undefined
    });
  }

  async save(plazo: Plazo): Promise<Plazo> {
    const created = await prisma.plazo.create({
      data: {
        fechaVencimiento: plazo.fechaVencimiento,
        caratula: plazo.caratula,
        prioridad: plazo.prioridad,
        asignadoInitials: plazo.asignadoInitials,
        asignadoNombre: plazo.asignadoNombre,
        estado: plazo.estado,
        expedienteNro: plazo.expedienteNro,
        observaciones: plazo.observaciones
      }
    });

    return new Plazo({
      ...created,
      prioridad: created.prioridad as PrioridadPlazo,
      estado: created.estado as EstadoPlazo,
      asignadoNombre: created.asignadoNombre ?? undefined,
      expedienteNro: created.expedienteNro ?? undefined,
      observaciones: created.observaciones ?? undefined
    });
  }

  async update(id: string, data: Partial<Plazo>): Promise<Plazo> {
    const updated = await prisma.plazo.update({
      where: { id },
      data: {
        ...(data.fechaVencimiento && { fechaVencimiento: data.fechaVencimiento }),
        ...(data.caratula && { caratula: data.caratula }),
        ...(data.prioridad && { prioridad: data.prioridad }),
        ...(data.asignadoInitials && { asignadoInitials: data.asignadoInitials }),
        ...(data.asignadoNombre !== undefined && { asignadoNombre: data.asignadoNombre }),
        ...(data.estado && { estado: data.estado }),
        ...(data.expedienteNro !== undefined && { expedienteNro: data.expedienteNro }),
        ...(data.observaciones !== undefined && { observaciones: data.observaciones })
      }
    });

    return new Plazo({
      ...updated,
      prioridad: updated.prioridad as PrioridadPlazo,
      estado: updated.estado as EstadoPlazo,
      asignadoNombre: updated.asignadoNombre ?? undefined,
      expedienteNro: updated.expedienteNro ?? undefined,
      observaciones: updated.observaciones ?? undefined
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.plazo.delete({ where: { id } });
  }
}
