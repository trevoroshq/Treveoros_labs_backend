"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.me = me;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.refresh = refresh;
const auth_1 = require("../services/auth");
const jwt_1 = require("../lib/jwt");
const prisma_1 = __importDefault(require("../lib/prisma"));
async function register(req, res, next) {
    try {
        const { name, email, password, phone } = req.body;
        const { user, token } = await (0, auth_1.registerUser)({ name, email, password, phone });
        res.cookie('token', token, jwt_1.COOKIE_OPTIONS);
        res.status(201).json({ message: 'Account created', user });
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const { user, token } = await (0, auth_1.loginUser)(email, password);
        res.cookie('token', token, jwt_1.COOKIE_OPTIONS);
        res.json({ message: 'Login successful', user });
    }
    catch (error) {
        next(error);
    }
}
async function logout(_req, res) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
        path: '/',
        ...(isProduction && { domain: '.trevoros.com' }),
    });
    res.json({ message: 'Logged out' });
}
async function me(req, res, next) {
    try {
        const user = await (0, auth_1.getUserById)(req.user.id);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
}
async function forgotPassword(req, res, next) {
    try {
        const result = await (0, auth_1.requestPasswordReset)(req.body.email);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
async function resetPassword(req, res, next) {
    try {
        const { token, password } = req.body;
        const result = await (0, auth_1.resetPassword)(token, password);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
async function refresh(req, res, next) {
    try {
        const token = req.cookies?.token;
        console.log('[Refresh] Token present:', !!token);
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        // Verify the token (will throw if expired or invalid)
        const payload = (0, jwt_1.verifyToken)(token);
        console.log('[Refresh] Token verified for user:', payload.userId);
        // Get the user from the database
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, name: true, phone: true, role: true },
        });
        if (!user) {
            console.log('[Refresh] User not found:', payload.userId);
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Issue a new token
        const newToken = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
        res.cookie('token', newToken, jwt_1.COOKIE_OPTIONS);
        console.log('[Refresh] New token issued for user:', user.id);
        res.json({ message: 'Token refreshed', user });
    }
    catch (error) {
        console.error('[Refresh] Error:', error instanceof Error ? error.message : String(error));
        next(error);
    }
}
//# sourceMappingURL=auth.js.map