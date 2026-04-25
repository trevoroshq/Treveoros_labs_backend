"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUserById = getUserById;
exports.requestPasswordReset = requestPasswordReset;
exports.resetPassword = resetPassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_1 = require("../lib/jwt");
const errorHandler_1 = require("../middlewares/errorHandler");
const email_1 = require("./email");
async function registerUser(data) {
    const existing = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (existing) {
        throw new errorHandler_1.AppError('Email already registered', 409);
    }
    const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email.toLowerCase(),
            passwordHash,
            phone: data.phone,
        },
        select: { id: true, email: true, name: true, phone: true, role: true },
    });
    const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
    return { user, token };
}
async function loginUser(email, password) {
    const user = await prisma_1.default.user.findUnique({
        where: { email: email.toLowerCase() },
    });
    if (!user) {
        throw new errorHandler_1.AppError('Invalid email or password', 401);
    }
    if (!user.passwordHash) {
        throw new errorHandler_1.AppError('This account uses Google or GitHub login. Please sign in with your OAuth provider.', 401);
    }
    const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        throw new errorHandler_1.AppError('Invalid email or password', 401);
    }
    const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
}
async function getUserById(userId) {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404);
    }
    return user;
}
async function requestPasswordReset(email) {
    const user = await prisma_1.default.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user) {
        // Clear any existing tokens
        await prisma_1.default.passwordResetToken.deleteMany({ where: { userId: user.id } });
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await prisma_1.default.passwordResetToken.create({
            data: { userId: user.id, token, expiresAt },
        });
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        (0, email_1.sendPasswordResetEmail)(user.email, user.name, resetUrl).catch(console.error);
    }
    // Always return same message to prevent email enumeration
    return { message: 'If this email is registered, you will receive a reset link shortly.' };
}
async function resetPassword(token, newPassword) {
    const resetToken = await prisma_1.default.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
    });
    if (!resetToken) {
        throw new errorHandler_1.AppError('Invalid or expired reset token', 400);
    }
    if (resetToken.expiresAt < new Date()) {
        await prisma_1.default.passwordResetToken.delete({ where: { token } });
        throw new errorHandler_1.AppError('Reset token has expired. Please request a new one.', 400);
    }
    const passwordHash = await bcryptjs_1.default.hash(newPassword, 12);
    await prisma_1.default.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
    });
    await prisma_1.default.passwordResetToken.delete({ where: { token } });
    return { message: 'Password reset successfully. You can now sign in.' };
}
//# sourceMappingURL=auth.js.map