import { Convenio, EstadoConvenio, ResultadoConvenio } from '../../../domain/entities/Convenio.js';
import { ConvenioRepositoryPort } from '../../../domain/ports/repositories/ConvenioRepositoryPort.js';
import { prisma } from '../prisma/client.js';

export class PrismaConvenioRepository implements ConvenioRepositoryPort {
  async findAll(): Promise<Convenio[]> {
    const raw = await prisma.convenio.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return raw.map((c: any) => new Convenio({
      ...c,
      estado: c.estado as EstadoConvenio,
      resultado: c.resultado as ResultadoConvenio
    }));
  }

  async findById(id: string): Promise<Convenio | null> {
    const c = await prisma.convenio.findUnique({ where: { id } });
    if (!c) return null;
    return new Convenio({
      ...c,
      estado: c.estado as EstadoConvenio,
      resultado: c.resultado as ResultadoConvenio
    });
  }

  async save(convenio: Convenio): Promise<Convenio> {
    const created = await prisma.convenio.create({
      data: {
        fecha: convenio.fecha,
        estado: convenio.estado,
        expteCaratula: convenio.expteCaratula,
        resultado: convenio.resultado,
        observaciones: convenio.observaciones,
        tipoConvenio: convenio.tipoConvenio
      }
    });

    return new Convenio({
      ...created,
      estado: created.estado as EstadoConvenio,
      resultado: created.resultado as ResultadoConvenio
    });
  }

  async update(id: string, data: Partial<Convenio>): Promise<Convenio> {
    const updated = await prisma.convenio.update({
      where: { id },
      data: {
        ...(data.fecha && { fecha: data.fecha }),
        ...(data.estado && { estado: data.estado }),
        ...(data.expteCaratula && { expteCaratula: data.expteCaratula }),
        ...(data.resultado && { resultado: data.resultado }),
        ...(data.observaciones && { observaciones: data.observaciones }),
        ...(data.tipoConvenio && { tipoConvenio: data.tipoConvenio })
      }
    });

    return new Convenio({
      ...updated,
      estado: updated.estado as EstadoConvenio,
      resultado: updated.resultado as ResultadoConvenio
    });
  }
}
