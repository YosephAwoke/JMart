import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use('/api', apiRouter);
  app.get('/health', (_, res) => res.json({ status: 'ok', service: 'jmart-api' }));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}