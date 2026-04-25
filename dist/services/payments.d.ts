export declare function createPaymentOrder(userId: string, amount: number): Promise<{
    payment: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: number;
        currency: string;
        razorpayOrderId: string | null;
        razorpayPaymentId: string | null;
    };
    razorpayOrderId: string;
}>;
export declare function verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: import(".prisma/client").$Enums.PaymentStatus;
    amount: number;
    currency: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
}>;
export declare function getPaymentsByUser(userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: import(".prisma/client").$Enums.PaymentStatus;
    amount: number;
    currency: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
}[]>;
export declare function getAllPayments(): Promise<({
    user: {
        name: string;
        id: string;
        email: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: import(".prisma/client").$Enums.PaymentStatus;
    amount: number;
    currency: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
})[]>;
//# sourceMappingURL=payments.d.ts.map