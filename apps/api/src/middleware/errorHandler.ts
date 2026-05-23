import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _, res, __) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
};