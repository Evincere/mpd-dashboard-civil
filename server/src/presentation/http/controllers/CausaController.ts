import { Request, Response, NextFunction } from 'express';
import { container } from '../../container.js';

export class CausaController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const causas = await container.getCausasUseCase.execute();
      res.json(causas);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await container.createCausaUseCase.execute(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }
}
