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
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://labs.trevoros.com';
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { session: false }, (err: Error | null, user: any, info: any) => {
      if (err) {
        console.error('[Google OAuth] Strategy error:', err.message, err.stack);
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }
      if (!user) {
        console.error('[Google OAuth] No user returned. Info:', JSON.stringify(info));
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }
      try {
        const token = signToken({ userId: user.id, role: user.role });
        res.cookie('token', token, COOKIE_OPTIONS);
        res.redirect(`${FRONTEND_URL}/dashboard?oauth_success=true`);
      } catch (signErr) {
        console.error('[Google OAuth] Token sign error:', signErr);
        res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }
    })(req, res, next);
  }
);

export default router;
