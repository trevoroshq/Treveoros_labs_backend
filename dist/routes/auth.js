"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authController = __importStar(require("../controllers/auth"));
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const rateLimit_1 = require("../middlewares/rateLimit");
const passport_1 = __importDefault(require("../lib/passport"));
const jwt_1 = require("../lib/jwt");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    phone: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const forgotSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
const resetSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
// Email/password routes
router.post('/register', rateLimit_1.authLimiter, (0, validate_1.validate)(registerSchema), authController.register);
router.post('/login', rateLimit_1.authLimiter, (0, validate_1.validate)(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', auth_1.requireAuth, authController.me);
router.post('/forgot-password', rateLimit_1.authLimiter, (0, validate_1.validate)(forgotSchema), authController.forgotPassword);
router.post('/reset-password', rateLimit_1.authLimiter, (0, validate_1.validate)(resetSchema), authController.resetPassword);
// Google OAuth
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed` }), (req, res) => {
    const user = req.user;
    const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
    res.cookie('token', token, jwt_1.COOKIE_OPTIONS);
    const returnTo = req.query.state || '/dashboard';
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}${returnTo}`);
});
exports.default = router;
//# sourceMappingURL=auth.js.map