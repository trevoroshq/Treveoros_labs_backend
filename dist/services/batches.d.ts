export declare function createBatch(data: {
    name: string;
    track: 'FOUNDATION' | 'BUILDER';
    startDate: string;
    endDate: string;
    whatsappLink: string;
    isActive?: boolean;
}): Promise<{
    _count: {
        enrollments: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    track: import(".prisma/client").$Enums.Track;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    whatsappLink: string;
}>;
export declare function updateBatch(id: string, data: {
    name?: string;
    track?: 'FOUNDATION' | 'BUILDER';
    startDate?: string;
    endDate?: string;
    whatsappLink?: string;
    isActive?: boolean;
}): Promise<{
    _count: {
        enrollments: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    track: import(".prisma/client").$Enums.Track;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    whatsappLink: string;
}>;
export declare function listBatches(): Promise<({
    _count: {
        enrollments: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    track: import(".prisma/client").$Enums.Track;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    whatsappLink: string;
})[]>;
export declare function getActiveBatch(track: 'FOUNDATION' | 'BUILDER'): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    track: import(".prisma/client").$Enums.Track;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    whatsappLink: string;
} | null>;
export declare function deactivateBatch(id: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    track: import(".prisma/client").$Enums.Track;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    whatsappLink: string;
}>;
//# sourceMappingURL=batches.d.ts.map