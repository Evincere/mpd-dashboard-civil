import { Request, Response } from 'express';
import { LoginUseCase } from '../../../application/use-cases/AuthUseCases';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const result = await this.loginUseCase.execute(username, password);
      res.json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Datos de login inválidos' });
      }
      res.status(401).json({ error: error.message });
    }
  }
}
