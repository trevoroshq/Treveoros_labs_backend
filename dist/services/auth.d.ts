export declare function registerUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
}): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
    };
    token: string;
}>;
export declare function loginUser(email: string, password: string): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        googleId: string | null;
        githubId: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    token: string;
}>;
export declare function getUserById(userId: string): Promise<{
    name: string;
    id: string;
    email: string;
    phone: string | null;
    role: import(".prisma/client").$Enums.Role;
    createdAt: Date;
}>;
export declare function requestPasswordReset(email: string): Promise<{
    message: string;
}>;
export declare function resetPassword(token: string, newPassword: string): Promise<{
    message: string;
}>;
//# sourceMappingURL=auth.d.ts.map