import { Request, Response, NextFunction } from 'express';
export declare function createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function webhook(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=payments.d.ts.map