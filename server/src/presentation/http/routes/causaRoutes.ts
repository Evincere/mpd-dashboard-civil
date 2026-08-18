import { Router } from 'express';
import { CausaController } from '../controllers/CausaController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createCausaSchema } from '../dtos/validators.js';

const router = Router();
const controller = new CausaController();

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', validateRequest(createCausaSchema), (req, res, next) => controller.create(req, res, next));

export default router;
