import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: err.name,
      message: err.message,
    };

    if (err.details) {
      response.details = err.details;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Default error
  const response: ErrorResponse = {
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  };

  res.status(500).json(response);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  const response: ErrorResponse = {
    error: 'NotFound',
    message: 'The requested resource was not found',
  };
  res.status(404).json(response);
};
