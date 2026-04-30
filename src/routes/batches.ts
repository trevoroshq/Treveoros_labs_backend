import { Router } from 'express';
import { z } from 'zod';
import * as batchesController from '../controllers/batches';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';

const router = Router();

const WHATSAPP_RE = /^https:\/\/chat\.whatsapp\.com\//;

const createSchema = z.object({
  name: z.string().min(3).max(80),
  track: z.enum(['FOUNDATION', 'BUILDER']),
  startDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  endDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  whatsappLink: z.string().regex(WHATSAPP_RE, {
    message: 'Must be a valid WhatsApp group link (https://chat.whatsapp.com/...)',
  }),
  isActive: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

// List all batches (public — no auth needed to see available batch dates)
router.get('/', batchesController.list);

// Get active batch for a specific track (public)
router.get('/active/:track', batchesController.getActive);

// Create (admin only)
router.post('/', requireAdmin, validate(createSchema), batchesController.create);

// Update (admin only)
router.patch('/:id', requireAdmin, validate(updateSchema), batchesController.update);

// Soft deactivate (admin only)
router.delete('/:id', requireAdmin, batchesController.deactivate);

export default router;
