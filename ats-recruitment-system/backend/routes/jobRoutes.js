import express from 'express';
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { protect, requireRole, tryProtect } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(tryProtect, listJobs)
  .post(protect, requireRole('admin', 'hr'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, requireRole('admin', 'hr'), updateJob)
  .delete(protect, requireRole('admin'), deleteJob);

export default router;
