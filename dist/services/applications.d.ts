export declare function createApplication(userId: string, data: {
    track: 'FOUNDATION' | 'BUILDER';
    motivation: string;
    experience?: string;
    portfolio?: string;
    github?: string;
    college?: string;
    degree?: string;
    graduationYear?: string;
    batchDate?: string;
    phone?: string;
}): Promise<{
    user: {
        name: string;
        email: string;
    };
} & {
    id: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    track: import(".prisma/client").$Enums.Track;
    motivation: string;
    experience: string | null;
    portfolio: string | null;
    github: string | null;
    college: string | null;
    degree: string | null;
    graduationYear: string | null;
    batchDate: string | null;
    status: import(".prisma/client").$Enums.ApplicationStatus;
    adminNotes: string | null;
}>;
export declare function listApplications(filters?: {
    status?: string;
    track?: string;
}): Promise<({
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
    };
} & {
    id: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    track: import(".prisma/client").$Enums.Track;
    motivation: string;
    experience: string | null;
    portfolio: string | null;
    github: string | null;
    college: string | null;
    degree: string | null;
    graduationYear: string | null;
    batchDate: string | null;
    status: import(".prisma/client").$Enums.ApplicationStatus;
    adminNotes: string | null;
})[]>;
export declare function getApplicationById(id: string): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
    };
} & {
    id: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    track: import(".prisma/client").$Enums.Track;
    motivation: string;
    experience: string | null;
    portfolio: string | null;
    github: string | null;
    college: string | null;
    degree: string | null;
    graduationYear: string | null;
    batchDate: string | null;
    status: import(".prisma/client").$Enums.ApplicationStatus;
    adminNotes: string | null;
}>;
export declare function getApplicationsByUserId(userId: string): Promise<{
    id: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    track: import(".prisma/client").$Enums.Track;
    motivation: string;
    experience: string | null;
    portfolio: string | null;
    github: string | null;
    college: string | null;
    degree: string | null;
    graduationYear: string | null;
    batchDate: string | null;
    status: import(".prisma/client").$Enums.ApplicationStatus;
    adminNotes: string | null;
}[]>;
export declare function updateApplicationStatus(id: string, data: {
    status: 'ACCEPTED' | 'REJECTED';
    adminNotes?: string;
}): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
    };
} & {
    id: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    track: import(".prisma/client").$Enums.Track;
    motivation: string;
    experience: string | null;
    portfolio: string | null;
    github: string | null;
    college: string | null;
    degree: string | null;
    graduationYear: string | null;
    batchDate: string | null;
    status: import(".prisma/client").$Enums.ApplicationStatus;
    adminNotes: string | null;
}>;
//# sourceMappingURL=applications.d.ts.map