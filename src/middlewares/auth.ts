import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import prisma from '../lib/prisma';

// Extend Express User for Passport compatibility
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const raw = req.cookies?.token;
    // When duplicate cookies exist (e.g. old domain + new domain scope), the
    // browser sends both and cookie-parser keeps the first. Take the last one
    // (most recently set) to ensure the freshest token is verified.
    const token = Array.isArray(raw) ? raw[raw.length - 1] : raw;

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await requireAuth(req, res, () => {
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ message: 'Admin access required' });
        return;
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
}
