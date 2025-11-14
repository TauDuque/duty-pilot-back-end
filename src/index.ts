import express, { Application } from 'express';
import { env } from './config/env';
import { testConnection } from './config/database';
import { corsMiddleware, errorHandler, notFoundHandler, requestLogger } from './middlewares';
import routes from './routes';
import { logger } from './utils/logger';

const app: Application = express();

// Middlewares
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Routes
app.use('/api', routes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await testConnection();

    // Start server
    app.listen(env.port, () => {
      logger.info(
        {
          environment: env.nodeEnv,
          port: env.port,
          corsOrigin: env.corsOrigin,
        },
        'Duty Pilot backend server started'
      );
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();

export default app;
