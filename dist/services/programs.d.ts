export declare function createProgram(data: {
    name: string;
    track: 'FOUNDATION' | 'BUILDER';
    description?: string;
    price: number;
    startDate: string;
    endDate: string;
    maxSeats?: number;
}): Promise<{
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
}>;
export declare function listPrograms(): Promise<({
    _count: {
        enrollments: number;
    };
} & {
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
})[]>;
export declare function updateProgram(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    maxSeats: number;
}>): Promise<{
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
}>;
//# sourceMappingURL=programs.d.ts.map