import { Router } from 'express';
import { AtencionController } from '../controllers/AtencionController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createAtencionSchema } from '../dtos/validators.js';

const router = Router();
const controller = new AtencionController();

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', validateRequest(createAtencionSchema), (req, res, next) => controller.create(req, res, next));

export default router;
