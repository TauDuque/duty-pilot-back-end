import pino, { Logger } from 'pino';
import type { Request } from 'express';

const level = process.env.LOG_LEVEL ?? 'info';

export const logger: Logger = pino({
  level,
  base: {
    service: 'duty-pilot-backend',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const getRequestLogger = (req?: Request): Logger => {
  if (!req) {
    return logger;
  }

  const requestWithLogger = req as Request & { log?: Logger };
  return requestWithLogger.log ?? logger;
};
