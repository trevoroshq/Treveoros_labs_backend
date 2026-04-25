export declare function getLeaderboard(): Promise<{
    rank: number;
    userId: string;
    name: string;
    email: string | undefined;
    track: import(".prisma/client").$Enums.Track;
    totalScore: number;
}[]>;
export declare function updatePerformance(userId: string, data: {
    weekNumber: number;
    projectScore?: number;
    quizScore?: number;
    participationScore?: number;
}): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    weekNumber: number;
    projectScore: number;
    quizScore: number;
    participationScore: number;
    totalScore: number;
}>;
export declare function getPerformanceByUser(userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    weekNumber: number;
    projectScore: number;
    quizScore: number;
    participationScore: number;
    totalScore: number;
}[]>;
//# sourceMappingURL=performance.d.ts.map