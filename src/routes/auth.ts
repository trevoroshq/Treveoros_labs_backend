import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authController from '../controllers/auth';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimit';
import passport from '../lib/passport';
import { signToken, COOKIE_OPTIONS } from '../lib/jwt';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Email/password routes
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);
router.post('/forgot-password', authLimiter, validate(forgotSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetSchema), authController.resetPassword);

// Google OAuth
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = signToken({ userId: user.id, role: user.role });
    res.cookie('token', token, COOKIE_OPTIONS);
    // Redirect to dashboard - token is in secure cookie
    res.redirect(`${FRONTEND_URL}/dashboard?oauth_success=true`);
  }
);

export default router;
