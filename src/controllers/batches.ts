import { Request, Response, NextFunction } from 'express';
import * as batchesService from '../services/batches';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const batch = await batchesService.createBatch(req.body);
    res.status(201).json({ message: 'Batch created', batch });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const batch = await batchesService.updateBatch(req.params.id as string, req.body);
    res.json({ message: 'Batch updated', batch });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const batches = await batchesService.listBatches();
    res.json({ batches });
  } catch (error) {
    next(error);
  }
}

export async function getActive(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const track = req.params.track as 'FOUNDATION' | 'BUILDER';
    const batch = await batchesService.getActiveBatch(track);
    res.json({ batch }); // null if none found
  } catch (error) {
    next(error);
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const batch = await batchesService.deactivateBatch(req.params.id as string);
    res.json({ message: 'Batch deactivated', batch });
  } catch (error) {
    next(error);
  }
}
