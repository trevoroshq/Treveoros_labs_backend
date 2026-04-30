import { Request, Response, NextFunction } from 'express';
export declare function register(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logout(_req: Request, res: Response): Promise<void>;
export declare function me(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map