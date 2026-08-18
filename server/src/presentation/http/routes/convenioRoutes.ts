import { Router } from 'express';
import { ConvenioController } from '../controllers/ConvenioController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createConvenioSchema, updateConvenioResultadoSchema } from '../dtos/validators.js';

const router = Router();
const controller = new ConvenioController();

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', validateRequest(createConvenioSchema), (req, res, next) => controller.create(req, res, next));
router.patch('/:id/resultado', validateRequest(updateConvenioResultadoSchema), (req, res, next) => controller.updateResultado(req, res, next));

export default router;
