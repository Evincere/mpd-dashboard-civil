import { AtencionPublico, MedioContacto, EstadoAtencion } from '../../../domain/entities/AtencionPublico.js';
import { AtencionRepositoryPort } from '../../../domain/ports/repositories/AtencionRepositoryPort.js';
import { prisma } from '../prisma/client.js';

export class PrismaAtencionRepository implements AtencionRepositoryPort {
  async findAll(): Promise<AtencionPublico[]> {
    try {
      const raw = await prisma.atencionPublico.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return raw.map((a: any) => new AtencionPublico({
        ...a,
        medioContacto: a.medioContacto as MedioContacto,
        estado: a.estado as EstadoAtencion,
        notas: a.notas ?? undefined
      }));
    } catch (error) {
      console.warn('⚠️ Could not fetch atencion records from DB:', error);
      return [];
    }
  }

  async findById(id: string): Promise<AtencionPublico | null> {
    const a = await prisma.atencionPublico.findUnique({ where: { id } });
    if (!a) return null;
    return new AtencionPublico({
      ...a,
      medioContacto: a.medioContacto as MedioContacto,
      estado: a.estado as EstadoAtencion,
      notas: a.notas ?? undefined
    });
  }

  async save(atencion: AtencionPublico): Promise<AtencionPublico> {
    const created = await prisma.atencionPublico.create({
      data: {
        fecha: atencion.fecha,
        personaNombre: atencion.personaNombre,
        telefonoWsp: atencion.telefonoWsp,
        motivoConsulta: atencion.motivoConsulta,
        medioContacto: atencion.medioContacto,
        atendidoPor: atencion.atendidoPor,
        estado: atencion.estado,
        notas: atencion.notas
      }
    });

    return new AtencionPublico({
      ...created,
      medioContacto: created.medioContacto as MedioContacto,
      estado: created.estado as EstadoAtencion,
      notas: created.notas ?? undefined
    });
  }
}
