import { Request, Response, NextFunction } from 'express';
import { container } from '../../container.js';

export class TareaController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tareas = await container.getTareasUseCase.execute();
      res.json(tareas);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await container.createTareaUseCase.execute(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const { estado } = req.body;
      const updated = await container.updateTareaStatusUseCase.execute(id, estado);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}
