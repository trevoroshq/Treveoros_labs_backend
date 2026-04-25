import { Request, Response, NextFunction } from 'express';
import * as enrollmentsService from '../services/enrollments';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, programId } = req.body;
    const enrollment = await enrollmentsService.createEnrollment(userId, programId);
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    next(error);
  }
}

export async function getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.userId as string;
    const enrollments = await enrollmentsService.getEnrollmentsByUser(userId);
    res.json({ enrollments });
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const enrollments = await enrollmentsService.getAllEnrollments();
    res.json({ enrollments });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const enrollment = await enrollmentsService.updateEnrollmentStatus(id, req.body.status);
    res.json({ message: 'Status updated', enrollment });
  } catch (error) {
    next(error);
  }
}
