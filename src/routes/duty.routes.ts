import { Router } from 'express';
import { dutyController } from '../controllers/duty.controller';
import { asyncHandler } from '../middlewares';
import {
  validateCreateDuty,
  validateUpdateDuty,
  validateIdParam,
} from '../validators/duty.validator';

const router = Router();

/**
 * @route   GET /api/duties
 * @desc    Get all duties
 * @access  Public
 */
router.get('/', asyncHandler(dutyController.getAll.bind(dutyController)));

/**
 * @route   GET /api/duties/:id
 * @desc    Get duty by ID
 * @access  Public
 */
router.get('/:id', validateIdParam, asyncHandler(dutyController.getById.bind(dutyController)));

/**
 * @route   POST /api/duties
 * @desc    Create a new duty
 * @access  Public
 */
router.post('/', validateCreateDuty, asyncHandler(dutyController.create.bind(dutyController)));

/**
 * @route   PUT /api/duties/:id
 * @desc    Update duty by ID
 * @access  Public
 */
router.put(
  '/:id',
  validateIdParam,
  validateUpdateDuty,
  asyncHandler(dutyController.update.bind(dutyController))
);

/**
 * @route   DELETE /api/duties/:id
 * @desc    Delete duty by ID
 * @access  Public
 */
router.delete('/:id', validateIdParam, asyncHandler(dutyController.delete.bind(dutyController)));

export default router;
