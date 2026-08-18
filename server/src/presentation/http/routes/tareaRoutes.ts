import { Router } from 'express';
import { TareaController } from '../controllers/TareaController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createTareaSchema, updateTareaStatusSchema } from '../dtos/validators.js';

const router = Router();
const controller = new TareaController();

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', validateRequest(createTareaSchema), (req, res, next) => controller.create(req, res, next));
router.patch('/:id/status', validateRequest(updateTareaStatusSchema), (req, res, next) => controller.updateStatus(req, res, next));

export default router;
