import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById, requestPasswordReset, resetPassword as resetPasswordService } from '../services/auth';
import { COOKIE_OPTIONS, signToken, verifyToken } from '../lib/jwt';
import prisma from '../lib/prisma';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, phone } = req.body;
    const { user, token } = await registerUser({ name, email, password, phone });

    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ message: 'Account created', user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ message: 'Login successful', user });
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    path: '/',
    ...(isProduction && { domain: '.trevoros.com' }),
  });
  res.json({ message: 'Logged out' });
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getUserById(req.user!.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await requestPasswordReset(req.body.email);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body;
    const result = await resetPasswordService(token, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const raw = req.cookies?.token;
    const token = Array.isArray(raw) ? raw[raw.length - 1] : raw;
    console.log('[Refresh] Token present:', !!token);

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    // Verify the token (will throw if expired or invalid)
    const payload = verifyToken(token);
    console.log('[Refresh] Token verified for user:', payload.userId);

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, phone: true, role: true },
    });

    if (!user) {
      console.log('[Refresh] User not found:', payload.userId);
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Issue a new token
    const newToken = signToken({ userId: user.id, role: user.role });
    res.cookie('token', newToken, COOKIE_OPTIONS);
    console.log('[Refresh] New token issued for user:', user.id);
    res.json({ message: 'Token refreshed', user });
  } catch (error) {
    console.error('[Refresh] Error:', error instanceof Error ? error.message : String(error));
    next(error);
  }
}
