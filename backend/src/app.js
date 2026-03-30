import express from 'express';
import cors from 'cors';
import { getEnv } from './config/env.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '');

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const allowedOrigins = new Set(
  (getEnv('CORS_ORIGIN') || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean)
);

const corsOptions = {
  origin: (origin, callback) => {
    const normalizedOrigin = normalizeOrigin(origin || '');
    // Allow non-browser clients (no Origin header) and configured browser origins.
    if (!origin || allowedOrigins.has(normalizedOrigin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS not allowed for this origin'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/profiles', profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
