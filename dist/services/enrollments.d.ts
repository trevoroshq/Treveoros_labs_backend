export declare function createEnrollment(userId: string, programId: string): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
    };
    program: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        track: import(".prisma/client").$Enums.Track;
        description: string | null;
        price: number;
        startDate: Date;
        endDate: Date;
        maxSeats: number;
        isActive: boolean;
    };
    batch: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        track: import(".prisma/client").$Enums.Track;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        whatsappLink: string;
    } | null;
} & {
    id: string;
    updatedAt: Date;
    userId: string;
    status: import(".prisma/client").$Enums.EnrollmentStatus;
    programId: string;
    batchId: string | null;
    enrolledAt: Date;
}>;
export declare function getEnrollmentsByUser(userId: string): Promise<({
    program: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        track: import(".prisma/client").$Enums.Track;
        description: string | null;
        price: number;
        startDate: Date;
        endDate: Date;
        maxSeats: number;
        isActive: boolean;
    };
} & {
    id: string;
    updatedAt: Date;
    userId: string;
    status: import(".prisma/client").$Enums.EnrollmentStatus;
    programId: string;
    batchId: string | null;
    enrolledAt: Date;
})[]>;
export declare function getAllEnrollments(): Promise<({
    user: {
        name: string;
        id: string;
        email: string;
    };
    program: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        track: import(".prisma/client").$Enums.Track;
        description: string | null;
        price: number;
        startDate: Date;
        endDate: Date;
        maxSeats: number;
        isActive: boolean;
    };
} & {
    id: string;
    updatedAt: Date;
    userId: string;
    status: import(".prisma/client").$Enums.EnrollmentStatus;
    programId: string;
    batchId: string | null;
    enrolledAt: Date;
})[]>;
export declare function updateEnrollmentStatus(id: string, status: 'ACTIVE' | 'COMPLETED' | 'DROPPED'): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
    };
    program: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        track: import(".prisma/client").$Enums.Track;
        description: string | null;
        price: number;
        startDate: Date;
        endDate: Date;
        maxSeats: number;
        isActive: boolean;
    };
} & {
    id: string;
    updatedAt: Date;
    userId: string;
    status: import(".prisma/client").$Enums.EnrollmentStatus;
    programId: string;
    batchId: string | null;
    enrolledAt: Date;
}>;
//# sourceMappingURL=enrollments.d.ts.map