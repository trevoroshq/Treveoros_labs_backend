export declare function sendApplicationSubmittedEmail(to: string, name: string, track: string): Promise<void>;
export declare function sendApplicationAcceptedEmail(to: string, name: string, track: string): Promise<void>;
export declare function sendApplicationRejectedEmail(to: string, name: string, track: string, adminNotes?: string): Promise<void>;
export declare function sendWelcomeEmail(to: string, name: string, track: string): Promise<void>;
export declare function sendEnrollmentBatchEmail(to: string, name: string, track: string, batch: {
    name: string;
    startDate: Date;
    endDate: Date;
    whatsappLink: string;
} | null): Promise<void>;
export declare function sendCertificateIssuedEmail(to: string, name: string, programName: string, performance: 'EXCEPTIONAL' | 'STRONG' | 'SATISFACTORY', code: string): Promise<void>;
export declare function sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<void>;
//# sourceMappingURL=email.d.ts.map