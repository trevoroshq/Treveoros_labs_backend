import { Router } from 'express';
import { z } from 'zod';
import * as enrollmentsController from '../controllers/enrollments';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';

const router = Router();

const createSchema = z.object({
  userId: z.string(),
  programId: z.string(),
});

const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'DROPPED']),
});

router.post('/student', requireAuth, validate(createSchema), enrollmentsController.create);
router.post('/', requireAuth, validate(createSchema), enrollmentsController.create);
router.get('/all', requireAdmin, enrollmentsController.getAll);
router.get('/:userId', requireAuth, enrollmentsController.getByUser);
router.patch('/:id/status', requireAdmin, validate(updateStatusSchema), enrollmentsController.updateStatus);

export default router;
// Trigger reboot
