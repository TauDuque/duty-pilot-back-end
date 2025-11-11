import cors, { CorsOptions } from 'cors';
import { env } from '../config/env';

const corsOptions: CorsOptions = {
  origin: env.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
