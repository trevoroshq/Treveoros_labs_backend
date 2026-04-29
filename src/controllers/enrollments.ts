import { Request, Response, NextFunction } from 'express';
import * as enrollmentsService from '../services/enrollments';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, programId } = req.body;
    
    // Authorization: Users can only enroll themselves unless they're admin
    if (req.user!.role !== 'ADMIN' && userId !== req.user!.id) {
      res.status(403).json({ message: 'Can only enroll yourself' });
      return;
    }
    
    const enrollment = await enrollmentsService.createEnrollment(userId, programId);
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    next(error);
  }
}

export async function getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Handle both /my and /:userId routes
    const userId = req.params.userId as string || req.user!.id;
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
