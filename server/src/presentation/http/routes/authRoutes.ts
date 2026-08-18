import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { LoginUseCase } from '../../../application/use-cases/AuthUseCases.js';
import { PrismaUserRepository } from '../../../infrastructure/persistence/repositories/PrismaUserRepository.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const loginUseCase = new LoginUseCase(userRepository);
const authController = new AuthController(loginUseCase);

router.post('/login', authController.login);

export default router;
