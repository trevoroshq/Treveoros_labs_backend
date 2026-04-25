import { Router } from 'express';
import { z } from 'zod';
import * as programsController from '../controllers/programs';
import { validate } from '../middlewares/validate';
import { requireAdmin } from '../middlewares/auth';

const router = Router();

const createSchema = z.object({
  name: z.string().min(2),
  track: z.enum(['FOUNDATION', 'BUILDER']),
  description: z.string().optional(),
  price: z.number().min(0),
  startDate: z.string(),
  endDate: z.string(),
  maxSeats: z.number().min(1).optional(),
});

router.get('/', programsController.list);
router.post('/', requireAdmin, validate(createSchema), programsController.create);
router.patch('/:id', requireAdmin, programsController.update);

export default router;
