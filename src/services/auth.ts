import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { AppError } from '../middlewares/errorHandler';
import { sendPasswordResetEmail } from './email';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      phone: data.phone,
    },
    select: { id: true, email: true, name: true, phone: true, role: true },
  });

  const token = signToken({ userId: user.id, role: user.role });

  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.passwordHash) {
    throw new AppError('This account uses Google or GitHub login. Please sign in with your OAuth provider.', 401);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash as string);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ userId: user.id, role: user.role });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user) {
    // Clear any existing tokens
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    sendPasswordResetEmail(user.email, user.name, resetUrl).catch(console.error);
  }

  // Always return same message to prevent email enumeration
  return { message: 'If this email is registered, you will receive a reset link shortly.' };
}

export async function resetPassword(token: string, newPassword: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    throw new AppError('Reset token has expired. Please request a new one.', 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return { message: 'Password reset successfully. You can now sign in.' };
}
