import express from 'express';
import {
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from '../controllers/branchController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(listBranches)
  .post(protect, requireRole('admin', 'hr'), createBranch);

router
  .route('/:id')
  .put(protect, requireRole('admin', 'hr'), updateBranch)
  .delete(protect, requireRole('admin', 'hr'), deleteBranch);

export default router;
