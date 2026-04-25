import { Router } from 'express';
import * as adminController from '../controllers/admin';
import { requireAdmin } from '../middlewares/auth';

const router = Router();

router.get('/stats', requireAdmin, adminController.stats);
router.get('/users', requireAdmin, adminController.users);

export default router;
