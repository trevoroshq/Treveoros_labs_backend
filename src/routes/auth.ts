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
router.get('/google', 
  (req, res, next) => {
    // Store the return URL in session or pass it as state
    const state = req.query.state || '/dashboard';
    req.query.state = state;
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = signToken({ userId: user.id, role: user.role });
    res.cookie('token', token, COOKIE_OPTIONS);
    // Get return URL from state parameter (already decoded by Passport)
    let returnTo = (req.query.state as string) || '/dashboard';
    // Validate redirect URL: must be absolute path starting with single /
    // Reject: //, //attacker.com, http://, https://, etc.
    if (!returnTo.startsWith('/') || returnTo.startsWith('//')) {
      returnTo = '/dashboard';
    }
    // Additional validation: ensure no protocol
    try {
      new URL('http://localhost' + returnTo);
    } catch {
      returnTo = '/dashboard';
    }
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}${returnTo}`);
  }
);

export default router;
