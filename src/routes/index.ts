import { Router } from 'express';
import dutyRoutes from './duty.routes';
import listRoutes from './list.routes';
import { healthController } from '../controllers/health.controller';
import { asyncHandler } from '../middlewares';

const router = Router();

router.use('/duties', dutyRoutes);
router.use('/lists', listRoutes);
router.get('/health', asyncHandler(healthController.status.bind(healthController)));

export default router;
