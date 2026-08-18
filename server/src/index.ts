import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './presentation/http/routes/authRoutes.js';
import plazoRoutes from './presentation/http/routes/plazoRoutes.js';
import causaRoutes from './presentation/http/routes/causaRoutes.js';
import tareaRoutes from './presentation/http/routes/tareaRoutes.js';
import convenioRoutes from './presentation/http/routes/convenioRoutes.js';
import atencionRoutes from './presentation/http/routes/atencionRoutes.js';
import adminRoutes from './presentation/http/routes/adminRoutes.js';

dotenv.config();

// Ensure DATABASE_URL fallback if not set in environment
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:postgrespassword@localhost:5432/defensoria_db?schema=public";
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes with and without /api prefix for proxy resilience
['/api/auth', '/auth'].forEach(p => app.use(p, authRoutes));
['/api/plazos', '/plazos'].forEach(p => app.use(p, plazoRoutes));
['/api/causas', '/causas'].forEach(p => app.use(p, causaRoutes));
['/api/tareas', '/tareas'].forEach(p => app.use(p, tareaRoutes));
['/api/convenios', '/convenios'].forEach(p => app.use(p, convenioRoutes));
['/api/atencion', '/atencion'].forEach(p => app.use(p, atencionRoutes));
['/api/admin', '/admin'].forEach(p => app.use(p, adminRoutes));

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Servidor Backend Hexagonal corriendo en http://0.0.0.0:${PORT}`);
});
