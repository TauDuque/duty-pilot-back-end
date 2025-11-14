import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const existingId = (req.headers['x-request-id'] as string) || (req as { id?: string }).id;
    return existingId ?? randomUUID();
  },
  customSuccessMessage: (req, res) =>
    `${req.method} ${req.url} completed with status ${res.statusCode}`,
  customErrorMessage: (req, res, err) =>
    `${req.method} ${req.url} failed with status ${res.statusCode}: ${err.message}`,
  customProps: (req) => ({
    requestId: (req as { id?: string }).id,
  }),
});
