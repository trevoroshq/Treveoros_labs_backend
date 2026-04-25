export declare function createOrder(amount: number): Promise<{
    id: string;
}>;
export declare function verifySignature(orderId: string, paymentId: string, signature: string): boolean;
//# sourceMappingURL=razorpay.d.ts.map