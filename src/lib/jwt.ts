import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET must be set in environment variables for production');
  }
  console.warn('WARNING: JWT_SECRET not set. Using insecure default for development only.');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface JwtPayload {
  userId: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const secret = JWT_SECRET || 'dev-secret-change-me';
  return jwt.sign(payload as object, secret, { expiresIn: JWT_EXPIRES_IN } as any);
}

export function verifyToken(token: string): JwtPayload {
  const secret = JWT_SECRET || 'dev-secret-change-me';
  return jwt.verify(token, secret) as JwtPayload;
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};
