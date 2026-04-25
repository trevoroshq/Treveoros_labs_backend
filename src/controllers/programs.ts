import { Request, Response, NextFunction } from 'express';
import * as programsService from '../services/programs';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const program = await programsService.createProgram(req.body);
    res.status(201).json({ message: 'Program created', program });
  } catch (error) {
    next(error);
  }
}

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const programs = await programsService.listPrograms();
    res.json({ programs });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const program = await programsService.updateProgram(id, req.body);
    res.json({ message: 'Program updated', program });
  } catch (error) {
    next(error);
  }
}
