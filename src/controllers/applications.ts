import { Request, Response, NextFunction } from 'express';
import * as applicationsService from '../services/applications';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const application = await applicationsService.createApplication(req.user!.id, req.body);
    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    next(error);
  }
}

export async function getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const applications = await applicationsService.getApplicationsByUserId(req.user!.id);
    res.json({ applications });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const track = typeof req.query.track === 'string' ? req.query.track : undefined;
    const applications = await applicationsService.listApplications({ status, track });
    res.json({ applications });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const application = await applicationsService.getApplicationById(id);
    res.json({ application });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const application = await applicationsService.updateApplicationStatus(id, req.body);
    res.json({ message: 'Status updated', application });
  } catch (error) {
    next(error);
  }
}
