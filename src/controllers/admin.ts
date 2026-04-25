import { Request, Response, NextFunction } from 'express';
import { getAdminStats, getAllUsers } from '../services/admin';

export async function stats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getAdminStats();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function users(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getAllUsers();
    res.json(data);
  } catch (error) {
    next(error);
  }
}
