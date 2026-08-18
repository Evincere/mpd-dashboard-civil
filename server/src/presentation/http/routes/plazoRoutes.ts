import { Router } from 'express';
import { PlazoController } from '../controllers/PlazoController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createPlazoSchema } from '../dtos/validators.js';

const router = Router();
const controller = new PlazoController();

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', validateRequest(createPlazoSchema), (req, res, next) => controller.create(req, res, next));
router.patch('/:id/toggle', (req, res, next) => controller.toggleComplete(req, res, next));

export default router;
