import { Request, Response, NextFunction } from 'express';
import * as certificatesService from '../services/certificates';
import { sendCertificateIssuedEmail } from '../services/email';

export async function generate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const certificate = await certificatesService.generateCertificate(req.body);

    // Fire certificate email with logo + preview (non-blocking)
    if (certificate.user?.email && certificate.user?.name) {
      sendCertificateIssuedEmail(
        certificate.user.email,
        certificate.user.name,
        certificate.programName,
        certificate.performance as 'EXCEPTIONAL' | 'STRONG' | 'SATISFACTORY',
        certificate.code,
      ).catch((err) => console.error('[EMAIL] Certificate email failed:', err));
    }

    res.status(201).json({ message: 'Certificate generated', certificate });
  } catch (error) {
    next(error);
  }
}

export async function verify(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const code = req.params.code as string;
    const certificate = await certificatesService.verifyCertificate(code);
    res.json({ valid: true, certificate });
  } catch (error) {
    next(error);
  }
}

export async function getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.userId as string;
    const certificates = await certificatesService.getCertificatesByUser(userId);
    res.json({ certificates });
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const certificates = await certificatesService.getAllCertificates();
    res.json({ certificates });
  } catch (error) {
    next(error);
  }
}
