import { Router } from 'express';
import { listController } from '../controllers/list.controller';
import { asyncHandler } from '../middlewares';
import {
  validateCreateList,
  validateUpdateList,
  validateListIdParam,
} from '../validators/list.validator';

const router = Router();

/**
 * @route   GET /api/lists
 * @desc    Get all lists
 * @access  Public
 */
router.get('/', asyncHandler(listController.getAll.bind(listController)));

/**
 * @route   GET /api/lists/:id
 * @desc    Get list by ID
 * @access  Public
 */
router.get('/:id', validateListIdParam, asyncHandler(listController.getById.bind(listController)));

/**
 * @route   POST /api/lists
 * @desc    Create a new list
 * @access  Public
 */
router.post('/', validateCreateList, asyncHandler(listController.create.bind(listController)));

/**
 * @route   PUT /api/lists/:id
 * @desc    Update list by ID
 * @access  Public
 */
router.put(
  '/:id',
  validateListIdParam,
  validateUpdateList,
  asyncHandler(listController.update.bind(listController))
);

/**
 * @route   DELETE /api/lists/:id
 * @desc    Delete list by ID
 * @access  Public
 */
router.delete(
  '/:id',
  validateListIdParam,
  asyncHandler(listController.delete.bind(listController))
);

export default router;
