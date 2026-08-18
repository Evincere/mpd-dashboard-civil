import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.userProfile.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        initials: true,
        role: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, initials, role, email, password } = req.body;
    if (!name || !initials || !role || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.userProfile.create({
      data: {
        name,
        initials: initials.toLowerCase(),
        role,
        email,
        password: hashedPassword,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
      }
    });

    // Log action in AuditLog
    await prisma.auditLog.create({
      data: {
        userId: 'admin',
        userNombre: 'Administrador',
        accion: 'CREAR_USUARIO',
        entidad: 'UserProfile',
        entidadId: newUser.id,
        detalles: `Usuario ${newUser.name} (${newUser.initials}) creado con rol ${newUser.role}`
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, initials, role, email, password } = req.body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (initials) dataToUpdate.initials = initials.toLowerCase();
    if (role) dataToUpdate.role = role;
    if (email) dataToUpdate.email = email;
    if (password && password.trim() !== '') {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.userProfile.update({
      where: { id },
      data: dataToUpdate
    });

    await prisma.auditLog.create({
      data: {
        userId: 'admin',
        userNombre: 'Administrador',
        accion: 'MODIFICAR_USUARIO',
        entidad: 'UserProfile',
        entidadId: updatedUser.id,
        detalles: `Usuario ${updatedUser.name} (${updatedUser.initials}) actualizado`
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.userProfile.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        userId: 'admin',
        userNombre: 'Administrador',
        accion: 'ELIMINAR_USUARIO',
        entidad: 'UserProfile',
        entidadId: id,
        detalles: `Usuario ${deletedUser.name} (${deletedUser.initials}) eliminado de la plataforma`
      }
    });

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get audit logs
router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { fechaHora: 'desc' },
      take: 100
    });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Database & system statistics
router.get('/db-stats', async (req: Request, res: Response) => {
  try {
    const [usersCount, plazosCount, causasCount, tareasCount, conveniosCount, atencionCount, auditLogsCount] = await Promise.all([
      prisma.userProfile.count(),
      prisma.plazo.count(),
      prisma.causaIngreso.count(),
      prisma.tareaDiaria.count(),
      prisma.convenio.count(),
      prisma.atencionPublico.count(),
      prisma.auditLog.count(),
    ]);

    res.json({
      dbStatus: 'ONLINE (PostgreSQL Prisma)',
      counts: {
        users: usersCount,
        plazos: plazosCount,
        causas: causasCount,
        tareas: tareasCount,
        convenios: conveniosCount,
        atencion: atencionCount,
        auditLogs: auditLogsCount
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DB Action 1: Purge Audit Logs
router.post('/db/purge-audit', async (req: Request, res: Response) => {
  try {
    const deleted = await prisma.auditLog.deleteMany({});
    res.json({ message: `Se han purgado ${deleted.count} registros de auditoría.` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DB Action 2: Restore DB from JSON backup file payload
router.post('/db/restore', async (req: Request, res: Response) => {
  try {
    const backup = req.body;
    if (!backup || !backup.data) {
      return res.status(400).json({ error: 'Formato de archivo de respaldo no válido.' });
    }

    const { users, plazos, causas, tareas, convenios, atenciones, auditLogs } = backup.data;

    await prisma.$transaction(async (tx) => {
      // Restore Users if present
      if (Array.isArray(users)) {
        for (const u of users) {
          await tx.userProfile.upsert({
            where: { id: u.id },
            update: { name: u.name, initials: u.initials, role: u.role, email: u.email },
            create: {
              id: u.id,
              name: u.name,
              initials: u.initials,
              role: u.role,
              email: u.email,
              password: '$2b$10$wKqK0x41.H1Lw4Z4Z4Z4Z.123456default' // Keep or placeholder
            }
          });
        }
      }

      // Restore Plazos
      if (Array.isArray(plazos)) {
        for (const p of plazos) {
          const { createdAt, updatedAt, ...rest } = p;
          await tx.plazo.upsert({
            where: { id: p.id },
            update: rest,
            create: rest
          });
        }
      }

      // Restore Causas
      if (Array.isArray(causas)) {
        for (const c of causas) {
          const { createdAt, updatedAt, ...rest } = c;
          await tx.causaIngreso.upsert({
            where: { id: c.id },
            update: rest,
            create: rest
          });
        }
      }

      // Restore Tareas
      if (Array.isArray(tareas)) {
        for (const t of tareas) {
          const { createdAt, updatedAt, ...rest } = t;
          await tx.tareaDiaria.upsert({
            where: { id: t.id },
            update: rest,
            create: rest
          });
        }
      }

      // Restore Convenios
      if (Array.isArray(convenios)) {
        for (const cnv of convenios) {
          const { createdAt, updatedAt, ...rest } = cnv;
          await tx.convenio.upsert({
            where: { id: cnv.id },
            update: rest,
            create: rest
          });
        }
      }

      // Restore Atenciones
      if (Array.isArray(atenciones)) {
        for (const a of atenciones) {
          const { createdAt, updatedAt, ...rest } = a;
          await tx.atencionPublico.upsert({
            where: { id: a.id },
            update: rest,
            create: rest
          });
        }
      }

      // Restore Audit Logs
      if (Array.isArray(auditLogs)) {
        for (const log of auditLogs) {
          const { fechaHora, ...rest } = log;
          await tx.auditLog.upsert({
            where: { id: log.id },
            update: rest,
            create: rest
          });
        }
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: 'admin',
        userNombre: 'Administrador',
        accion: 'RESTAURAR_BASE_DATOS',
        entidad: 'Sistema',
        detalles: 'Base de datos restaurada exitosamente desde un archivo de respaldo JSON'
      }
    });

    res.json({ message: 'Restauración de base de datos completada exitosamente.' });
  } catch (error: any) {
    console.error('Error in DB restore:', error);
    res.status(500).json({ error: 'Error durante la restauración: ' + error.message });
  }
});

// DB Action 3: Export Full DB Backup as JSON
router.get('/db/export-backup', async (req: Request, res: Response) => {
  try {
    const [users, plazos, causas, tareas, convenios, atenciones, auditLogs] = await Promise.all([
      prisma.userProfile.findMany({ select: { id: true, name: true, initials: true, role: true, email: true, createdAt: true } }),
      prisma.plazo.findMany(),
      prisma.causaIngreso.findMany(),
      prisma.tareaDiaria.findMany(),
      prisma.convenio.findMany(),
      prisma.atencionPublico.findMany(),
      prisma.auditLog.findMany()
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      database: 'PostgreSQL - Defensoria Civil San Rafael',
      data: {
        users,
        plazos,
        causas,
        tareas,
        convenios,
        atenciones,
        auditLogs
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=backup_defensoria_${new Date().toISOString().split('T')[0]}.json`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
