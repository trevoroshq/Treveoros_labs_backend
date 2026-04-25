export declare function getAdminStats(): Promise<{
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    totalPayments: number;
    completedPayments: number;
    totalEnrollments: number;
    activeEnrollments: number;
    totalCertificates: number;
    totalUsers: number;
    totalRevenue: number;
    activities: ({
        action: string;
        user: string;
        time: string;
        type: "application";
    } | {
        action: string;
        user: string;
        time: string;
        type: "payment";
    })[];
}>;
export declare function getAllUsers(): Promise<{
    name: string;
    id: string;
    email: string;
    phone: string | null;
    role: import(".prisma/client").$Enums.Role;
    createdAt: Date;
    applications: {
        track: import(".prisma/client").$Enums.Track;
        status: import(".prisma/client").$Enums.ApplicationStatus;
    }[];
    payments: {
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: number;
    }[];
    enrollments: {
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        program: {
            name: string;
        };
    }[];
}[]>;
//# sourceMappingURL=admin.d.ts.map