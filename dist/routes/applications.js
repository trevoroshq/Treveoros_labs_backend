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
const applicationsController = __importStar(require("../controllers/applications"));
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const createSchema = zod_1.z.object({
    track: zod_1.z.enum(['FOUNDATION', 'BUILDER']),
    motivation: zod_1.z.string().min(10, 'Motivation is required'),
    experience: zod_1.z.string().optional(),
    portfolio: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    github: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    // multi-step form fields
    college: zod_1.z.string().optional(),
    degree: zod_1.z.string().optional(),
    graduationYear: zod_1.z.string().optional(),
    batchDate: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACCEPTED', 'REJECTED']),
    adminNotes: zod_1.z.string().optional(),
});
router.post('/', auth_1.requireAuth, (0, validate_1.validate)(createSchema), applicationsController.create);
router.get('/', auth_1.requireAdmin, applicationsController.list);
router.get('/me', auth_1.requireAuth, applicationsController.getMyApplications);
router.get('/:id', auth_1.requireAuth, applicationsController.getById);
router.patch('/:id/status', auth_1.requireAdmin, (0, validate_1.validate)(updateStatusSchema), applicationsController.updateStatus);
exports.default = router;
//# sourceMappingURL=applications.js.map