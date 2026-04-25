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
const enrollmentsController = __importStar(require("../controllers/enrollments"));
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const createSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    programId: zod_1.z.string(),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACTIVE', 'COMPLETED', 'DROPPED']),
});
router.post('/student', auth_1.requireAuth, (0, validate_1.validate)(createSchema), enrollmentsController.create);
router.post('/', auth_1.requireAuth, (0, validate_1.validate)(createSchema), enrollmentsController.create);
router.get('/all', auth_1.requireAdmin, enrollmentsController.getAll);
router.get('/:userId', auth_1.requireAuth, enrollmentsController.getByUser);
router.patch('/:id/status', auth_1.requireAdmin, (0, validate_1.validate)(updateStatusSchema), enrollmentsController.updateStatus);
exports.default = router;
// Trigger reboot
//# sourceMappingURL=enrollments.js.map