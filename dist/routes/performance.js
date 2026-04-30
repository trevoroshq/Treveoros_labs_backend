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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const performanceController = __importStar(require("../controllers/performance"));
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const updateSchema = zod_1.z.object({
    weekNumber: zod_1.z.number().min(1),
    projectScore: zod_1.z.number().min(0).max(100).optional(),
    quizScore: zod_1.z.number().min(0).max(100).optional(),
    participationScore: zod_1.z.number().min(0).max(100).optional(),
});
router.get('/leaderboard', performanceController.leaderboard);
router.get('/:userId', auth_1.requireAuth, (req, res, next) => {
    // Authorization: Users can only view their own performance unless they're admin
    if (req.user.role !== 'ADMIN' && req.params.userId !== req.user.id) {
        res.status(403).json({ message: 'Cannot view other users\' performance scores' });
        return;
    }
    next();
}, performanceController.getByUser);
router.patch('/:userId', auth_1.requireAdmin, (0, validate_1.validate)(updateSchema), performanceController.update);
exports.default = router;
//# sourceMappingURL=performance.js.map