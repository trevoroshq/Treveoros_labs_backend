export declare function generateCertificate(data: {
    userId: string;
    performance: 'EXCEPTIONAL' | 'STRONG' | 'SATISFACTORY';
    programName: string;
}): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
    };
} & {
    id: string;
    userId: string;
    code: string;
    performance: import(".prisma/client").$Enums.CertPerformance;
    programName: string;
    pdfUrl: string | null;
    issuedAt: Date;
}>;
export declare function verifyCertificate(code: string): Promise<{
    user: {
        name: string;
        id: string;
    };
} & {
    id: string;
    userId: string;
    code: string;
    performance: import(".prisma/client").$Enums.CertPerformance;
    programName: string;
    pdfUrl: string | null;
    issuedAt: Date;
}>;
export declare function getCertificatesByUser(userId: string): Promise<{
    id: string;
    userId: string;
    code: string;
    performance: import(".prisma/client").$Enums.CertPerformance;
    programName: string;
    pdfUrl: string | null;
    issuedAt: Date;
}[]>;
export declare function getAllCertificates(): Promise<({
    user: {
        name: string;
        id: string;
        email: string;
    };
} & {
    id: string;
    userId: string;
    code: string;
    performance: import(".prisma/client").$Enums.CertPerformance;
    programName: string;
    pdfUrl: string | null;
    issuedAt: Date;
})[]>;
//# sourceMappingURL=certificates.d.ts.map