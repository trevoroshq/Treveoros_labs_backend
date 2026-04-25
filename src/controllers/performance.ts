import { Request, Response, NextFunction } from 'express';
import * as performanceService from '../services/performance';

export async function leaderboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await performanceService.getLeaderboard();
    res.json({ leaderboard: data });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.userId as string;
    const score = await performanceService.updatePerformance(userId, req.body);
    res.json({ message: 'Score updated', score });
  } catch (error) {
    next(error);
  }
}

export async function getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.userId as string;
    const scores = await performanceService.getPerformanceByUser(userId);
    res.json({ scores });
  } catch (error) {
    next(error);
  }
}
