import type { RequestHandler } from 'express';

export const notFound: RequestHandler = (_, res) => {
  res.status(404).json({ message: 'Route not found' });
};