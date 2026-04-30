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
exports.createPaymentOrder = createPaymentOrder;
exports.verifyPayment = verifyPayment;
exports.getPaymentsByUser = getPaymentsByUser;
exports.getAllPayments = getAllPayments;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorHandler_1 = require("../middlewares/errorHandler");
const email_1 = require("./email");
const razorpayLib = __importStar(require("../lib/razorpay"));
async function createPaymentOrder(userId, amount) {
    const order = await razorpayLib.createOrder(amount);
    const razorpayOrderId = order.id;
    const payment = await prisma_1.default.payment.create({
        data: {
            userId,
            amount,
            razorpayOrderId,
            status: 'PENDING',
        },
    });
    return { payment, razorpayOrderId };
}
async function verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const payment = await prisma_1.default.payment.findUnique({
        where: { razorpayOrderId },
        include: { user: true }
    });
    if (!payment) {
        throw new errorHandler_1.AppError('Payment not found', 404);
    }
    // CRITICAL: Always verify signature first, before checking status
    // This prevents race condition where attacker bypasses signature check
    const isValid = razorpayLib.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
        throw new errorHandler_1.AppError('Invalid payment signature', 400);
    }
    // Only after signature is verified, check for idempotency
    if (payment.status === 'COMPLETED') {
        return payment;
    }
    const updatedPayment = await prisma_1.default.payment.update({
        where: { id: payment.id },
        data: {
            razorpayPaymentId,
            status: 'COMPLETED',
        },
    });
    // Lookup track
    const application = await prisma_1.default.application.findFirst({
        where: { userId: payment.userId, status: 'ACCEPTED' },
    });
    const track = application ? application.track : 'FOUNDATION';
    // Dispatch the async welcome email (only on first completion)
    (0, email_1.sendWelcomeEmail)(payment.user.email, payment.user.name, track).catch(err => {
        console.error('[Payment] Failed to send welcome email:', err instanceof Error ? err.message : err);
    });
    return updatedPayment;
}
async function getPaymentsByUser(userId) {
    return prisma_1.default.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
async function getAllPayments() {
    return prisma_1.default.payment.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
//# sourceMappingURL=payments.js.map