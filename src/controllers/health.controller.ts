import { Request, Response } from 'express';
import { pool } from '../config/database';
import { getRequestLogger } from '../utils/logger';

class HealthController {
  async status(req: Request, res: Response): Promise<void> {
    const reqLogger = getRequestLogger(req);
    const responsePayload = {
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    };

    try {
      await pool.query('SELECT 1');
      res.status(200).json(responsePayload);
    } catch (error) {
      reqLogger.error({ err: error }, 'Health check failed');
      res.status(503).json({
        status: 'degraded',
        database: 'error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const healthController = new HealthController();
