import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';
import { getRequestLogger } from '../utils/logger';

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
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const reqLogger = getRequestLogger(req);
  reqLogger.error({ err }, 'Request failed');

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

export const notFoundHandler = (req: Request, res: Response): void => {
  const reqLogger = getRequestLogger(req);
  reqLogger.warn({ path: req.path }, 'Resource not found');
  const response: ErrorResponse = {
    error: 'NotFound',
    message: 'The requested resource was not found',
  };
  res.status(404).json(response);
};
