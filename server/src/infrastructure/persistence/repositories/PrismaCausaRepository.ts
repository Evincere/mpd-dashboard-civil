import { CausaIngreso, CanalIngreso, TipoCausa, EnteHospital, EstadoCausa } from '../../../domain/entities/CausaIngreso.js';
import { CausaRepositoryPort } from '../../../domain/ports/repositories/CausaRepositoryPort.js';
import { prisma } from '../prisma/client.js';

export class PrismaCausaRepository implements CausaRepositoryPort {
  async findAll(): Promise<CausaIngreso[]> {
    try {
      const raw = await prisma.causaIngreso.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return raw.map((c: any) => new CausaIngreso({
        ...c,
        canal: c.canal as CanalIngreso,
        tipoCausa: c.tipoCausa as TipoCausa,
        enteHospital: (c.enteHospital as EnteHospital) ?? undefined,
        estadoCausa: c.estadoCausa as EstadoCausa,
        notificacionStatus: c.notificacionStatus as any,
        expedienteNro: c.expedienteNro ?? undefined,
        observaciones: c.observaciones ?? undefined
      }));
    } catch (error) {
      console.warn('⚠️ Could not fetch causas from DB:', error);
      return [];
    }
  }

  async findById(id: string): Promise<CausaIngreso | null> {
    const c = await prisma.causaIngreso.findUnique({ where: { id } });
    if (!c) return null;
    return new CausaIngreso({
      ...c,
      canal: c.canal as CanalIngreso,
      tipoCausa: c.tipoCausa as TipoCausa,
      enteHospital: (c.enteHospital as EnteHospital) ?? undefined,
      estadoCausa: c.estadoCausa as EstadoCausa,
      notificacionStatus: c.notificacionStatus as any,
      expedienteNro: c.expedienteNro ?? undefined,
      observaciones: c.observaciones ?? undefined
    });
  }

  async save(causa: CausaIngreso): Promise<CausaIngreso> {
    const created = await prisma.causaIngreso.create({
      data: {
        fechaIngreso: causa.fechaIngreso,
        canal: causa.canal,
        sistema: causa.sistema,
        caratula: causa.caratula,
        tipoCausa: causa.tipoCausa,
        enteHospital: causa.enteHospital,
        estadoCausa: causa.estadoCausa,
        notificacionStatus: causa.notificacionStatus,
        expedienteNro: causa.expedienteNro,
        observaciones: causa.observaciones
      }
    });

    return new CausaIngreso({
      ...created,
      canal: created.canal as CanalIngreso,
      tipoCausa: created.tipoCausa as TipoCausa,
      enteHospital: (created.enteHospital as EnteHospital) ?? undefined,
      estadoCausa: created.estadoCausa as EstadoCausa,
      notificacionStatus: created.notificacionStatus as any,
      expedienteNro: created.expedienteNro ?? undefined,
      observaciones: created.observaciones ?? undefined
    });
  }

  async update(id: string, data: Partial<CausaIngreso>): Promise<CausaIngreso> {
    const updated = await prisma.causaIngreso.update({
      where: { id },
      data: {
        ...(data.fechaIngreso && { fechaIngreso: data.fechaIngreso }),
        ...(data.canal && { canal: data.canal }),
        ...(data.sistema && { sistema: data.sistema }),
        ...(data.caratula && { caratula: data.caratula }),
        ...(data.tipoCausa && { tipoCausa: data.tipoCausa }),
        ...(data.enteHospital !== undefined && { enteHospital: data.enteHospital }),
        ...(data.estadoCausa && { estadoCausa: data.estadoCausa }),
        ...(data.notificacionStatus && { notificacionStatus: data.notificacionStatus }),
        ...(data.expedienteNro !== undefined && { expedienteNro: data.expedienteNro }),
        ...(data.observaciones !== undefined && { observaciones: data.observaciones })
      }
    });

    return new CausaIngreso({
      ...updated,
      canal: updated.canal as CanalIngreso,
      tipoCausa: updated.tipoCausa as TipoCausa,
      enteHospital: (updated.enteHospital as EnteHospital) ?? undefined,
      estadoCausa: updated.estadoCausa as EstadoCausa,
      notificacionStatus: updated.notificacionStatus as any,
      expedienteNro: updated.expedienteNro ?? undefined,
      observaciones: updated.observaciones ?? undefined
    });
  }
}
