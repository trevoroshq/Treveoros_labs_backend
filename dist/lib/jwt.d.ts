interface JwtPayload {
    userId: string;
    role: string;
}
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
export declare const COOKIE_OPTIONS: {
    domain?: string | undefined;
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax";
    maxAge: number;
    path: string;
};
export {};
//# sourceMappingURL=jwt.d.ts.map