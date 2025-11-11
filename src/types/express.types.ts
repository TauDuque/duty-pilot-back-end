import { Request, Response, NextFunction } from 'express';

export interface AsyncRequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
}
