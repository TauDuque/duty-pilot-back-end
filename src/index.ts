import express, { Application } from 'express';
import { env } from './config/env';
import { testConnection } from './config/database';
import { corsMiddleware, errorHandler, notFoundHandler } from './middlewares';
import routes from './routes';

const app: Application = express();

// Middlewares
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
      console.log(`
╔════════════════════════════════════════════╗
║     🚀 Duty Pilot Backend Server         ║
╠════════════════════════════════════════════╣
║  Environment: ${env.nodeEnv.padEnd(30)}║
║  Port:        ${env.port.toString().padEnd(30)}║
║  CORS Origin: ${env.corsOrigin.padEnd(30)}║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
