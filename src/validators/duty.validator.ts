import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares';

export const validateCreateDuty = (req: Request, _res: Response, next: NextFunction): void => {
  const { name } = req.body as { name?: unknown };

  if (!name) {
    throw new AppError(400, 'Name is required');
  }

  if (typeof name !== 'string') {
    throw new AppError(400, 'Name must be a string');
  }

  if (name.trim().length === 0) {
    throw new AppError(400, 'Name cannot be empty');
  }

  if (name.length > 255) {
    throw new AppError(400, 'Name must be less than 255 characters');
  }

  next();
};

export const validateUpdateDuty = (req: Request, _res: Response, next: NextFunction): void => {
  const { name } = req.body as { name?: unknown };

  if (!name) {
    throw new AppError(400, 'Name is required');
  }

  if (typeof name !== 'string') {
    throw new AppError(400, 'Name must be a string');
  }

  if (name.trim().length === 0) {
    throw new AppError(400, 'Name cannot be empty');
  }

  if (name.length > 255) {
    throw new AppError(400, 'Name must be less than 255 characters');
  }

  next();
};

export const validateIdParam = (req: Request, _res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!id) {
    throw new AppError(400, 'ID is required');
  }

  // UUID validation regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(id)) {
    throw new AppError(400, 'Invalid ID format');
  }

  next();
};
