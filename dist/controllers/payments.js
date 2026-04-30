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
exports.createOrder = createOrder;
exports.verifyPayment = verifyPayment;
exports.webhook = webhook;
exports.getByUser = getByUser;
exports.getAll = getAll;
const paymentsService = __importStar(require("../services/payments"));
async function createOrder(req, res, next) {
    try {
        const { amount } = req.body;
        const result = await paymentsService.createPaymentOrder(req.user.id, amount);
        res.status(201).json({ message: 'Order created', ...result });
    }
    catch (error) {
        next(error);
    }
}
// Called by frontend after Razorpay checkout succeeds (with signature)
async function verifyPayment(req, res, next) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const payment = await paymentsService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        res.json({ message: 'Payment verified', payment });
    }
    catch (error) {
        next(error);
    }
}
// Razorpay server-to-server webhook (signature verification required)
async function webhook(req, res, next) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        // Signature must be present and non-empty
        if (!razorpay_signature || typeof razorpay_signature !== 'string' || razorpay_signature.trim() === '') {
            res.status(400).json({ message: 'Missing or invalid signature' });
            return;
        }
        const payment = await paymentsService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        res.json({ message: 'Webhook processed', payment });
    }
    catch (error) {
        next(error);
    }
}
async function getByUser(req, res, next) {
    try {
        const userId = req.params.userId;
        // Authorization: Users can only view their own payment history
        if (userId !== req.user.id) {
            res.status(403).json({ message: 'Cannot view other users\' payment history' });
            return;
        }
        const payments = await paymentsService.getPaymentsByUser(userId);
        res.json({ payments });
    }
    catch (error) {
        next(error);
    }
}
async function getAll(req, res, next) {
    try {
        const payments = await paymentsService.getAllPayments();
        res.json({ payments });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=payments.js.map