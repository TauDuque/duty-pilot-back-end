import { Router } from 'express';
import dutyRoutes from './duty.routes';
import listRoutes from './list.routes';

const router = Router();

router.use('/duties', dutyRoutes);
router.use('/lists', listRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
