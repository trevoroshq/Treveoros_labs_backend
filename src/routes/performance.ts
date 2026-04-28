import { Router } from 'express';
import { z } from 'zod';
import * as performanceController from '../controllers/performance';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';

const router = Router();

const updateSchema = z.object({
  weekNumber: z.number().min(1),
  projectScore: z.number().min(0).max(100).optional(),
  quizScore: z.number().min(0).max(100).optional(),
  participationScore: z.number().min(0).max(100).optional(),
});

router.get('/leaderboard', performanceController.leaderboard);
router.get('/:userId', requireAuth, (req, res, next) => {
  // Authorization: Users can only view their own performance unless they're admin
  if (req.user!.role !== 'ADMIN' && req.params.userId !== req.user!.id) {
    res.status(403).json({ message: 'Cannot view other users\' performance scores' });
    return;
  }
  next();
}, performanceController.getByUser);
router.patch('/:userId', requireAdmin, validate(updateSchema), performanceController.update);

export default router;
