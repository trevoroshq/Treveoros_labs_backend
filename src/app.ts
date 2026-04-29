import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimit';
import passport from 'passport';
import './lib/passport'; // initialize passport strategies

// Routes
import authRoutes from './routes/auth';
import applicationsRoutes from './routes/applications';
import paymentsRoutes from './routes/payments';
import enrollmentsRoutes from './routes/enrollments';
import certificatesRoutes from './routes/certificates';
import performanceRoutes from './routes/performance';
import programsRoutes from './routes/programs';
import adminRoutes from './routes/admin';
import batchesRoutes from './routes/batches';

const app = express();

// Security
app.use(helmet());
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Rate limiting
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/batches', batchesRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
