import { Router } from 'express';
import { z } from 'zod';
import * as applicationsController from '../controllers/applications';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';

const router = Router();

const createSchema = z.object({
  track: z.enum(['FOUNDATION', 'BUILDER']),
  motivation: z.string().min(10, 'Motivation is required'),
  experience: z.string().optional(),
  portfolio: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  // multi-step form fields
  college: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.string().optional(),
  batchDate: z.string().optional(),
  phone: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
  adminNotes: z.string().optional(),
});

router.post('/', requireAuth, validate(createSchema), applicationsController.create);
router.get('/', requireAdmin, applicationsController.list);
router.get('/me', requireAuth, applicationsController.getMyApplications);
router.get('/:id', requireAuth, applicationsController.getById);
router.patch('/:id/status', requireAdmin, validate(updateStatusSchema), applicationsController.updateStatus);

export default router;
