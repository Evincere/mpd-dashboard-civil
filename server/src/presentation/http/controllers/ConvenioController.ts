import { Request, Response, NextFunction } from 'express';
import { container } from '../../container.js';

export class ConvenioController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const convenios = await container.getConveniosUseCase.execute();
      res.json(convenios);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await container.createConvenioUseCase.execute(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async updateResultado(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const { resultado } = req.body;
      const updated = await container.updateConvenioResultadoUseCase.execute(id, resultado);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}
