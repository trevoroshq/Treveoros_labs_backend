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
const paymentsController = __importStar(require("../controllers/payments"));
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const rateLimit_1 = require("../middlewares/rateLimit");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
    amount: zod_1.z.number().min(100, 'Amount must be at least 100 paise'),
});
const verifySchema = zod_1.z.object({
    razorpay_order_id: zod_1.z.string().min(1),
    razorpay_payment_id: zod_1.z.string().min(1),
    razorpay_signature: zod_1.z.string().min(1),
});
router.post('/create-order', auth_1.requireAuth, rateLimit_1.paymentLimiter, (0, validate_1.validate)(createOrderSchema), paymentsController.createOrder);
router.post('/verify', auth_1.requireAuth, (0, validate_1.validate)(verifySchema), paymentsController.verifyPayment);
router.post('/webhook', rateLimit_1.webhookLimiter, paymentsController.webhook);
router.get('/all', auth_1.requireAdmin, paymentsController.getAll);
router.get('/:userId', auth_1.requireAuth, paymentsController.getByUser);
exports.default = router;
//# sourceMappingURL=payments.js.map