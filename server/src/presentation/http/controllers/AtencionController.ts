import { Request, Response, NextFunction } from 'express';
import { container } from '../../container.js';

export class AtencionController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const atenciones = await container.getAtencionesUseCase.execute();
      res.json(atenciones);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await container.createAtencionUseCase.execute(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }
}
