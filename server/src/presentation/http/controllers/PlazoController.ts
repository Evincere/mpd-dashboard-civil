import { Request, Response, NextFunction } from 'express';
import { container } from '../../container.js';

export class PlazoController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plazos = await container.getPlazosUseCase.execute();
      res.json(plazos);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await container.createPlazoUseCase.execute(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async toggleComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const updated = await container.togglePlazoCompleteUseCase.execute(id);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}
