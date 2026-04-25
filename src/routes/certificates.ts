import { Router } from 'express';
import { z } from 'zod';
import * as certificatesController from '../controllers/certificates';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';

const router = Router();

const generateSchema = z.object({
  userId: z.string(),
  performance: z.enum(['EXCEPTIONAL', 'STRONG', 'SATISFACTORY']),
  programName: z.string(),
});

router.post('/generate', requireAdmin, validate(generateSchema), certificatesController.generate);
router.get('/all', requireAdmin, certificatesController.getAll);
router.get('/user/:userId', requireAuth, certificatesController.getByUser);
router.get('/:code', certificatesController.verify);

export default router;
