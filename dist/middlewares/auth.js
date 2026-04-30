"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jwt_1 = require("../lib/jwt");
const prisma_1 = __importDefault(require("../lib/prisma"));
async function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        const payload = (0, jwt_1.verifyToken)(token);
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, name: true, role: true },
        });
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
async function requireAdmin(req, res, next) {
    try {
        await requireAuth(req, res, () => {
            if (req.user?.role !== 'ADMIN') {
                res.status(403).json({ message: 'Admin access required' });
                return;
            }
            next();
        });
    }
    catch (error) {
        res.status(401).json({ message: 'Authentication required' });
    }
}
//# sourceMappingURL=auth.js.map